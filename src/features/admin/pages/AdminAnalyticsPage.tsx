import React, { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Users, Clock, CheckCircle, Crown, Heart, User, Award } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useQueue } from '../../queue/QueueContext';

const COLORS = {
  vip: '#f59e0b',
  senior: '#8b5cf6',
  regular: '#3b82f6',
};

function MetricCard({ label, value, icon, color }: {
  label: string; value: string | number;
  icon: React.ReactNode; color: string;
}) {
  const bgMap: Record<string, string> = {
    sky: 'bg-sky-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white ${bgMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{value}</p>
          <p className="text-gray-500 text-xs">{label}</p>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2.5">
      <p className="text-gray-600 text-[11px] font-semibold mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: entry.color }} />
          <span className="text-gray-500">{entry.name}:</span>
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
    const senior = all.filter(i => i.type === 'senior').length;
    const regular = all.filter(i => i.type === 'regular').length;
    return [
      { name: 'VIP', value: vip, color: COLORS.vip },
      { name: 'Senior', value: senior, color: COLORS.senior },
      { name: 'Regular', value: regular, color: COLORS.regular },
    ];
  }, [items]);

  const efficiency = totalServedToday > 0
    ? Math.round((totalServedToday / (totalServedToday + waitingItems.length)) * 100)
    : 0;

  const peakHour = hourlyData.reduce((max, h) => h.served > max.served ? h : max, hourlyData[0] ?? { hour: '-', served: 0 });

  const weeklyData = [
    { day: 'Mon', served: 42, waited: 5 },
    { day: 'Tue', served: 38, waited: 3 },
    { day: 'Wed', served: 51, waited: 8 },
    { day: 'Thu', served: 45, waited: 6 },
    { day: 'Fri', served: 67, waited: 12 },
    { day: 'Sat', served: 29, waited: 2 },
    { day: 'Sun', served: 18, waited: 1 },
  ];

  const waitTimeData = [
    { range: '0-2 min', count: 12 },
    { range: '2-5 min', count: 28 },
    { range: '5-10 min', count: 18 },
    { range: '10-15 min', count: 8 },
    { range: '15+ min', count: 4 },
  ];

  return (
    <AdminLayout>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Served Today" value={totalServedToday} icon={<CheckCircle size={18} />} color="sky" />
        <MetricCard label="Avg. Wait Time" value={`${avgServiceTime}m`} icon={<Clock size={18} />} color="emerald" />
        <MetricCard label="Efficiency" value={`${efficiency}%`} icon={<TrendingUp size={18} />} color="violet" />
        <MetricCard label="Peak Hour" value={peakHour?.hour ?? '-'} icon={<Award size={18} />} color="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-medium text-gray-800 text-sm mb-4">Hourly Traffic</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradServed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradJoined" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="served" name="Served" stroke="#0ea5e9" strokeWidth={1.5} fill="url(#gradServed)" />
              <Area type="monotone" dataKey="joined" name="Joined" stroke="#10b981" strokeWidth={1.5} fill="url(#gradJoined)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-medium text-gray-800 text-sm mb-3">Priority Split</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={priorityDist}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
              >
                {priorityDist.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number, name: string) => [val, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {priorityDist.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-gray-600">{d.name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-medium text-gray-800 text-sm mb-4">Weekly Overview</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="served" name="Served" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
              <Bar dataKey="waited" name="Avg Wait (min)" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-medium text-gray-800 text-sm mb-4">Wait Time Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={waitTimeData} layout="vertical" margin={{ top: 5, right: 5, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="range" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Customers" fill="#8b5cf6" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 text-sm">Today's Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
          {[
            { label: 'VIP Customers', value: priorityDist.find(d => d.name === 'VIP')?.value ?? 0, icon: <Crown size={16} />, color: 'text-amber-600 bg-amber-50' },
            { label: 'Senior Citizens', value: priorityDist.find(d => d.name === 'Senior')?.value ?? 0, icon: <Heart size={16} />, color: 'text-violet-600 bg-violet-50' },
            { label: 'Regular', value: priorityDist.find(d => d.name === 'Regular')?.value ?? 0, icon: <User size={16} />, color: 'text-blue-600 bg-blue-50' },
            { label: 'Still Waiting', value: waitingItems.length, icon: <Users size={16} />, color: 'text-sky-600 bg-sky-50' },
          ].map(item => (
            <div key={item.label} className="p-4 text-center">
              <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center mb-2 ${item.color}`}>
                {item.icon}
              </div>
              <p className="text-lg font-bold text-gray-900">{item.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
