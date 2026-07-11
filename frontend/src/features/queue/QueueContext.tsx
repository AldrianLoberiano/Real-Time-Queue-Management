import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { api } from '../../api';

export type StatusType = 'waiting' | 'serving' | 'done' | 'skipped';

export interface QueueItem {
  id: string;
  number: string;
  name: string;
  status: StatusType;
  createdAt: Date;
  calledAt?: Date;
  completedAt?: Date;
}

export interface HourlyData {
  hour: string;
  served: number;
  joined: number;
}

interface QueueContextType {
  items: QueueItem[];
  counter: number;
  joinQueue: (name: string) => Promise<QueueItem | null>;
  callNext: () => Promise<QueueItem | null>;
  doneAndCallNext: (id: string) => Promise<QueueItem | null>;
  skipItem: (id: string) => Promise<void>;
  recallItem: (id: string) => Promise<void>;
  markDone: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  resetQueue: () => Promise<void>;
  clearAll: () => Promise<void>;
  isAdminLoggedIn: boolean;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  currentlyServing: QueueItem | null;
  waitingItems: QueueItem[];
  doneItems: QueueItem[];
  skippedItems: QueueItem[];
  getEstimatedWait: (id: string) => number;
  getPosition: (id: string) => number;
  hourlyData: HourlyData[];
  avgServiceTime: number;
  totalServedToday: number;
  notifications: Notification[];
  dismissNotification: (id: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  cooldownRemaining: number;
  lunchBreak: boolean;
  toggleLunchBreak: () => void;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: Date;
}

const AVG_SERVICE_MINS = 3;
const POLL_INTERVAL = 2000;
const JOIN_COOLDOWN_MS = 5000;

function playServeSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playNote = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };
    playNote(523.25, 0, 0.15);
    playNote(659.25, 0.12, 0.15);
    playNote(783.99, 0.24, 0.25);
  } catch {}
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function mapItem(raw: any): QueueItem {
  return {
    id: raw.id,
    number: raw.number,
    name: raw.name,
    status: raw.status,
    createdAt: new Date(raw.created_at || raw.createdAt),
    calledAt: raw.called_at ? new Date(raw.called_at) : raw.calledAt ? new Date(raw.calledAt) : undefined,
    completedAt: raw.completed_at ? new Date(raw.completed_at) : raw.completedAt ? new Date(raw.completedAt) : undefined,
  };
}

