import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, ArrowRight, Hash, Clock } from 'lucide-react';
import { ClientLayout } from '../components/ClientLayout';
import { useQueue } from '../QueueContext';

export function JoinQueuePage() {
  const { joinQueue, waitingItems, currentlyServing, avgServiceTime, cooldownRemaining } = useQueue();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [joined, setJoined] = useState<{ number: string } | null>(null);

  const handleJoin = async () => {
    if (!name.trim() || cooldownRemaining > 0) return;
    const item = await joinQueue(name.trim());
    if (item) setJoined({ number: item.number });
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Join the Queue</h1>
          <p className="text-gray-500 text-sm">Enter your name to get a queue number</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center bg-gray-100">
              <Users size={16} className="text-gray-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{waitingItems.length}</p>
            <p className="text-gray-500 text-xs">Waiting</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center bg-gray-100">
              <Hash size={16} className="text-gray-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{currentlyServing?.number ?? '-'}</p>
            <p className="text-gray-500 text-xs">Now Serving</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center bg-gray-100">
              <Clock size={16} className="text-gray-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">~{avgServiceTime}m</p>
            <p className="text-gray-500 text-xs">Avg. Wait</p>
          </div>
        </div>

        {joined ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-100">
              <Users size={24} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">You're in the Queue</h2>
            <p className="text-gray-500 text-sm mb-6">Please wait for your number to be called</p>
            <div className="inline-flex items-center gap-4 bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div>
                <p className="text-gray-400 text-[11px] uppercase tracking-wide mb-1">Number</p>
                <p className="text-3xl font-bold text-violet-600">{joined.number}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => { setJoined(null); setName(''); }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
              >
                Join Queue
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/display-screen')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
              >
                View Display
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-medium text-gray-800 mb-5 text-sm uppercase tracking-wide">Enter Your Details</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Juan dela Cruz"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-400 focus:ring-1 focus:ring-violet-400 outline-none transition-colors text-sm"
                />
              </div>

              <button
                onClick={handleJoin}
                disabled={!name.trim() || cooldownRemaining > 0}
                className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                {cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : 'Join Queue'}
                {cooldownRemaining <= 0 && <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
