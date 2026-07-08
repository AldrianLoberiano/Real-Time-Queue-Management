import React from 'react';
import { Crown, Heart, User } from 'lucide-react';
import type { PriorityType } from '../QueueContext';

interface PriorityBadgeProps {
  type: PriorityType;
  size?: 'sm' | 'md' | 'lg';
}

const CONFIG = {
  vip: {
    label: 'VIP',
    icon: Crown,
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  senior: {
    label: 'Senior',
    icon: Heart,
    classes: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  regular: {
    label: 'Regular',
    icon: User,
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
  },
};

export function PriorityBadge({ type, size = 'md' }: PriorityBadgeProps) {
  const cfg = CONFIG[type];
  const Icon = cfg.icon;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[11px] gap-1',
    md: 'px-2 py-0.5 text-xs gap-1',
    lg: 'px-2.5 py-1 text-sm gap-1.5',
  };

  const iconSizes = { sm: 10, md: 11, lg: 13 };

  return (
    <span className={`inline-flex items-center rounded border font-medium ${cfg.classes} ${sizeClasses[size]}`}>
      <Icon size={iconSizes[size]} />
      {cfg.label}
    </span>
  );
}

export function PriorityDot({ type }: { type: PriorityType }) {
  const colors = { vip: 'bg-amber-500', senior: 'bg-violet-500', regular: 'bg-blue-500' };
  const labels = { vip: 'VIP', senior: 'Senior', regular: 'Regular' };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colors[type]}`}
      title={labels[type]}
    />
  );
}
