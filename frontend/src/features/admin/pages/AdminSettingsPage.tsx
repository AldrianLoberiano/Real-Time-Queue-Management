import { Volume2 } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useQueue } from '../../queue/QueueContext';

export function AdminSettingsPage() {
  const { soundEnabled, toggleSound } = useQueue();

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-lg font-bold text-gray-900 mb-6">Settings</h1>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Sound</h2>

            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Volume2 size={18} className="text-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Notification Sound</p>
                  <p className="text-xs text-gray-400">Play sound when serving customers</p>
                </div>
              </div>
              <button
                onClick={toggleSound}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  soundEnabled ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
