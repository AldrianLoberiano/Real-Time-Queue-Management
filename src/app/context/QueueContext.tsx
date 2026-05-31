import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type PriorityType = 'regular' | 'vip' | 'senior';
export type StatusType = 'waiting' | 'serving' | 'done' | 'skipped';

export interface QueueItem {
  id: string;
  number: string;
  name: string;
  type: PriorityType;
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
  joinQueue: (name: string, type: PriorityType) => QueueItem;
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
  updatePriority: (id: string, type: PriorityType) => void;
  hourlyData: HourlyData[];
  avgServiceTime: number;
  totalServedToday: number;
  notifications: Notification[];
  dismissNotification: (id: string) => void;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: Date;
}

const PRIORITY_ORDER: Record<PriorityType, number> = {
  vip: 3,
  senior: 2,
  regular: 1,
};

const AVG_SERVICE_MINS = 3;

const MOCK_NAMES = [
  'Maria Santos', 'Juan dela Cruz', 'Ana Reyes', 'Pedro Garcia',
  'Rosa Mendoza', 'Carlos Lopez', 'Elena Torres', 'Miguel Fernandez',
  'Sofia Ramos', 'Luis Castillo', 'Isabella Morales', 'Diego Herrera',
  'Valentina Jimenez', 'Alejandro Ruiz', 'Camila Vargas',
];

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

const QueueContext = createContext<QueueContextType | null>(null);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [counter, setCounter] = useState(9);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('qs_admin') === 'true';
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hourlyData] = useState<HourlyData[]>(generateHourlyData);
  const simulationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Mock initial queue data
  const [items, setItems] = useState<QueueItem[]>(() => {
    const now = new Date();
    const ago = (mins: number) => new Date(now.getTime() - mins * 60 * 1000);
    return [
      { id: 'i1', number: 'A-001', name: 'Maria Santos', type: 'regular', status: 'done', createdAt: ago(45), calledAt: ago(42), completedAt: ago(39) },
      { id: 'i2', number: 'A-002', name: 'Juan dela Cruz', type: 'vip', status: 'done', createdAt: ago(40), calledAt: ago(36), completedAt: ago(33) },
      { id: 'i3', number: 'A-003', name: 'Ana Reyes', type: 'senior', status: 'done', createdAt: ago(35), calledAt: ago(30), completedAt: ago(27) },
      { id: 'i4', number: 'A-004', name: 'Pedro Garcia', type: 'regular', status: 'done', createdAt: ago(30), calledAt: ago(24), completedAt: ago(21) },
      { id: 'i5', number: 'A-005', name: 'Rosa Mendoza', type: 'vip', status: 'done', createdAt: ago(25), calledAt: ago(18), completedAt: ago(15) },
      { id: 'i6', number: 'A-006', name: 'Carlos Lopez', type: 'regular', status: 'done', createdAt: ago(20), calledAt: ago(12), completedAt: ago(9) },
      { id: 'i7', number: 'A-007', name: 'Elena Torres', type: 'senior', status: 'serving', createdAt: ago(15), calledAt: ago(3) },
      { id: 'i8', number: 'A-008', name: 'Miguel Fernandez', type: 'vip', status: 'waiting', createdAt: ago(10) },
      { id: 'i9', number: 'A-009', name: 'Sofia Ramos', type: 'senior', status: 'waiting', createdAt: ago(8) },
    ];
  });

  // Sorted waiting items by priority then by join time (FIFO within same priority)
  const waitingItems = items
    .filter(i => i.status === 'waiting')
    .sort((a, b) => {
      const pDiff = PRIORITY_ORDER[b.type] - PRIORITY_ORDER[a.type];
      if (pDiff !== 0) return pDiff;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

  const currentlyServing = items.find(i => i.status === 'serving') ?? null;
  const doneItems = items.filter(i => i.status === 'done').sort((a, b) =>
    (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0)
  );
  const skippedItems = items.filter(i => i.status === 'skipped');
  const totalServedToday = doneItems.length;

  const avgServiceTime = useCallback((): number => {
    const completed = items.filter(i => i.status === 'done' && i.calledAt && i.completedAt);
    if (completed.length === 0) return AVG_SERVICE_MINS;
    const totalMs = completed.reduce((sum, i) => {
      return sum + (i.completedAt!.getTime() - i.calledAt!.getTime());
    }, 0);
    return Math.round(totalMs / completed.length / 60000) || AVG_SERVICE_MINS;
  }, [items]);

  const getPosition = useCallback((id: string): number => {
