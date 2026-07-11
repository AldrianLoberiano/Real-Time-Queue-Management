import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Clock } from 'lucide-react';
import { useQueue } from '../QueueContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { waitingItems, currentlyServing } = useQueue();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40" style={{
        backgroundImage: 'url(/header-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/display-screen" className="flex items-center gap-2">
              <img src="/bplo-logo.png" alt="BPLO Logo" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-semibold text-white text-sm tracking-wide">BPLO Queue</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                <Clock size={16} />
                <span className="hidden sm:inline">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} | </span>
                <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="fixed bottom-0 right-0 px-4 py-2 text-gray-400 text-[10px]">
        <p>2026 BPLO Queue - Real-Time Queue Management</p>
      </footer>
    </div>
  );
}
