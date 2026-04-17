import React from 'react';
import { Clock, PlayCircle, CheckCircle, SkipForward } from 'lucide-react';
import type { StatusType } from '../context/QueueContext';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const CONFIG = {
  waiting: {
