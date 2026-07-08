import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, ShieldCheck, LogOut, Menu, X,
  Users, Bell, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '../../queue/QueueContext';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout, waitingItems, currentlyServing, notifications } = useQueue();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">QueueSmart</p>
            <p className="text-white/50 text-[11px]">Admin Panel</p>
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
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-sm ${
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

        <div className="pt-2 mt-2 border-t border-white/10">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            <Users size={16} />
            <span>Queue View</span>
          </Link>
          <Link
            to="/display"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            <LayoutDashboard size={16} />
            <span>Display Screen</span>
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
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
        <header className="relative overflow-hidden sticky top-0 z-30" style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #2d1065 40%, #581c87 70%, #7c3aed 100%)',
        }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] rounded-full opacity-30" style={{
              background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
            }} />
            <div className="absolute -bottom-1/2 -left-1/4 w-[400px] h-[400px] rounded-full opacity-20" style={{
              background: 'radial-gradient(circle, #c026d3 0%, transparent 70%)',
            }} />
          </div>

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
                  {NAV_ITEMS.find(n => isActive(n.href, n.exact))?.label ?? 'Admin'}
                </h1>
                <p className="text-white/40 text-[11px]">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-200 text-[11px] font-medium">Live</span>
              </div>

              {notifications.length > 0 && (
                <div className="relative">
                  <Bell size={16} className="text-white/70" />
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                    {notifications.length}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                <ShieldCheck size={12} className="text-white/80" />
                <span className="text-white/80 text-[11px] font-medium">Admin</span>
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
