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
