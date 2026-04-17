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
