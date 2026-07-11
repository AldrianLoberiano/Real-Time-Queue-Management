
import { Clock, PlayCircle, CheckCircle, SkipForward } from 'lucide-react';
import type { StatusType } from '../QueueContext';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const CONFIG = {
  waiting: {
    label: 'Waiting',
    icon: Clock,
    classes: 'bg-amber-50 text-amber-600 border-amber-200/60',
  },
  serving: {
    label: 'Serving',
    icon: PlayCircle,
    classes: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  },
  done: {
    label: 'Done',
    icon: CheckCircle,
    classes: 'bg-gray-100 text-gray-500 border-gray-200/60',
  },
  skipped: {
    label: 'Skipped',
    icon: SkipForward,
    classes: 'bg-red-50 text-red-500 border-red-200/60',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cfg = CONFIG[status];
  const Icon = cfg.icon;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';
  const iconSize = size === 'sm' ? 10 : 12;

  return (
    <span className={`inline-flex items-center rounded-lg border font-semibold ${cfg.classes} ${sizeClass}`}>
      <Icon size={iconSize} />
      {cfg.label}
    </span>
  );
}
