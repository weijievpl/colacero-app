'use client';
// Required: Uses Zustand store for real-time stats

import { Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useQueueStore, selectWaitingCount, selectServedTodayCount } from '@/lib/store/queueStore';
import { msToMinutes } from '@/lib/queue/estimateWait';
import { findPeakHour, formatHour } from '@/lib/queue/buildPeakData';
import { buildPeakData } from '@/lib/queue/buildPeakData';

interface StatsGridProps {
  labels: {
    waiting: string;
    servedToday: string;
    avgTime: string;
    peakHour: string;
  };
}

export function StatsGrid({ labels }: StatsGridProps) {
  const waitingCount = useQueueStore(selectWaitingCount);
  const servedTodayCount = useQueueStore(selectServedTodayCount);
  const avgServiceTimeMs = useQueueStore((s) => s.avgServiceTimeMs);
  const history = useQueueStore((s) => s.history);
  
  const avgMinutes = msToMinutes(avgServiceTimeMs);
  const peakData = buildPeakData(history);
  const peakHour = findPeakHour(peakData);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatsCard
        title={labels.waiting}
        value={waitingCount}
        icon={<Users className="h-5 w-5" />}
      />
      <StatsCard
        title={labels.servedToday}
        value={servedTodayCount}
        icon={<CheckCircle className="h-5 w-5" />}
      />
      <StatsCard
        title={labels.avgTime}
        value={`${avgMinutes} min`}
        icon={<Clock className="h-5 w-5" />}
      />
      <StatsCard
        title={labels.peakHour}
        value={formatHour(peakHour, 'full')}
        icon={<TrendingUp className="h-5 w-5" />}
      />
    </div>
  );
}
