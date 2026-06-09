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
    violet: 'from-violet-500 to-violet-600',
    sky: 'from-sky-500 to-sky-600',
    red: 'from-red-500 to-red-600',
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${colors[color] ?? colors.blue}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-gray-900 text-2xl font-bold">{value}</p>
        {sub && <p className="text-gray-400 text-xs">{sub}</p>}
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const {
    waitingItems, currentlyServing, doneItems, skippedItems,
    callNext, skipItem, recallItem, markDone, removeItem,
    resetQueue, clearAll, updatePriority, totalServedToday, avgServiceTime,
  } = useQueue();

  const [filter, setFilter] = useState<'all' | 'waiting' | 'done' | 'skipped'>('all');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const allItems = [
    ...(currentlyServing ? [currentlyServing] : []),
    ...waitingItems,
    ...skippedItems,
    ...doneItems,
  ];

  const filtered = filter === 'all' ? allItems
    : filter === 'waiting' ? [...waitingItems, ...(currentlyServing ? [currentlyServing] : [])]
    : filter === 'done' ? doneItems
    : skippedItems;

  const PRIORITY_OPTIONS: { value: PriorityType; label: string; icon: React.ReactNode }[] = [
    { value: 'vip', label: 'VIP', icon: <Crown size={12} /> },
    { value: 'senior', label: 'Senior', icon: <Heart size={12} /> },
    { value: 'regular', label: 'Regular', icon: <User size={12} /> },
  ];

  return (
