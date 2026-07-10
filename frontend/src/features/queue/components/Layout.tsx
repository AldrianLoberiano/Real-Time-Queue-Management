import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Monitor, Menu, X, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '../QueueContext';
import { BploLogo } from '../../../components/BploLogo';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { notifications, dismissNotification, waitingItems, currentlyServing } = useQueue();
  const [showNotifs, setShowNotifs] = useState(false);

  const navLinks = [
    { href: '/display', label: 'Display', icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40" style={{
        background: 'linear-gradient(135deg, #1a0533 0%, #2d1065 40%, #581c87 70%, #7c3aed 100%)',
      }}>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/display" className="flex items-center gap-2">
              <BploLogo size={32} className="rounded-full" />
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
              <div className="hidden sm:flex items-center gap-2 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {currentlyServing ? currentlyServing.number : '-'} serving
                </span>
                <span className="text-white/30">|</span>
                <span>{waitingItems.length} waiting</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {notifications.length > 0 ? <Bell size={16} /> : <BellOff size={16} />}
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifs && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute right-0 top-10 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Notifications</span>
                        <button onClick={() => setShowNotifs(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-8">No notifications</p>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className={`flex items-start gap-3 px-4 py-2.5 border-b border-gray-50 ${
                              n.type === 'success' ? 'border-l-2 border-l-emerald-400' :
                              n.type === 'warning' ? 'border-l-2 border-l-amber-400' :
                              'border-l-2 border-l-violet-400'
                            }`}>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 truncate">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{n.timestamp.toLocaleTimeString()}</p>
                              </div>
                              <button onClick={() => dismissNotification(n.id)} className="text-gray-300 hover:text-gray-500 shrink-0">
                                <X size={12} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
        <p>2026 QueueSmart - Real-Time Queue Management</p>
      </footer>
    </div>
  );
}
