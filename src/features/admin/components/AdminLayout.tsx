import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, BarChart3, ShieldCheck, LogOut, Menu, X,
  Users, Bell, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '../../queue/QueueContext';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, exact: false },
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
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">QueueSmart</p>
            <p className="text-blue-300 text-[11px]">Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="p-3 border-b border-white/10">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2.5 text-center bg-white/5">
            <p className="text-blue-300 text-[11px] mb-0.5">Waiting</p>
            <p className="text-white font-bold text-lg">{waitingItems.length}</p>
          </div>
          <div className="rounded-lg p-2.5 text-center bg-white/5">
            <p className="text-blue-300 text-[11px] mb-0.5">Serving</p>
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
                  ? 'bg-sky-500 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span className="flex-1 font-medium">{label}</span>
              <ChevronRight size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100' : ''}`} />
            </Link>
          );
        })}

        <div className="pt-2 mt-2 border-t border-white/10">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            <Users size={16} />
            <span>Queue View</span>
          </Link>
          <Link
            to="/display"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            <LayoutDashboard size={16} />
            <span>Display Screen</span>
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors text-sm"
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
        className="hidden lg:flex flex-col w-56 sticky top-0 h-screen shrink-0 bg-gray-900"
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
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden flex flex-col bg-gray-900"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-gray-900 font-semibold text-sm">
                {NAV_ITEMS.find(n => isActive(n.href, n.exact))?.label ?? 'Admin'}
              </h1>
              <p className="text-gray-400 text-[11px]">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-green-700 text-[11px] font-medium">Live</span>
            </div>

            {notifications.length > 0 && (
              <div className="relative">
                <Bell size={16} className="text-gray-500" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                  {notifications.length}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200">
              <ShieldCheck size={12} className="text-sky-600" />
              <span className="text-sky-700 text-[11px] font-medium">Admin</span>
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
