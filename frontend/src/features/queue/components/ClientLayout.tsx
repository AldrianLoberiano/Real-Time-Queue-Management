import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Users, Monitor, Menu, X, Bell, BellOff, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '../QueueContext';

const NAV_ITEMS = [
  { href: '/queue', label: 'Join Queue', icon: Users, exact: true },
  { href: '/display-screen', label: 'Display', icon: Monitor, exact: false },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { notifications, dismissNotification, waitingItems, currentlyServing } = useQueue();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <img src="/bplo-logo.png" alt="BPLO Logo" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-white font-semibold text-sm leading-none">BPLO Queue</p>
            <p className="text-white/50 text-[11px]">Business Permit & Licensing Office</p>
          </div>
        </div>
      </div>

      <div className="p-3 border-b border-white/10">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2.5 text-center bg-white/5">
            <p className="text-white/50 text-[11px] mb-0.5">Waiting</p>
            <p className="text-white font-bold text-lg">{waitingItems.length}</p>
          </div>
          <div className="rounded-lg p-2.5 text-center bg-white/5">
            <p className="text-white/50 text-[11px] mb-0.5">Serving</p>
            <p className="text-white font-bold text-lg">{currentlyServing ? '1' : '0'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                active
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100' : ''}`} />
            </Link>
          );
        })}
      </nav>

    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside
        className="hidden lg:flex flex-col w-56 sticky top-0 h-screen shrink-0"
        style={{
          background: 'linear-gradient(180deg, #1a0533 0%, #2d1065 50%, #1a0533 100%)',
        }}
      >
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden flex flex-col"
              style={{
                background: 'linear-gradient(180deg, #1a0533 0%, #2d1065 50%, #1a0533 100%)',
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30" style={{
          backgroundImage: 'url(/header-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>

          <div className="relative px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
              >
                <Menu size={18} />
              </button>
              <div>
                <h1 className="text-white font-semibold text-sm">
                  {NAV_ITEMS.find(n => isActive(n.href, n.exact))?.label ?? 'BPLO Queue'}
                </h1>
                <p className="text-white/40 text-[11px]">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

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
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
