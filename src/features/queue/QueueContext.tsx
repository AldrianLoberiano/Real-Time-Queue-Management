import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';

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
  joinQueue: (name: string) => QueueItem | null;
  callNext: () => QueueItem | null;
  skipItem: (id: string) => void;
  recallItem: (id: string) => void;
  markDone: (id: string) => void;
  removeItem: (id: string) => void;
  resetQueue: () => void;
  clearAll: () => void;
  isAdminLoggedIn: boolean;
  adminLogin: (username: string, password: string) => boolean;
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
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: Date;
}

const AVG_SERVICE_MINS = 3;
const STORAGE_KEY = 'qs_queue_state';
const ACTIVITY_KEY = 'qs_last_activity';
const RESET_DATE_KEY = 'qs_last_reset_date';
const RESET_HOUR = 8; // 8:00 AM
const INACTIVITY_MS = 24 * 60 * 60 * 1000; // 24 hours
const POLL_INTERVAL = 500;
const SOUND_ENABLED_KEY = 'qs_sound_enabled';
const JOIN_COOLDOWN_MS = 8000;

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

function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(SOUND_ENABLED_KEY) !== 'false';
  } catch {
    return true;
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function formatNumber(n: number): string {
  return `A-${String(n).padStart(3, '0')}`;
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

function loadState(): { items: QueueItem[]; counter: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], counter: 0 };
    const data = JSON.parse(raw);
    const items = (data.items || []).map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      calledAt: item.calledAt ? new Date(item.calledAt) : undefined,
      completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
    }));
    return { items, counter: data.counter || 0 };
  } catch {
    return { items: [], counter: 0 };
  }
}

function saveState(items: QueueItem[], counter: number) {
  try {
    const data = JSON.stringify({ items, counter, ts: Date.now() });
    localStorage.setItem(STORAGE_KEY, data);
  } catch {}
}

function getStorageHash(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw || '';
  } catch {
    return '';
  }
}

function getLastActivity(): number {
  try {
    return parseInt(localStorage.getItem(ACTIVITY_KEY) || '0', 10) || Date.now();
  } catch {
    return Date.now();
  }
}

function updateActivity() {
  try {
    localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
  } catch {}
}

function checkDailyReset(): boolean {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lastReset = localStorage.getItem(RESET_DATE_KEY);
    if (lastReset === today) return false;
    if (now.getHours() >= RESET_HOUR) {
      localStorage.setItem(RESET_DATE_KEY, today);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

let channel: BroadcastChannel | null = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel('queue-sync');
  }
} catch {}

