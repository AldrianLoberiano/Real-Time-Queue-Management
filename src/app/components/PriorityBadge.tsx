import React from 'react';
import { Crown, Heart, User } from 'lucide-react';
import type { PriorityType } from '../context/QueueContext';

interface PriorityBadgeProps {
  type: PriorityType;
  size?: 'sm' | 'md' | 'lg';
}

const CONFIG = {
  vip: {
    label: 'VIP',
    icon: Crown,
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
    pill: 'bg-amber-500 text-white',
  },
  senior: {
    label: 'Senior',
    icon: Heart,
    bg: 'bg-violet-100',
    text: 'text-violet-700',
    border: 'border-violet-300',
    dot: 'bg-violet-500',
    pill: 'bg-violet-500 text-white',
  },
  regular: {
    label: 'Regular',
    icon: User,
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
    pill: 'bg-blue-500 text-white',
  },
};

export function PriorityBadge({ type, size = 'md' }: PriorityBadgeProps) {
  const cfg = CONFIG[type];
  const Icon = cfg.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  const iconSizes = { sm: 10, md: 12, lg: 14 };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClasses[size]}`}>
      <Icon size={iconSizes[size]} />
      {cfg.label}
    </span>
  );
}

export function PriorityDot({ type }: { type: PriorityType }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${CONFIG[type].dot}`}
