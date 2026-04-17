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
