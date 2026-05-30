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

