import React, { useState } from 'react';
import {
  Users, CheckCircle, SkipForward, RefreshCw, Trash2,
  ChevronRight, Crown, Heart, User, PlayCircle, X, Clock,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLayout } from '../components/AdminLayout';
import { PriorityBadge } from '../../queue/components/PriorityBadge';
import { StatusBadge } from '../../queue/components/StatusBadge';
import { useQueue, type QueueItem, type PriorityType } from '../../queue/QueueContext';

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
    <AdminLayout>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Waiting" value={waitingItems.length} icon={<Users size={22} />} color="blue" sub="In queue" />
        <StatCard label="Serving" value={currentlyServing ? 1 : 0} icon={<PlayCircle size={22} />} color="green" sub={currentlyServing?.number} />
        <StatCard label="Served Today" value={totalServedToday} icon={<CheckCircle size={22} />} color="sky" sub="Completed" />
        <StatCard label="Avg. Service" value={`${avgServiceTime}m`} icon={<Clock size={22} />} color="violet" sub="Per person" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-700">Currently Serving</h2>
            </div>
            <div className="p-5">
              {currentlyServing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                    <div>
                      <p className="text-gray-500 text-xs">Queue Number</p>
                      <p className="text-green-700 font-bold text-3xl">{currentlyServing.number}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-gray-700 font-medium">{currentlyServing.name}</p>
                      <PriorityBadge type={currentlyServing.type} size="sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => markDone(currentlyServing.id)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-all text-sm"
                    >
                      <CheckCircle size={15} />
                      Mark Done
                    </button>
                    <button
                      onClick={() => skipItem(currentlyServing.id)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all text-sm"
                    >
                      <SkipForward size={15} />
                      Skip
                    </button>
                    <button
                      onClick={() => recallItem(currentlyServing.id)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-all text-sm"
                    >
                      <RefreshCw size={15} />
                      Recall
                    </button>
                    <button
                      onClick={() => removeItem(currentlyServing.id)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all text-sm"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">No one being served</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => { setShowConfirmReset(true); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all text-sm"
              >
                <RotateCcw size={14} />
                Reset Queue
              </button>
              <button
                onClick={() => { setShowConfirmClear(true); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all text-sm"
              >
                <Trash2 size={14} />
                Clear All
              </button>
            </div>

            <AnimatePresence>
              {showConfirmReset && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-2">
                    <p className="text-amber-800 text-sm mb-2">Mark all waiting/skipped as done?</p>
                    <div className="flex gap-2">
                      <button onClick={() => { resetQueue(); setShowConfirmReset(false); }} className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm">Confirm</button>
                      <button onClick={() => setShowConfirmReset(false)} className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 text-sm">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
              {showConfirmClear && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 mb-2">
                    <p className="text-red-800 text-sm mb-2">Delete all queue data permanently?</p>
                    <div className="flex gap-2">
                      <button onClick={() => { clearAll(); setShowConfirmClear(false); }} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm">Confirm</button>
                      <button onClick={() => setShowConfirmClear(false)} className="px-3 py-1.5 rounded-lg bg-white border border-red-300 text-red-700 text-sm">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Queue List</h2>
            <div className="flex gap-1">
              {(['all', 'waiting', 'done', 'skipped'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    filter === f ? 'bg-sky-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No items</p>
            ) : (
              filtered.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50">
                  <span className="font-bold text-gray-900 w-20">{item.number}</span>
                  <span className="text-gray-600 flex-1">{item.name}</span>
                  <PriorityBadge type={item.type} size="sm" />
                  <StatusBadge status={item.status} size="sm" />
                  <div className="relative">
                    <button
                      onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
                    >
                      <ChevronRight size={14} />
                    </button>
                    <AnimatePresence>
                      {editingId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-10 w-32"
                        >
                          <p className="text-xs text-gray-400 px-2 mb-1">Priority</p>
                          {PRIORITY_OPTIONS.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => { updatePriority(item.id, opt.value); setEditingId(null); }}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-50 text-gray-700"
                            >
                              {opt.icon}
                              {opt.label}
                            </button>
                          ))}
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                              onClick={() => { removeItem(item.id); setEditingId(null); }}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-red-50 text-red-600"
                            >
                              <Trash2 size={12} />
                              Remove
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