function generateHourlyData(): HourlyData[] {
  const hours = [];
  for (let h = 8; h <= 17; h++) {
    const label = h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`;
    const isPeak = (h >= 9 && h <= 11) || (h >= 13 && h <= 15);
    const served = isPeak
      ? Math.floor(Math.random() * 8) + 10
      : Math.floor(Math.random() * 5) + 3;
    const joined = served + Math.floor(Math.random() * 3);
    hours.push({ hour: label, served, joined });
  }
  return hours;
}

const QueueContext = createContext<QueueContextType | null>(null);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [counter, setCounter] = useState(0);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try { return sessionStorage.getItem('qs_admin') === 'true'; } catch { return false; }
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lunchBreak, setLunchBreak] = useState(false);
  const [hourlyData] = useState<HourlyData[]>(generateHourlyData);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const lastJoinTime = useRef(0);
  const soundEnabledRef = useRef(true);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const isSoundEnabled = useCallback(() => soundEnabledRef.current, []);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const notif: Notification = {
      id: generateId(),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications(prev => [notif, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    }, 5000);
  }, []);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      const elapsed = Date.now() - lastJoinTime.current;
      if (elapsed >= JOIN_COOLDOWN_MS) {
        setCooldownRemaining(0);
        clearInterval(timer);
      } else {
        setCooldownRemaining(Math.ceil((JOIN_COOLDOWN_MS - elapsed) / 1000));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [cooldownRemaining > 0]);

  const fetchItems = useCallback(async () => {
    try {
      const [rawItems, counterRes, soundRes] = await Promise.all([
        api.getItems(),
        api.getCounter(),
        api.getSoundSetting(),
      ]);
      setItems(rawItems.map(mapItem));
      setCounter(counterRes.counter);
      setSoundEnabled(soundRes.enabled);
    } catch {
      // API not available, keep current state
    }
  }, []);

  useEffect(() => {
    fetchItems().finally(() => setLoading(false));
    const interval = setInterval(fetchItems, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchItems]);

  const waitingItems = useMemo(() =>
    items
      .filter(i => i.status === 'waiting')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    [items]
  );

  const currentlyServing = useMemo(() =>
    items.find(i => i.status === 'serving') ?? null,
    [items]
  );

  const doneItems = useMemo(() =>
    items.filter(i => i.status === 'done').sort((a, b) =>
      (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0)
    ),
    [items]
  );

  const skippedItems = useMemo(() =>
    items.filter(i => i.status === 'skipped'),
    [items]
  );

  const totalServedToday = doneItems.length;

  const avgServiceTime = useMemo((): number => {
    const completed = items.filter(i => i.status === 'done' && i.calledAt && i.completedAt);
    if (completed.length === 0) return AVG_SERVICE_MINS;
    const totalMs = completed.reduce((sum, i) => {
      return sum + (i.completedAt!.getTime() - i.calledAt!.getTime());
    }, 0);
    return Math.round(totalMs / completed.length / 60000) || AVG_SERVICE_MINS;
  }, [items]);

  const getPosition = useCallback((id: string): number => {
    const item = items.find(i => i.id === id);
    if (!item || item.status !== 'waiting') return 0;
    return waitingItems.findIndex(i => i.id === id) + 1;
  }, [items, waitingItems]);

  const getEstimatedWait = useCallback((id: string): number => {
    const pos = getPosition(id);
    if (pos === 0) return 0;
    return pos * AVG_SERVICE_MINS;
  }, [getPosition]);

  const joinQueue = useCallback(async (name: string): Promise<QueueItem | null> => {
    const now = Date.now();
    if (now - lastJoinTime.current < JOIN_COOLDOWN_MS) return null;
    try {
      const result = await api.joinQueue(name);
      lastJoinTime.current = Date.now();
      setCooldownRemaining(Math.ceil(JOIN_COOLDOWN_MS / 1000));
      addNotification(`${result.number} - ${name} joined the queue`, 'info');
      await fetchItems();
      return mapItem(result);
    } catch {
      return null;
    }
  }, [addNotification, fetchItems]);

  const callNext = useCallback(async (): Promise<QueueItem | null> => {
    try {
      const result = await api.callNext();
      if (result) {
        addNotification(`Now serving: ${result.number} - ${result.name}`, 'success');
        if (isSoundEnabled()) playServeSound();
        await fetchItems();
        return mapItem(result);
      }
      return null;
    } catch {
      return null;
    }
  }, [addNotification, isSoundEnabled, fetchItems]);

  const doneAndCallNext = useCallback(async (id: string): Promise<QueueItem | null> => {
    try {
      const result = await api.doneAndCallNext(id);
      if (result) {
        if (isSoundEnabled()) playServeSound();
      }
      await fetchItems();
      return result ? mapItem(result) : null;
    } catch {
      return null;
    }
  }, [isSoundEnabled, fetchItems]);

  const skipItem = useCallback(async (id: string) => {
    try {
      const item = items.find(i => i.id === id);
      await api.skip(id);
      if (item) addNotification(`${item.number} - ${item.name} was skipped`, 'warning');
      await fetchItems();
    } catch {}
  }, [items, addNotification, fetchItems]);

  const recallItem = useCallback(async (id: string) => {
    try {
      await api.recall(id);
      const item = items.find(i => i.id === id);
      if (item) addNotification(`${item.number} recalled to serve`, 'info');
      await fetchItems();
    } catch {}
  }, [items, addNotification, fetchItems]);

  const markDone = useCallback(async (id: string) => {
    try {
      await api.markDone(id);
      await fetchItems();
    } catch {}
  }, [fetchItems]);

  const removeItem = useCallback(async (id: string) => {
    try {
      await api.removeItem(id);
      await fetchItems();
    } catch {}
  }, [fetchItems]);

  const resetQueue = useCallback(async () => {
    try {
      await api.reset();
      addNotification('Queue has been reset', 'warning');
      await fetchItems();
    } catch {}
  }, [addNotification, fetchItems]);

  const clearAll = useCallback(async () => {
    try {
      await api.clearAll();
      addNotification('All queue data cleared', 'warning');
      await fetchItems();
    } catch {}
  }, [addNotification, fetchItems]);

  const adminLogin = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      await api.adminLogin(username, password);
      setIsAdminLoggedIn(true);
      try { sessionStorage.setItem('qs_admin', 'true'); } catch {}
      return true;
    } catch {
      return false;
    }
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdminLoggedIn(false);
    try { sessionStorage.removeItem('qs_admin'); } catch {}
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      api.updateSoundSetting(next).catch(() => {});
      return next;
    });
  }, []);

  const toggleLunchBreak = useCallback(() => {
    setLunchBreak(prev => {
      const next = !prev;
      api.updateLunchBreakSetting(next).catch(() => {});
      return next;
    });
  }, []);

  useEffect(() => {
    const fetchLunchBreak = async () => {
      try {
        const result = await api.getLunchBreakSetting();
        setLunchBreak(result.enabled);
      } catch {}
    };
    fetchLunchBreak();
    const interval = setInterval(fetchLunchBreak, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <QueueContext.Provider value={{
      items,
      counter,
      joinQueue,
      callNext,
      doneAndCallNext,
      skipItem,
      recallItem,
      markDone,
      removeItem,
      resetQueue,
      clearAll,
      isAdminLoggedIn,
      adminLogin,
      adminLogout,
      currentlyServing,
      waitingItems,
      doneItems,
      skippedItems,
      getEstimatedWait,
      getPosition,
      hourlyData,
      avgServiceTime,
      totalServedToday,
      notifications,
      dismissNotification,
      soundEnabled,
      toggleSound,
      cooldownRemaining,
      lunchBreak,
      toggleLunchBreak,
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue(): QueueContextType {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error('useQueue must be used within QueueProvider');
  return ctx;
}
