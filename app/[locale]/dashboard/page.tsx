'use client';
// Required: Uses Zustand store and client-side state

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { TopBar } from '@/components/shared/TopBar';
import { StatsGrid } from '@/components/admin/StatsGrid';
import { QueuePanel } from '@/components/admin/QueuePanel';
import { ServeButton } from '@/components/admin/ServeButton';
import { PauseToggle } from '@/components/admin/PauseToggle';
import { ClearQueueDialog } from '@/components/admin/ClearQueueDialog';
import { SimulationToggle } from '@/components/admin/SimulationToggle';
import { CurrentNumberDisplay } from '@/components/admin/CurrentNumberDisplay';
import { ServiceHistory } from '@/components/admin/ServiceHistory';
import { useQueueStore } from '@/lib/store/queueStore';
import type { TicketReason } from '@/lib/types';

export default function DashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';
  const t = useTranslations();
  
  const initializeWithMockData = useQueueStore((s) => s.initializeWithMockData);
  const tickets = useQueueStore((s) => s.tickets);
  const history = useQueueStore((s) => s.history);

  // Initialize mock data if empty
  useEffect(() => {
    if (tickets.length === 0 && history.length === 0) {
      initializeWithMockData();
    }
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
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground md:text-2xl">{t('admin.title')}</h1>
            <Badge variant="secondary" className="mt-1 text-xs">{t('common.demo')}</Badge>
          </div>
          
          {/* Action Buttons - hidden on mobile, shown in bottom sheet or FAB */}
          <div className="hidden flex-wrap items-center gap-3 md:flex">
            <PauseToggle
              pauseLabel={t('admin.pause')}
              resumeLabel={t('admin.resume')}
            />
            <ClearQueueDialog
              buttonLabel={t('admin.clearQueue')}
              title={t('admin.clearQueueConfirm')}
              description={t('admin.clearQueueWarning')}
              cancelLabel={t('common.cancel')}
              confirmLabel={t('common.confirm')}
            />
          </div>
        </div>

        {/* Mobile Action Bar - compact horizontal scroll */}
        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar pb-1 md:hidden">
          <PauseToggle
            pauseLabel={t('admin.pause')}
            resumeLabel={t('admin.resume')}
          />
          <ClearQueueDialog
            buttonLabel={t('admin.clearQueue')}
            title={t('admin.clearQueueConfirm')}
            description={t('admin.clearQueueWarning')}
            cancelLabel={t('common.cancel')}
            confirmLabel={t('common.confirm')}
          />
          <SimulationToggle
            label={t('admin.simulation')}
            onLabel={t('admin.simulationOn')}
            offLabel={t('admin.simulationOff')}
          />
        </div>

        {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
        <div className="mb-4 md:mb-6">
          <StatsGrid
            labels={{
              waiting: t('admin.metrics.waiting'),
              servedToday: t('admin.metrics.servedToday'),
              avgTime: t('admin.metrics.avgTime'),
              peakHour: t('admin.metrics.peakHour'),
            }}
          />
        </div>

        {/* Serve Button - prominent on mobile */}
        <div className="mb-4 md:hidden">
          <ServeButton label={t('admin.serveNext')} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          {/* Queue Panel */}
          <div className="lg:col-span-2">
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

          {/* Right Column - stacked on mobile */}
          <div className="space-y-4 md:space-y-6">
            {/* Current Number */}
            <CurrentNumberDisplay
              title={t('admin.currentlyServing')}
              noTicketLabel={t('admin.noCurrentTicket')}
            />
            {/* Serve Button - desktop only (mobile has it above) */}
            <div className="hidden md:block">
              <ServeButton label={t('admin.serveNext')} />
            </div>
            {/* Simulation Toggle - desktop only (mobile has it in action bar) */}
            <div className="hidden md:block">
              <SimulationToggle
                label={t('admin.simulation')}
                onLabel={t('admin.simulationOn')}
                offLabel={t('admin.simulationOff')}
              />
            </div>
          </div>
        </div>

        {/* Service History */}
        <div className="mt-4 md:mt-6">
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
        </div>
      </main>
    </div>
  );
}
