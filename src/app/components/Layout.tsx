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
