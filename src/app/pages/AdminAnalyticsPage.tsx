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

  const peakHour = hourlyData.reduce((max, h) => h.served > max.served ? h : max, hourlyData[0] ?? { hour: '—', served: 0 });

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
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Served Today"
          value={totalServedToday}
          icon={<CheckCircle size={22} />}
          change="+12%"
          color="sky"
        />
        <MetricCard
          label="Avg. Wait Time"
          value={`${avgServiceTime}m`}
          icon={<Clock size={22} />}
          change="-8%"
          color="emerald"
        />
        <MetricCard
          label="Efficiency Rate"
          value={`${efficiency}%`}
          icon={<TrendingUp size={22} />}
          change="+5%"
          color="violet"
        />
        <MetricCard
          label="Peak Hour"
          value={peakHour?.hour ?? '—'}
          icon={<Award size={22} />}
          color="amber"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Hourly traffic */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">Hourly Traffic</h3>
              <p className="text-gray-400 text-sm">Queue joins and served per hour today</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradServed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradJoined" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="served" name="Served" stroke="#0ea5e9" strokeWidth={2} fill="url(#gradServed)" />
              <Area type="monotone" dataKey="joined" name="Joined" stroke="#10b981" strokeWidth={2} fill="url(#gradJoined)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Priority distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-1">Priority Split</h3>
          <p className="text-gray-400 text-sm mb-4">Distribution of queue types</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={priorityDist}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
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
          <div className="mt-2 space-y-2">
            {priorityDist.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-sm text-gray-600">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{d.value}</span>
                  <span className="text-xs text-gray-400">
                    ({priorityDist.reduce((s, x) => s + x.value, 0) > 0
                      ? Math.round(d.value / priorityDist.reduce((s, x) => s + x.value, 0) * 100)
                      : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-1">Weekly Overview</h3>
          <p className="text-gray-400 text-sm mb-4">Served vs waited this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="served" name="Served" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="waited" name="Avg Wait (min)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wait time distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
