import { useState } from 'react';
import {
  Users, CheckCircle, SkipForward, Trash2,
  PlayCircle, Clock, UserCheck, AlertTriangle,
  Volume2, VolumeX,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ConfirmModal } from '../components/ConfirmModal';
import { StatusBadge } from '../../queue/components/StatusBadge';
import { useQueue } from '../../queue/QueueContext';

export function AdminDashboardPage() {
  const {
    waitingItems, currentlyServing, doneItems, skippedItems,
    callNext, skipItem, markDone, removeItem,
    doneAndCallNext,
    clearAll, totalServedToday, avgServiceTime,
    soundEnabled, toggleSound,
  } = useQueue();

  const [filter, setFilter] = useState<'all' | 'waiting' | 'done' | 'skipped'>('all');
  const [showDone, setShowDone] = useState(false);
  const [showDoneCallNext, setShowDoneCallNext] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [skipTarget, setSkipTarget] = useState<{ id: string; number: string } | null>(null);
  const [showRemove, setShowRemove] = useState(false);
  const [showClear, setShowClear] = useState(false);

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
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">Waiting</p>
                <p className="text-gray-900 text-2xl font-bold">{waitingItems.length}</p>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className="mt-3 p-1.5 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors"
              title={soundEnabled ? 'Mute sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center">
                <UserCheck size={20} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">Serving</p>
                <p className="text-gray-900 text-2xl font-bold">{currentlyServing ? 1 : 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">Served</p>
                <p className="text-gray-900 text-2xl font-bold">{totalServedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">Avg. Time</p>
                <p className="text-gray-900 text-2xl font-bold">{avgServiceTime}m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Full Alert */}
        {waitingItems.length >= 15 && (
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-amber-800 text-sm font-semibold">Queue is getting full!</p>
              <p className="text-amber-600 text-xs">{waitingItems.length} customers waiting</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Panel - Currently Serving */}
          <div className="lg:col-span-2 space-y-4">
            {/* Call Next Button */}
            <button
              onClick={callNext}
              disabled={!!currentlyServing || waitingItems.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/25 disabled:shadow-none flex items-center justify-center gap-2.5 active:scale-[0.98]"
            >
              <PlayCircle size={20} />
              Call Next Customer
              {waitingItems.length > 0 && (
                <span className="ml-1 px-2.5 py-0.5 rounded-full bg-white/25 text-[11px] font-bold backdrop-blur-sm">{waitingItems.length}</span>
              )}
            </button>

            {/* Currently Serving Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-bold text-gray-800 text-sm">Currently Serving</h2>
                {currentlyServing && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              <div className="p-5">
                {currentlyServing ? (
                  <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="text-center py-6 bg-gradient-to-b from-gray-50 to-white rounded-xl">
                      <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-2">Queue Number</p>
                      <p className="text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">{currentlyServing.number}</p>
                      <p className="text-gray-500 text-sm font-medium">{currentlyServing.name}</p>
                    </div>

                    {/* Primary Action */}
                    <button
                      onClick={() => setShowDoneCallNext(true)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <CheckCircle size={18} />
                      Done & Call Next
                    </button>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setShowDone(true)}
                        className="py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle size={14} />
                        Done
                      </button>
                      <button
                        onClick={() => { if (currentlyServing) { setSkipTarget({ id: currentlyServing.id, number: currentlyServing.number }); setShowSkip(true); } }}
                        className="py-3 rounded-xl border-2 border-amber-200 hover:border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                      >
                        <SkipForward size={14} />
                        Skip
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => setShowRemove(true)}
                      className="w-full py-2.5 rounded-xl border border-red-200/60 hover:bg-red-50 text-red-500 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={13} />
                      Remove from Queue
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <PlayCircle size={28} className="text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">No one being served</p>
                    <p className="text-gray-300 text-xs mt-1">Click "Call Next Customer" to start</p>
                  </div>
                )}
              </div>
            </div>

            {/* Clear All */}
            <button
              onClick={() => setShowClear(true)}
              className="w-full py-3 rounded-xl border border-red-200/60 hover:bg-red-50 text-red-500 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 size={13} />
              Clear All
            </button>
          </div>

          {/* Right Panel - Queue List */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-sm">Queue List</h2>
              <div className="flex bg-gray-100 rounded-xl p-1">
                {(['all', 'waiting', 'done', 'skipped'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all capitalize ${
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
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Users size={22} className="text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">No items found</p>
                </div>
              ) : (
                filtered.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors ${
                      item.status === 'serving' ? 'bg-gradient-to-r from-emerald-50/80 to-transparent' : ''
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold ${
                      item.status === 'serving' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20' :
                      item.status === 'done' ? 'bg-gray-100 text-gray-500' :
                      item.status === 'skipped' ? 'bg-red-50 text-red-500 border border-red-100' :
                      'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {item.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${
                        item.status === 'done' ? 'text-gray-400' : 'text-gray-800'
                      }`}>
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
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

      <ConfirmModal
        open={showDoneCallNext}
        title="Done & Call Next"
        message={`Mark ${currentlyServing?.number} as done and call the next customer?`}
        confirmLabel="Done & Call Next"
        variant="warning"
        onConfirm={() => { if (currentlyServing) doneAndCallNext(currentlyServing.id); }}
        onCancel={() => setShowDoneCallNext(false)}
      />
      <ConfirmModal
        open={showDone}
        title="Mark as Done"
        message={`Mark ${currentlyServing?.number} as done?`}
        confirmLabel="Done"
        variant="warning"
        onConfirm={() => { if (currentlyServing) markDone(currentlyServing.id); }}
        onCancel={() => setShowDone(false)}
      />
      <ConfirmModal
        open={showSkip}
        title="Skip Customer"
        message={`Skip ${skipTarget?.number}? They will be moved to the skipped list.`}
        confirmLabel="Skip"
        variant="warning"
        onConfirm={() => { if (skipTarget) { skipItem(skipTarget.id); setSkipTarget(null); } }}
        onCancel={() => { setShowSkip(false); setSkipTarget(null); }}
      />
      <ConfirmModal
        open={showRemove}
        title="Remove from Queue"
        message={`Permanently remove ${currentlyServing?.number} from the queue?`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => { if (currentlyServing) removeItem(currentlyServing.id); }}
        onCancel={() => setShowRemove(false)}
      />
      <ConfirmModal
        open={showClear}
        title="Clear All Data"
        message="This will permanently delete all queue data. This action cannot be undone."
        confirmLabel="Delete All"
        variant="danger"
        onConfirm={clearAll}
        onCancel={() => setShowClear(false)}
      />
    </AdminLayout>
  );
}
