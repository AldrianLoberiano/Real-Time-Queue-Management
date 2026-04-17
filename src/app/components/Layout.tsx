import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Users, Monitor, ShieldCheck, Menu, X, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '../context/QueueContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { notifications, dismissNotification, waitingItems, currentlyServing } = useQueue();
  const [showNotifs, setShowNotifs] = useState(false);

  const navLinks = [
    { href: '/', label: 'Join Queue', icon: Users },
    { href: '/display', label: 'Display Screen', icon: Monitor },
    { href: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f1f5f9' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }} className="shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
                <Users size={20} className="text-white" />
              </div>
              <div>
                <span className="text-white font-semibold text-lg leading-none">QueueSmart</span>
                <p className="text-blue-300 text-xs">Real-Time Queue Manager</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    to={href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      active
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'text-blue-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Live stats */}
              <div className="hidden sm:flex items-center gap-3 text-xs text-blue-200">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {currentlyServing ? currentlyServing.number : '–'} serving
                </span>
                <span className="text-blue-400">|</span>
                <span>{waitingItems.length} waiting</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-all"
                >
                  {notifications.length > 0 ? <Bell size={18} /> : <BellOff size={18} />}
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifs && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Notifications</span>
                        <button onClick={() => setShowNotifs(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-6">No notifications</p>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className={`flex items-start gap-3 p-3 border-b border-gray-50 hover:bg-gray-50 ${
                              n.type === 'success' ? 'border-l-2 border-l-green-400' :
                              n.type === 'warning' ? 'border-l-2 border-l-amber-400' :
                              'border-l-2 border-l-sky-400'
                            }`}>
                              <div className="flex-1">
                                <p className="text-sm text-gray-700">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{n.timestamp.toLocaleTimeString()}</p>
                              </div>
                              <button onClick={() => dismissNotification(n.id)} className="text-gray-300 hover:text-gray-500 mt-0.5">
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

              {/* Mobile menu */}
              <button
                className="md:hidden p-2 text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
