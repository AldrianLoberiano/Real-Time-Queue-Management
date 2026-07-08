import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, Crown, Heart, User, ArrowRight, Clock, Hash } from 'lucide-react';
import { motion } from 'motion/react';
import { Layout } from '../components/Layout';
import { useQueue, type PriorityType } from '../QueueContext';

const PRIORITY_OPTIONS: { value: PriorityType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'regular', label: 'Regular', icon: <User size={18} />, color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { value: 'senior', label: 'Senior', icon: <Heart size={18} />, color: 'border-violet-300 bg-violet-50 text-violet-700' },
  { value: 'vip', label: 'VIP', icon: <Crown size={18} />, color: 'border-amber-300 bg-amber-50 text-amber-700' },
];

export function JoinQueuePage() {
  const { joinQueue, waitingItems, currentlyServing, getEstimatedWait, getPosition } = useQueue();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState<PriorityType>('regular');
  const [joined, setJoined] = useState<{ number: string; position: number; wait: number } | null>(null);

  const handleJoin = () => {
    if (!name.trim()) return;
    const item = joinQueue(name.trim(), type);
    const position = getPosition(item.id);
    const wait = getEstimatedWait(item.id);
    setJoined({ number: item.number, position, wait });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join the Queue</h1>
          <p className="text-gray-500">Enter your details to get a queue number</p>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-blue-50 text-blue-600">
              <Users size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{waitingItems.length}</p>
            <p className="text-gray-500 text-sm">Waiting</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-green-50 text-green-600">
              <Hash size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentlyServing?.number ?? '\u2013'}</p>
            <p className="text-gray-500 text-sm">Now Serving</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-amber-50 text-amber-600">
              <Clock size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">~3m</p>
            <p className="text-gray-500 text-sm">Avg. Wait</p>
          </div>
        </div>

        {joined ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-100 text-green-600">
              <Users size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're in the Queue!</h2>
            <p className="text-gray-500 mb-6">Please wait for your number to be called</p>
            <div className="inline-flex items-center gap-6 bg-gray-50 rounded-xl p-6">
              <div>
                <p className="text-gray-400 text-xs mb-1">Your Number</p>
                <p className="text-3xl font-bold text-sky-600">{joined.number}</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="text-gray-400 text-xs mb-1">Position</p>
                <p className="text-3xl font-bold text-gray-900">#{joined.position}</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="text-gray-400 text-xs mb-1">Est. Wait</p>
                <p className="text-3xl font-bold text-amber-600">~{joined.wait}m</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/display')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-all font-medium"
              >
                View Display Screen
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="font-semibold text-gray-800 mb-6">Enter Your Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Juan dela Cruz"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Queue Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {PRIORITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setType(opt.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        type === opt.value
                          ? `${opt.color} border-current shadow-sm`
                          : 'border-gray-200 hover:border-gray-300 text-gray-500'
                      }`}
                    >
                      {opt.icon}
                      <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleJoin}
                disabled={!name.trim()}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium transition-all flex items-center justify-center gap-2"
              >
                Join Queue
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
