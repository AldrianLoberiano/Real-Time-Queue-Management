import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Users, Monitor, ShieldCheck, Menu, X, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '../context/QueueContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { notifications, dismissNotification, waitingItems, currentlyServing } = useQueue();
