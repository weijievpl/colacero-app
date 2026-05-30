'use client';
// Required: Uses Zustand store, polling, and client-side state

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TopBar } from '@/components/shared/TopBar';
import { TicketHero } from '@/components/customer/TicketHero';
import { PositionTracker } from '@/components/customer/PositionTracker';
import { WaitEstimate } from '@/components/customer/WaitEstimate';
import { TurnAlert } from '@/components/customer/TurnAlert';
import { ServiceStatusBanner } from '@/components/customer/ServiceStatusBanner';
import { useQueueStore, selectCurrentNumber, selectIsPaused, selectWaitingCount } from '@/lib/store/queueStore';
import { calculatePosition } from '@/lib/queue/calculatePosition';
import { msToMinutes } from '@/lib/queue/estimateWait';
import { requestNotificationPermission } from '@/lib/notifications/browserNotification';
import { POLLING_INTERVAL, BUSINESS_INFO } from '@/lib/constants';
import type { Ticket } from '@/lib/types';

export default function WaitPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'es';
  const ticketId = params?.ticketId as string;
  
  const t = useTranslations();
  
  const tickets = useQueueStore((s) => s.tickets);
  const history = useQueueStore((s) => s.history);
  const currentNumber = useQueueStore(selectCurrentNumber);
  const isPaused = useQueueStore(selectIsPaused);
  const waitingCount = useQueueStore(selectWaitingCount);
  const avgServiceTimeMs = useQueueStore((s) => s.avgServiceTimeMs);
  const setUserInteracted = useQueueStore((s) => s.setUserInteracted);
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [showTurnAlert, setShowTurnAlert] = useState(false);
  const [isServed, setIsServed] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const findTicket = useCallback(() => {
    const inQueue = tickets.find((t) => t.id === ticketId);
    if (inQueue) return inQueue;
    const inHistory = history.find((t) => t.id === ticketId);
    if (inHistory) return inHistory;
    return null;
  }, [tickets, history, ticketId]);

  useEffect(() => {
    const foundTicket = findTicket();
    if (!foundTicket) {
      const stored = sessionStorage.getItem(`colacero-ticket-${ticketId}`);
      if (stored) {
        try { setTicket(JSON.parse(stored)); } catch { setNotFound(true); }
      } else { setNotFound(true); }
      return;
    }
    setTicket(foundTicket);
    if (foundTicket.status === 'served') setIsServed(true);
  }, [findTicket, ticketId]);

  useEffect(() => { requestNotificationPermission(); }, []);

  useEffect(() => {
    if (ticket && currentNumber === ticket.number && !isServed) setShowTurnAlert(true);
  }, [currentNumber, ticket, isServed]);

  useEffect(() => {
    const interval = setInterval(() => {
      const foundTicket = findTicket();
      if (foundTicket) {
        setTicket(foundTicket);
        if (foundTicket.status === 'served') setIsServed(true);
      }
    }, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [findTicket]);

  const handleInteraction = () => { setUserInteracted(); };

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <main className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <h1 className="mb-4 text-xl font-semibold text-foreground">{t('errors.ticketNotFound')}</h1>
              <Button asChild><Link href={`/${locale}`}><ArrowLeft className="mr-2 h-4 w-4" />{t('common.back')}</Link></Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <main className="container mx-auto flex items-center justify-center px-4 py-16">
          <div className="text-muted-foreground">{t('common.loading')}</div>
        </main>
      </div>
    );
  }

  if (isServed) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <main className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="mb-6 font-mono text-5xl font-bold text-primary">{ticket.number.toString().padStart(2, '0')}</div>
              <h1 className="mb-2 text-2xl font-bold text-foreground">{t('wait.served')}</h1>
              <p className="mb-8 text-muted-foreground">{t('wait.servedSub')}</p>
              <div className="flex flex-col gap-3">
                <Button asChild><Link href={`/${locale}/join`}>{t('wait.joinAgain')}</Link></Button>
                <Button asChild variant="outline"><Link href={`/${locale}`}>{t('wait.backToHome')}</Link></Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const position = calculatePosition(tickets, ticket.number);
  const estimatedMinutes = msToMinutes(position > 0 ? (position - 1) * avgServiceTimeMs : 0);

  return (
    <div className="min-h-screen bg-background" onClick={handleInteraction}>
      <TopBar />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md space-y-6">
          <ServiceStatusBanner status={isPaused ? 'paused' : 'active'} activeLabel={t('wait.statusActive')} pausedLabel={t('wait.statusPaused')} closedLabel={t('wait.statusClosed')} pausedMessage={isPaused ? t('wait.pausedMessage') : undefined} />
          <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur">
            <CardHeader className="pb-2 text-center"><CardTitle className="text-lg text-muted-foreground">{t('wait.yourNumber')}</CardTitle></CardHeader>
            <CardContent className="pb-8"><TicketHero number={ticket.number} /></CardContent>
          </Card>
          <Card className="bg-secondary/30">
            <CardContent className="flex items-center justify-between p-4">
              <span className="text-muted-foreground">{t('wait.currentNumber')}</span>
              <span className="font-mono text-2xl font-bold text-foreground" aria-live="polite">{currentNumber > 0 ? currentNumber.toString().padStart(2, '0') : '--'}</span>
            </CardContent>
          </Card>
          <Card><CardContent className="p-4"><PositionTracker position={position} total={waitingCount} label={t('wait.position')} valueLabel={t('wait.positionValue', { position, total: waitingCount })} /></CardContent></Card>
          <WaitEstimate minutes={estimatedMinutes} label={t('wait.estimatedWait')} valueLabel={position === 1 ? t('wait.youAreNext') : t('wait.estimatedWaitValue', { minutes: estimatedMinutes })} />
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">{t('wait.local.title')}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">{t('wait.local.address')}: </span><span>{BUSINESS_INFO.address}</span></div>
              <div><span className="text-muted-foreground">{t('wait.local.phone')}: </span><span>{BUSINESS_INFO.phone}</span></div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-block text-primary hover:underline">{t('wait.local.viewMap')}</a>
            </CardContent>
          </Card>
        </div>
      </main>
      <TurnAlert isOpen={showTurnAlert} onDismiss={() => setShowTurnAlert(false)} title={t('wait.yourTurn')} subtitle={t('wait.yourTurnSub')} dismissLabel={t('wait.dismiss')} ticketNumber={ticket.number} customerName={ticket.name} notificationBody={t('notifications.turnBody', { name: ticket.name || 'Cliente' })} />
    </div>
  );
}
