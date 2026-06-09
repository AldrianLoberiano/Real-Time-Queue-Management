import React, { useState } from 'react';
import {
  Users, CheckCircle, SkipForward, RefreshCw, Trash2,
  ChevronRight, Crown, Heart, User, PlayCircle, X, Clock,
  ArrowDownUp, Siren, RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLayout } from '../components/AdminLayout';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useQueue, type QueueItem, type PriorityType } from '../context/QueueContext';

function StatCard({ label, value, icon, color, sub }: {
  label: string; value: number | string; icon: React.ReactNode;
  color: string; sub?: string;
}) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
