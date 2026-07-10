import { Layout } from '../components/Layout';
import { useQueue } from '../QueueContext';
import { Volume2, VolumeX } from 'lucide-react';

export function DisplayScreenPage() {
  const { currentlyServing, waitingItems, doneItems, soundEnabled, toggleSound } = useQueue();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Now Serving - Hero */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Now Serving</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSound}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title={soundEnabled ? 'Mute sound' : 'Enable sound'}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                {currentlyServing && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
            </div>
            <div className="py-12 px-6">
              {currentlyServing ? (
                <div className="text-center">
                  <p className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-violet-600 tracking-tight leading-none mb-4">
                    {currentlyServing.number}
                  </p>
                  <p className="text-gray-600 text-lg font-medium">{currentlyServing.name}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-xl font-medium">No one being served</p>
                  <p className="text-gray-300 text-sm mt-1">Waiting for the next customer</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Waiting & Recently Served */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Waiting List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-sm">Waiting</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                {waitingItems.length}
              </span>
            </div>
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {waitingItems.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-sm">No one waiting</p>
                </div>
              ) : (
                waitingItems.slice(0, 5).map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">{item.number}</span>
                    <span className="text-gray-500 text-sm flex-1 truncate">{item.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recently Served */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-sm">Recently Served</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                {doneItems.length}
              </span>
            </div>
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {doneItems.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-sm">No one served yet</p>
                </div>
              ) : (
                doneItems.slice(0, 15).map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <span className="font-bold text-gray-900 text-sm">{item.number}</span>
                    <span className="text-gray-500 text-sm flex-1 truncate">{item.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-medium">
                      Done
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
