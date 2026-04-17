import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, BarChart3, ShieldCheck, LogOut, Menu, X,
  Users, Bell, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '../context/QueueContext';

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
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold leading-none">QueueSmart</p>
            <p className="text-blue-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="p-4 border-b border-white/10">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <p className="text-blue-300 text-xs mb-1">Waiting</p>
            <p className="text-white font-bold text-xl">{waitingItems.length}</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <p className="text-blue-300 text-xs mb-1">Serving</p>
            <p className="text-white font-bold text-xl">{currentlyServing ? '1' : '0'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                active
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100' : ''}`} />
            </Link>
          );
        })}

        <div className="pt-2 border-t border-white/10">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-all text-sm"
          >
            <Users size={18} />
            <span>Queue View</span>
          </Link>
          <Link
            to="/display"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-all text-sm"
          >
            <LayoutDashboard size={18} />
            <span>Display Screen</span>
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all text-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#f1f5f9' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 sticky top-0 h-screen shrink-0"
        style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 100%)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
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
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden flex flex-col"
              style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 100%)' }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
