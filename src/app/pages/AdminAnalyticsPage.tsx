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
