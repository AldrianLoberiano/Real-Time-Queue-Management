import React, { useState } from 'react';
import {
  Users, CheckCircle, SkipForward, RefreshCw, Trash2,
  PlayCircle, Clock, RotateCcw, UserCheck, AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLayout } from '../components/AdminLayout';
import { StatusBadge } from '../../queue/components/StatusBadge';
import { useQueue } from '../../queue/QueueContext';

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
      <div className="space-y-5">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Waiting</p>
                <p className="text-gray-900 text-xl font-bold">{waitingItems.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <UserCheck size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Serving</p>
                <p className="text-gray-900 text-xl font-bold">{currentlyServing ? 1 : 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <CheckCircle size={18} className="text-sky-500" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Served</p>
                <p className="text-gray-900 text-xl font-bold">{totalServedToday}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock size={18} className="text-amber-500" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Avg. Time</p>
                <p className="text-gray-900 text-xl font-bold">{avgServiceTime}m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Left Panel - Currently Serving */}
          <div className="lg:col-span-2 space-y-4">
            {/* Call Next Button */}
            <button
              onClick={callNext}
              disabled={waitingItems.length === 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-violet-200 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <PlayCircle size={18} />
              Call Next Customer
              {waitingItems.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px]">{waitingItems.length}</span>
              )}
            </button>

            {/* Currently Serving Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Currently Serving</h2>
                {currentlyServing && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              <div className="p-4">
                {currentlyServing ? (
                  <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="text-center py-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Queue Number</p>
                      <p className="text-4xl font-bold text-gray-900 mb-1">{currentlyServing.number}</p>
                      <p className="text-gray-500 text-sm">{currentlyServing.name}</p>
                    </div>

                    {/* Primary Action */}
                    <button
                      onClick={() => { markDone(currentlyServing.id); setTimeout(callNext, 100); }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Done & Call Next
                    </button>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => markDone(currentlyServing.id)}
                        className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle size={13} />
                        Done
                      </button>
                      <button
                        onClick={() => skipItem(currentlyServing.id)}
                        className="py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                      >
                        <SkipForward size={13} />
                        Skip
                      </button>
                      <button
                        onClick={() => recallItem(currentlyServing.id)}
                        className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw size={13} />
                        Recall
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(currentlyServing.id)}
                      className="w-full py-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={12} />
                      Remove from Queue
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <PlayCircle size={24} className="text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-sm">No one being served</p>
                    <p className="text-gray-300 text-xs mt-1">Click "Call Next Customer" to start</p>
                  </div>
                )}
              </div>
            </div>

            {/* Queue Management */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  Reset Queue
                </button>
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="flex-1 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
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
                    <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-amber-800 text-sm font-medium mb-2">Mark all as done?</p>
                          <div className="flex gap-2">
                            <button onClick={() => { resetQueue(); setShowConfirmReset(false); }} className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium transition-colors">Confirm</button>
                            <button onClick={() => setShowConfirmReset(false)} className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 text-xs font-medium transition-colors">Cancel</button>
                          </div>
                        </div>
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
                    <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-red-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-red-800 text-sm font-medium mb-2">Delete all queue data?</p>
                          <div className="flex gap-2">
                            <button onClick={() => { clearAll(); setShowConfirmClear(false); }} className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors">Confirm</button>
                            <button onClick={() => setShowConfirmClear(false)} className="px-3 py-1.5 rounded-lg bg-white border border-red-300 text-red-700 text-xs font-medium transition-colors">Cancel</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel - Queue List */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-sm">Queue List</h2>
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {(['all', 'waiting', 'done', 'skipped'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all capitalize ${
                      filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Users size={18} className="text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm">No items found</p>
                </div>
              ) : (
                filtered.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      item.status === 'serving' ? 'bg-emerald-50/50' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                      item.status === 'serving' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'done' ? 'bg-gray-100 text-gray-500' :
                      item.status === 'skipped' ? 'bg-red-50 text-red-500' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {item.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        item.status === 'done' ? 'text-gray-400' : 'text-gray-800'
                      }`}>
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {item.status === 'serving' ? 'Being served now' :
                         item.status === 'waiting' ? `Joined ${item.createdAt.toLocaleTimeString()}` :
                         item.status === 'done' ? `Completed ${item.completedAt?.toLocaleTimeString() ?? ''}` :
                         'Skipped'}
                      </p>
                    </div>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
