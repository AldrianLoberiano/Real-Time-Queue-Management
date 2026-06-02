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
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${bgMap[color]}`}>
          {icon}
        </div>
        {change && (
          <span className="text-xs text-green-500 font-medium bg-green-50 px-2 py-1 rounded-full border border-green-200">
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
      <p className="text-gray-600 text-xs font-semibold mb-2">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

export function AdminAnalyticsPage() {
  const { items, hourlyData, totalServedToday, avgServiceTime, waitingItems } = useQueue();

  const priorityDist = useMemo(() => {
    const all = items.filter(i => i.status === 'done' || i.status === 'serving');
    const vip = all.filter(i => i.type === 'vip').length;
