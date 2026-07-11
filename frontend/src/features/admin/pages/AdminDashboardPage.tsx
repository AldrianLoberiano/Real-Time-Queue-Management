import { useState } from 'react';
import {
  Users, CheckCircle, SkipForward, RefreshCw, Trash2,
  PlayCircle, Clock, RotateCcw, UserCheck, AlertTriangle,
  Volume2, VolumeX,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ConfirmModal } from '../components/ConfirmModal';
import { StatusBadge } from '../../queue/components/StatusBadge';
import { useQueue } from '../../queue/QueueContext';

export function AdminDashboardPage() {
  const {
    waitingItems, currentlyServing, doneItems, skippedItems,
    callNext, skipItem, recallItem, markDone, removeItem,
    doneAndCallNext,
    resetQueue, clearAll, totalServedToday, avgServiceTime,
    soundEnabled, toggleSound,
  } = useQueue();

  const [filter, setFilter] = useState<'all' | 'waiting' | 'done' | 'skipped'>('all');
  const [showDone, setShowDone] = useState(false);
  const [showDoneCallNext, setShowDoneCallNext] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [skipTarget, setSkipTarget] = useState<{ id: string; number: string } | null>(null);
  const [showRecall, setShowRecall] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const [recallTarget, setRecallTarget] = useState<{ id: string; number: string } | null>(null);

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users size={18} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Waiting</p>
                  <p className="text-gray-900 text-xl font-bold">{waitingItems.length}</p>
                </div>
              </div>
              <button
                onClick={toggleSound}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title={soundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
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

        {/* Queue Full Alert */}
        {waitingItems.length >= 15 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle size={18} className="text-amber-500 shrink-0" />
            <p className="text-amber-700 text-sm font-medium">
              Queue is getting full! {waitingItems.length} customers waiting.
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Left Panel - Currently Serving */}
          <div className="lg:col-span-2 space-y-4">
            {/* Call Next Button */}
            <button
              onClick={callNext}
              disabled={!!currentlyServing || waitingItems.length === 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all disabled:shadow-none flex items-center justify-center gap-2"
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
                      onClick={() => setShowDoneCallNext(true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Done & Call Next
                    </button>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowDone(true)}
                        className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle size={13} />
                        Done
                      </button>
                      <button
                        onClick={() => { if (currentlyServing) { setSkipTarget({ id: currentlyServing.id, number: currentlyServing.number }); setShowSkip(true); } }}
                        className="py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                      >
                        <SkipForward size={13} />
                        Skip
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => setShowRemove(true)}
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
              <button
                onClick={() => setShowClear(true)}
                className="w-full py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 size={12} />
                Clear All
              </button>
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
