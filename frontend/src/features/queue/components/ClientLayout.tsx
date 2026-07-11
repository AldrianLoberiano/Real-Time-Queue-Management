import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Users, Monitor, Menu, X, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '../QueueContext';

const NAV_ITEMS = [
  { href: '/queue', label: 'Join Queue', icon: Users, exact: true },
  { href: '/display-screen', label: 'Display', icon: Monitor, exact: false },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { waitingItems, currentlyServing } = useQueue();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <img src="/bplo-logo.png" alt="BPLO Logo" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-white font-semibold text-sm leading-none">BPLO Queue</p>
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
          background: '#1a0533',
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
                background: '#1a0533',
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
