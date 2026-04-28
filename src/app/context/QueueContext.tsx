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
