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
import { QRCode } from '@/components/mobile/QRCode';
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
      <div className="min-h-[100dvh] bg-background">
        <TopBar />
        <main className="flex flex-col items-center justify-center px-4 pb-24 pt-8 md:container md:mx-auto md:py-16">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-6 md:p-8">
              <h1 className="mb-4 text-lg font-semibold text-foreground md:text-xl">{t('errors.ticketNotFound')}</h1>
              <Button asChild><Link href={`/${locale}`}><ArrowLeft className="mr-2 h-4 w-4" />{t('common.back')}</Link></Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <TopBar />
        <main className="flex items-center justify-center px-4 pb-24 pt-8 md:container md:mx-auto md:py-16">
          <div className="text-muted-foreground">{t('common.loading')}</div>
        </main>
      </div>
    );
  }

  if (isServed) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <TopBar />
        <main className="flex flex-col items-center justify-center px-4 pb-24 pt-8 md:container md:mx-auto md:py-16">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-6 md:p-8">
              <div className="mb-4 font-mono text-5xl font-bold text-primary md:mb-6 md:text-6xl">{ticket.number.toString().padStart(2, '0')}</div>
              <h1 className="mb-2 text-xl font-bold text-foreground md:text-2xl">{t('wait.served')}</h1>
              <p className="mb-6 text-sm text-muted-foreground md:mb-8 md:text-base">{t('wait.servedSub')}</p>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg"><Link href={`/${locale}/join`}>{t('wait.joinAgain')}</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href={`/${locale}`}>{t('wait.backToHome')}</Link></Button>
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
    <div className="min-h-[100dvh] bg-background" onClick={handleInteraction}>
      <TopBar />
      <main className="px-4 pb-24 pt-4 md:container md:mx-auto md:px-4 md:py-8">
        <div className="mx-auto max-w-md space-y-4 md:space-y-6">
          <ServiceStatusBanner status={isPaused ? 'paused' : 'active'} activeLabel={t('wait.statusActive')} pausedLabel={t('wait.statusPaused')} closedLabel={t('wait.statusClosed')} pausedMessage={isPaused ? t('wait.pausedMessage') : undefined} />
          <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur rounded-2xl">
            <CardHeader className="pb-2 text-center"><CardTitle className="text-base text-muted-foreground md:text-lg">{t('wait.yourNumber')}</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pb-6 md:pb-8">
              <TicketHero number={ticket.number} />
              {ticket.partySize && ticket.partySize > 1 && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  👥 {ticket.partySize} {locale === 'zh' ? '人' : locale === 'es' ? 'personas' : 'people'}
                </span>
              )}
              <div className="mt-2 rounded-xl border border-border/30 bg-white p-3">
                <QRCode value={`colacero:${ticket.id}:${ticket.number}`} size={120} />
              </div>
              <p className="text-[10px] text-muted-foreground">{locale === 'zh' ? '扫码分享排队状态' : locale === 'es' ? 'Escanea para compartir tu estado' : 'Scan to share your status'}</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/30 rounded-2xl">
            <CardContent className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground md:text-base">{t('wait.currentNumber')}</span>
              <span className="font-mono text-2xl font-bold text-foreground md:text-3xl" aria-live="polite">{currentNumber > 0 ? currentNumber.toString().padStart(2, '0') : '--'}</span>
            </CardContent>
          </Card>
          <Card className="rounded-2xl"><CardContent className="p-4"><PositionTracker position={position} total={waitingCount} label={t('wait.position')} valueLabel={t('wait.positionValue', { position, total: waitingCount })} /></CardContent></Card>
          <WaitEstimate minutes={estimatedMinutes} label={t('wait.estimatedWait')} valueLabel={position === 1 ? t('wait.youAreNext') : t('wait.estimatedWaitValue', { minutes: estimatedMinutes })} />
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm md:text-base">{t('wait.local.title')}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs md:text-sm">
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