const QueueContext = createContext<QueueContextType | null>(null);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [initialState] = useState(loadState);
  const [counter, setCounter] = useState(initialState.counter);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('qs_admin') === 'true';
    } catch {
      return false;
    }
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled);
  const [hourlyData] = useState<HourlyData[]>(generateHourlyData);
  const [items, setItems] = useState<QueueItem[]>(initialState.items);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const isInitialMount = useRef(true);
  const lastHash = useRef(getStorageHash());
  const lastJoinTime = useRef(0);

  // Update activity timestamp on mount if queue has items
  useEffect(() => {
    if (initialState.items.length > 0) {
      updateActivity();
    }
  }, []);

  // Daily reset at 8 AM
  useEffect(() => {
    if (checkDailyReset()) {
      setItems([]);
      setCounter(0);
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ACTIVITY_KEY);
      } catch {}
    }
  }, []);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cooldownRemaining > 0]);

  const syncFromStorage = useCallback(() => {
    const currentHash = getStorageHash();
    if (currentHash !== lastHash.current) {
      lastHash.current = currentHash;
      const { items: newItems, counter: newCounter } = loadState();
      setItems(newItems);
      setCounter(newCounter);
    }
  }, []);

  // Sync state to localStorage and broadcast
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveState(items, counter);
    updateActivity();
    lastHash.current = getStorageHash();
    if (channel) {
      try { channel.postMessage({ type: 'update' }); } catch {}
    }
  }, [items, counter]);

  // Auto-reset on inactivity
  useEffect(() => {
    const checkInactivity = () => {
      const last = getLastActivity();
      const hasItems = items.length > 0;
      if (hasItems && Date.now() - last > INACTIVITY_MS) {
        setItems([]);
        setCounter(0);
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(ACTIVITY_KEY);
        } catch {}
      }
    };
    const interval = setInterval(checkInactivity, 60 * 1000);
    return () => clearInterval(interval);
  }, [items.length]);

  // Listen for cross-tab updates via BroadcastChannel
  useEffect(() => {
    if (!channel) return;
    const handler = () => syncFromStorage();
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
  }, [syncFromStorage]);

  // Fallback: poll localStorage for changes (handles storage event edge cases)
  useEffect(() => {
    const interval = setInterval(syncFromStorage, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [syncFromStorage]);

  const waitingItems = items
    .filter(i => i.status === 'waiting')
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const currentlyServing = items.find(i => i.status === 'serving') ?? null;
  const doneItems = items.filter(i => i.status === 'done').sort((a, b) =>
    (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0)
  );
  const skippedItems = items.filter(i => i.status === 'skipped');
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
    const sorted = items
      .filter(i => i.status === 'waiting')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return sorted.findIndex(i => i.id === id) + 1;
  }, [items]);

  const getEstimatedWait = useCallback((id: string): number => {
    const pos = getPosition(id);
    if (pos === 0) return 0;
    return pos * AVG_SERVICE_MINS;
  }, [getPosition]);

  const joinQueue = useCallback((name: string): QueueItem | null => {
    const now = Date.now();
    if (now - lastJoinTime.current < JOIN_COOLDOWN_MS) return null;
    lastJoinTime.current = now;
    setCooldownRemaining(8);
    const newCounter = counter + 1;
    setCounter(newCounter);
    const newItem: QueueItem = {
      id: generateId(),
      number: formatNumber(newCounter),
      name,
      status: 'waiting',
      createdAt: new Date(),
    };
    setItems(prev => [...prev, newItem]);
    addNotification(`${newItem.number} - ${name} joined the queue`, 'info');
    return newItem;
  }, [counter, addNotification]);

  const callNext = useCallback((): QueueItem | null => {
    const sorted = items
      .filter(i => i.status === 'waiting')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const next = sorted[0];
    if (!next) return null;

    setItems(prev => prev.map(i => {
      if (i.status === 'serving') return { ...i, status: 'done' as StatusType, completedAt: new Date() };
      if (i.id === next.id) return { ...i, status: 'serving' as StatusType, calledAt: new Date() };
      return i;
    }));
    addNotification(`Now serving: ${next.number} - ${next.name}`, 'success');
    if (isSoundEnabled()) playServeSound();
    return next;
  }, [items, addNotification]);

  const skipItem = useCallback((id: string) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'skipped' as StatusType } : i
    ));
    const item = items.find(i => i.id === id);
    if (item) addNotification(`${item.number} - ${item.name} was skipped`, 'warning');
  }, [items, addNotification]);

  const recallItem = useCallback((id: string) => {
    setItems(prev => prev.map(i => {
      if (i.status === 'serving') return { ...i, status: 'done' as StatusType, completedAt: new Date() };
      if (i.id === id) return { ...i, status: 'serving' as StatusType, calledAt: new Date() };
      return i;
    }));
    const item = items.find(i => i.id === id);
    if (item) addNotification(`${item.number} recalled to serve`, 'info');
  }, [items, addNotification]);

  const markDone = useCallback((id: string) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'done' as StatusType, completedAt: new Date() } : i
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const resetQueue = useCallback(() => {
    setItems(prev => prev.map(i =>
      i.status === 'waiting' || i.status === 'serving' || i.status === 'skipped'
        ? { ...i, status: 'done' as StatusType, completedAt: new Date() }
        : i
    ));
    addNotification('Queue has been reset', 'warning');
  }, [addNotification]);

  const clearAll = useCallback(() => {
    setItems([]);
    setCounter(0);
    addNotification('All queue data cleared', 'warning');
  }, [addNotification]);

  const adminLogin = useCallback((username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdminLoggedIn(true);
      try { localStorage.setItem('qs_admin', 'true'); } catch {}
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdminLoggedIn(false);
    try { localStorage.removeItem('qs_admin'); } catch {}
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      try { localStorage.setItem(SOUND_ENABLED_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <QueueContext.Provider value={{
      items,
      counter,
      joinQueue,
      callNext,
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
