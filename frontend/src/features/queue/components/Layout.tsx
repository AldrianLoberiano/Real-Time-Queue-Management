import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Monitor, Menu, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '../QueueContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { waitingItems, currentlyServing } = useQueue();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { href: '/display-screen', label: 'Display', icon: Monitor },
  ];

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

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = location.pathname === href;
                return (
                  <Link
                    key={href}
                    to={href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-white/20 text-white font-medium'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/60">
                <Clock size={14} />
                <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} | {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>

              <button
                className="md:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/10 overflow-hidden relative"
            >
              <div className="px-4 py-2 space-y-0.5">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                      location.pathname === href ? 'bg-white/20 text-white font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
