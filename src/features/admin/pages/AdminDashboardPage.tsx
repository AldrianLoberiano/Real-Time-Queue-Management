import React, { useState } from 'react';
import {
  Users, CheckCircle, SkipForward, RefreshCw, Trash2,
  PlayCircle, Clock, RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLayout } from '../components/AdminLayout';
import { StatusBadge } from '../../queue/components/StatusBadge';
import { useQueue } from '../../queue/QueueContext';

function StatCard({ label, value, icon, color }: {
  label: string; value: number | string; icon: React.ReactNode; color: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    sky: 'bg-sky-500',
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-gray-900 text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const {
    waitingItems, currentlyServing, doneItems, skippedItems,
    callNext, skipItem, recallItem, markDone, removeItem,
    resetQueue, clearAll, totalServedToday, avgServiceTime,
  } = useQueue();

  const [filter, setFilter] = useState<'all' | 'waiting' | 'done' | 'skipped'>('all');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

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

  return (
    <AdminLayout>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Waiting" value={waitingItems.length} icon={<Users size={18} />} color="blue" />
        <StatCard label="Serving" value={currentlyServing ? 1 : 0} icon={<PlayCircle size={18} />} color="green" />
        <StatCard label="Served Today" value={totalServedToday} icon={<CheckCircle size={18} />} color="sky" />
        <StatCard label="Avg. Service" value={`${avgServiceTime}m`} icon={<Clock size={18} />} color="amber" />
        <button
          onClick={callNext}
          disabled={waitingItems.length === 0}
          className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-lg p-4 flex items-center gap-3 transition-colors"
        >
          <PlayCircle size={18} />
          <div className="text-left">
            <p className="text-white/80 text-xs">Action</p>
            <p className="font-bold text-sm">Call Next</p>
          </div>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-medium text-gray-800 text-sm">Currently Serving</h2>
            </div>
            <div className="p-4">
              {currentlyServing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <div>
                      <p className="text-gray-400 text-[11px]">Queue Number</p>
                      <p className="text-green-700 font-bold text-2xl">{currentlyServing.number}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-gray-700 font-medium text-sm">{currentlyServing.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => markDone(currentlyServing.id)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors text-xs font-medium"
                    >
                      <CheckCircle size={13} />
                      Done
                    </button>
                    <button
                      onClick={() => { markDone(currentlyServing.id); setTimeout(callNext, 100); }}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors text-xs font-medium"
                    >
                      <PlayCircle size={13} />
                      Done & Call Next
                    </button>
                    <button
                      onClick={() => skipItem(currentlyServing.id)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors text-xs font-medium"
                    >
                      <SkipForward size={13} />
                      Skip
                    </button>
                    <button
                      onClick={() => recallItem(currentlyServing.id)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors text-xs font-medium"
                    >
                      <RefreshCw size={13} />
                      Recall
                    </button>
                    <button
                      onClick={() => removeItem(currentlyServing.id)}
                      className="col-span-2 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-xs font-medium"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm mb-3">No one being served</p>
                  <button
                    onClick={callNext}
                    disabled={waitingItems.length === 0}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                  >
                    <PlayCircle size={15} />
                    Call Next Customer
                  </button>
                  {waitingItems.length > 0 && (
                    <p className="text-gray-400 text-xs mt-2">{waitingItems.length} waiting in queue</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex gap-1.5 mb-3">
              <button
                onClick={() => setShowConfirmReset(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors text-xs font-medium"
              >
                <RotateCcw size={12} />
                Reset
              </button>
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors text-xs font-medium"
              >
                <Trash2 size={12} />
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
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mb-2">
                    <p className="text-amber-800 text-sm mb-2">Mark all waiting/skipped as done?</p>
                    <div className="flex gap-1.5">
                      <button onClick={() => { resetQueue(); setShowConfirmReset(false); }} className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium">Confirm</button>
                      <button onClick={() => setShowConfirmReset(false)} className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 text-xs font-medium">Cancel</button>
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
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200 mb-2">
                    <p className="text-red-800 text-sm mb-2">Delete all queue data?</p>
                    <div className="flex gap-1.5">
                      <button onClick={() => { clearAll(); setShowConfirmClear(false); }} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium">Confirm</button>
                      <button onClick={() => setShowConfirmClear(false)} className="px-3 py-1.5 rounded-lg bg-white border border-red-300 text-red-700 text-xs font-medium">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-medium text-gray-800 text-sm">Queue List</h2>
            <div className="flex gap-0.5">
              {(['all', 'waiting', 'done', 'skipped'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors capitalize ${
                    filter === f ? 'bg-sky-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No items</p>
            ) : (
              filtered.map(item => (
                <div key={item.id} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50">
                  <span className="font-semibold text-gray-900 text-sm w-16">{item.number}</span>
                  <span className="text-gray-600 text-sm flex-1 truncate">{item.name}</span>
                  <StatusBadge status={item.status} size="sm" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
