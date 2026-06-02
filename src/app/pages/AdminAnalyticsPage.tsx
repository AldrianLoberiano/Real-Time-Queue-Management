import React, { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Users, Clock, CheckCircle, Crown, Heart, User, Award } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useQueue } from '../context/QueueContext';

const COLORS = {
  vip: '#f59e0b',
  senior: '#8b5cf6',
  regular: '#3b82f6',
};

function MetricCard({ label, value, icon, change, color }: {
  label: string; value: string | number;
  icon: React.ReactNode; change?: string; color: string;
}) {
  const bgMap: Record<string, string> = {
    sky: 'from-sky-400 to-sky-600',
    emerald: 'from-emerald-400 to-emerald-600',
    violet: 'from-violet-400 to-violet-600',
    amber: 'from-amber-400 to-amber-600',
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
