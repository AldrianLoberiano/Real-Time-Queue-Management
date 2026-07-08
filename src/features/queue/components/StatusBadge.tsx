
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
    classes: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  serving: {
    label: 'Serving',
    icon: PlayCircle,
    classes: 'bg-green-50 text-green-700 border-green-200',
  },
  done: {
    label: 'Done',
    icon: CheckCircle,
    classes: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  skipped: {
    label: 'Skipped',
    icon: SkipForward,
    classes: 'bg-red-50 text-red-600 border-red-200',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cfg = CONFIG[status];
  const Icon = cfg.icon;
  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-[11px] gap-1' : 'px-2 py-0.5 text-xs gap-1';
  const iconSize = size === 'sm' ? 10 : 11;

  return (
    <span className={`inline-flex items-center rounded border font-medium ${cfg.classes} ${sizeClass}`}>
      <Icon size={iconSize} />
      {cfg.label}
    </span>
  );
}
