import React from 'react';
import { Clock, PlayCircle, CheckCircle, SkipForward } from 'lucide-react';
import type { StatusType } from '../context/QueueContext';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const CONFIG = {
  waiting: {
    label: 'Waiting',
    icon: Clock,
    classes: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  },
  serving: {
    label: 'Serving',
    icon: PlayCircle,
    classes: 'bg-green-100 text-green-700 border-green-300',
  },
