import { Layout } from '../components/Layout';
import { useQueue } from '../QueueContext';
import { Volume2, VolumeX, AlertTriangle, Megaphone } from 'lucide-react';

const ANNOUNCEMENTS = [
  "Welcome to BPLO Queue Management System",
  "Please wait for your number to be called",
  "Ensure you have all required documents ready",
  "Thank you for your patience",
  "For assistance, please approach our staff",
  "Have your queue number ready at all times",
];

const SCROLL_TEXT = ANNOUNCEMENTS.join("   •   ");

export function DisplayScreenPage() {
  const { currentlyServing, waitingItems, soundEnabled, toggleSound, lunchBreak } = useQueue();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Announcement Ticker */}
        <div className="mb-4 sm:mb-6 bg-violet-600 rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-4 overflow-hidden">
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2">
            <Megaphone size={16} className="text-white sm:w-5 sm:h-5" />
            <span className="text-white/80 text-[10px] sm:text-xs font-semibold uppercase tracking-wider hidden sm:inline">Announcement</span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-scroll whitespace-nowrap">
              <span className="text-white text-xs sm:text-sm md:text-base font-medium">{SCROLL_TEXT}</span>
              <span className="text-white text-xs sm:text-sm md:text-base font-medium ml-8">{SCROLL_TEXT}</span>
            </div>
          </div>
        </div>

        {/* Lunch Break Banner */}
        {lunchBreak ? (
          <div className="bg-amber-50 border border-amber-200/60 rounded-2xl py-16 sm:py-24 px-4 sm:px-6 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <AlertTriangle size={32} className="text-amber-600 sm:w-10 sm:h-10" />
            </div>
            <p className="text-amber-800 text-2xl sm:text-4xl font-bold mb-2">On Lunch Break</p>
            <p className="text-amber-600 text-base sm:text-xl">Queue is paused</p>
          </div>
        ) : (
          <>
            {/* Now Serving - Hero */}
            <div className="mb-4 sm:mb-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">Now Serving</h2>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={toggleSound}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title={soundEnabled ? 'Mute sound' : 'Enable sound'}
                    >
                      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                    {currentlyServing && (
                      <span className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] sm:text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                </div>
                <div className="py-8 sm:py-12 px-4 sm:px-6">
                  {currentlyServing ? (
                    <div className="text-center">
                      <p className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-violet-600 tracking-tight leading-none mb-2 sm:mb-4">
                        {currentlyServing.number}
                      </p>
                      <p className="text-gray-600 text-base sm:text-lg font-medium">{currentlyServing.name}</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400 text-lg sm:text-xl font-medium">No one being served</p>
                      <p className="text-gray-300 text-xs sm:text-sm mt-1">Waiting for the next customer</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Waiting List */}
            <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Waiting</h2>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-500 text-xs font-semibold">
                  {waitingItems.length}
                </span>
              </div>
              <div className="p-3 max-h-[420px] overflow-y-auto space-y-2">
                {waitingItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-sm">No one waiting</p>
                  </div>
                ) : (
                  waitingItems.slice(0, 10).map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-gray-900 text-sm">{item.number}</span>
                      <span className="text-gray-400 text-sm flex-1 truncate">{item.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
