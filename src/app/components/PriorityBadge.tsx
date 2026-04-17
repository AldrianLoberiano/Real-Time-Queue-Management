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
