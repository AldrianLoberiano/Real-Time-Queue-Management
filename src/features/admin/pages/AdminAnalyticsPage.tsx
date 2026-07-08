import React from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Users, Clock, CheckCircle, Award } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useQueue } from '../../queue/QueueContext';

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
  const { hourlyData, totalServedToday, avgServiceTime, waitingItems } = useQueue();

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

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
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
          <h3 className="font-medium text-gray-800 text-sm mb-4">Weekly Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
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
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
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

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-medium text-gray-800 text-sm mb-4">Still Waiting</h3>
          <div className="flex items-center justify-center h-[180px]">
            <div className="text-center">
              <p className="text-5xl font-bold text-sky-600">{waitingItems.length}</p>
              <p className="text-gray-400 text-sm mt-1">customers waiting</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 text-sm">Today's Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
          {[
            { label: 'Total Served', value: totalServedToday, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Still Waiting', value: waitingItems.length, color: 'text-sky-600 bg-sky-50' },
            { label: 'Avg. Service Time', value: `${avgServiceTime}m`, color: 'text-amber-600 bg-amber-50' },
            { label: 'Efficiency', value: `${efficiency}%`, color: 'text-violet-600 bg-violet-50' },
          ].map(item => (
            <div key={item.label} className="p-4 text-center">
              <p className={`text-2xl font-bold ${item.color.split(' ')[0]}`}>{item.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
