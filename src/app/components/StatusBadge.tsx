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
  done: {
    label: 'Done',
    icon: CheckCircle,
    classes: 'bg-gray-100 text-gray-600 border-gray-300',
  },
  skipped: {
    label: 'Skipped',
    icon: SkipForward,
    classes: 'bg-red-100 text-red-600 border-red-300',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cfg = CONFIG[status];
  const Icon = cfg.icon;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-sm gap-1.5';
  const iconSize = size === 'sm' ? 10 : 12;

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${cfg.classes} ${sizeClass}`}>
      <Icon size={iconSize} />
      {cfg.label}
    </span>
  );
}
