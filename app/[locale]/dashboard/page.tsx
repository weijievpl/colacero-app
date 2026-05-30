'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus, MoreHorizontal, Play, Pause, Trash2, FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TopBar } from '@/components/shared/TopBar';
import { BottomSheet } from '@/components/mobile/BottomSheet';
import { FAB } from '@/components/mobile/FAB';
import { StatsGrid } from '@/components/admin/StatsGrid';
import { QueuePanel } from '@/components/admin/QueuePanel';
import { ServeButton } from '@/components/admin/ServeButton';
import { CurrentNumberDisplay } from '@/components/admin/CurrentNumberDisplay';
import { ServiceHistory } from '@/components/admin/ServiceHistory';
import { useQueueStore } from '@/lib/store/queueStore';
import type { TicketReason } from '@/lib/types';

export default function DashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';
  const t = useTranslations();
  const [actionsOpen, setActionsOpen] = useState(false);
  
  const initializeWithMockData = useQueueStore((s) => s.initializeWithMockData);
  const tickets = useQueueStore((s) => s.tickets);
  const history = useQueueStore((s) => s.history);
  const isPaused = useQueueStore((s) => s.isPaused);
  const pauseQueue = useQueueStore((s) => s.pauseQueue);
  const resumeQueue = useQueueStore((s) => s.resumeQueue);
  const clearQueue = useQueueStore((s) => s.clearQueue);
  const toggleSimulation = useQueueStore((s) => s.toggleSimulation);
  const simulationActive = useQueueStore((s) => s.simulationActive);

  useEffect(() => {
    if (tickets.length === 0 && history.length === 0) initializeWithMockData();
  }, [tickets.length, history.length, initializeWithMockData]);

  const reasonLabels: Record<TicketReason, string> = {
    information: t('join.reasons.information'),
    appointment: t('join.reasons.appointment'),
    complaint: t('join.reasons.complaint'),
    payment: t('join.reasons.payment'),
    pickup: t('join.reasons.pickup'),
    other: t('join.reasons.other'),
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <TopBar />
      
      <main className="px-4 pb-24 pt-4 md:container md:mx-auto md:px-4 md:pb-16 md:pt-6">
        {/* Compact Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold md:text-2xl">{t('admin.title')}</h1>
            <Badge variant="secondary" className="text-[10px]">{t('common.demo')}</Badge>
          </div>
          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="outline" size="sm" onClick={() => isPaused ? resumeQueue() : pauseQueue()}>
              {isPaused ? <Play className="mr-1 h-4 w-4" /> : <Pause className="mr-1 h-4 w-4" />}
              {isPaused ? t('admin.resume') : t('admin.pause')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => clearQueue()}>
              <Trash2 className="mr-1 h-4 w-4" />
              {t('admin.clearQueue')}
            </Button>
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setActionsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted active:bg-muted/80 md:hidden"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Stats - compact 2x2 on mobile */}
        <div className="mb-4">
          <StatsGrid labels={{
            waiting: t('admin.metrics.waiting'),
            servedToday: t('admin.metrics.servedToday'),
            avgTime: t('admin.metrics.avgTime'),
            peakHour: t('admin.metrics.peakHour'),
          }} />
        </div>

        {/* Current Number + Serve - stacked on mobile */}
        <div className="mb-4 grid gap-3 md:grid-cols-2 md:gap-4">
          <CurrentNumberDisplay
            title={t('admin.currentlyServing')}
            noTicketLabel={t('admin.noCurrentTicket')}
          />
          <div className="flex items-center">
            <ServeButton label={t('admin.serveNext')} />
          </div>
        </div>

        {/* Queue Panel */}
        <div className="mb-4">
          <QueuePanel
            labels={{
              title: t('admin.queue'),
              empty: t('admin.emptyQueue'),
              emptySub: t('admin.emptyQueueSub'),
              anonymous: t('admin.ticket.anonymous'),
              cancel: t('admin.ticket.cancel'),
              reasons: reasonLabels,
            }}
            locale={locale}
          />
        </div>

        {/* Service History */}
        <ServiceHistory
          labels={{
            title: t('admin.history'),
            empty: t('admin.noHistory'),
            exportCsv: t('admin.exportCsv'),
            columns: {
              number: t('admin.ticket.number'),
              name: t('admin.ticket.name'),
              reason: t('admin.ticket.reason'),
              joinedAt: t('admin.ticket.joinedAt'),
              servedAt: t('admin.ticket.servedAt'),
            },
            anonymous: t('admin.ticket.anonymous'),
            reasons: reasonLabels,
          }}
          locale={locale}
        />
      </main>

      {/* Mobile FAB - quick serve */}
      <FAB
        icon={<Plus className="h-6 w-6" />}
        onClick={() => {}}
        label="Quick action"
      />

      {/* Mobile Actions Bottom Sheet */}
      <BottomSheet isOpen={actionsOpen} onClose={() => setActionsOpen(false)} title={t('admin.title')}>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={() => { isPaused ? resumeQueue() : pauseQueue(); setActionsOpen(false); }}
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            {isPaused ? t('admin.resume') : t('admin.pause')}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={() => { toggleSimulation(); setActionsOpen(false); }}
          >
            <FlaskConical className="h-5 w-5" />
            {simulationActive ? t('admin.simulationOn') : t('admin.simulationOff')}
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start gap-3 h-12"
            onClick={() => { clearQueue(); setActionsOpen(false); }}
          >
            <Trash2 className="h-5 w-5" />
            {t('admin.clearQueue')}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
