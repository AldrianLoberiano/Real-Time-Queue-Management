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
