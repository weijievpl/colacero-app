'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Clock, Bell, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TopBar } from '@/components/shared/TopBar';
import { useQueueStore, selectWaitingCount, selectIsPaused } from '@/lib/store/queueStore';

export default function LandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';
  const t = useTranslations();
  
  const waitingCount = useQueueStore(selectWaitingCount);
  const isPaused = useQueueStore(selectIsPaused);
  const initializeWithMockData = useQueueStore((s) => s.initializeWithMockData);
  const tickets = useQueueStore((s) => s.tickets);

  useEffect(() => {
    if (tickets.length === 0) initializeWithMockData();
  }, [tickets.length, initializeWithMockData]);

  return (
    <div className="min-h-[100dvh] bg-background">
      <TopBar />
      
      <main className="px-4 pb-24 pt-4 md:container md:mx-auto md:px-4 md:pb-16 md:pt-12">
        {/* Hero Card - Full width mobile-first */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 p-6 text-white shadow-xl md:rounded-2xl md:p-10"
        >
          <div className="mb-4 flex items-center gap-3">
            <Image
              src="/assets/images/colacero-logo.png"
              alt="ColaCero"
              width={120}
              height={32}
              className="h-8 w-auto brightness-0 invert md:h-10"
              priority
            />
          </div>
          
          <h1 className="mb-2 text-2xl font-bold leading-tight md:text-4xl">
            {t('landing.hero')}
          </h1>
          <p className="mb-6 text-sm text-blue-100 md:text-lg">
            {t('landing.subtitle')}
          </p>

          {/* Live status pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs backdrop-blur md:text-sm">
            <span className={`h-2 w-2 rounded-full ${isPaused ? 'bg-yellow-300' : 'bg-green-300 animate-pulse'}`} />
            {isPaused ? t('landing.servicePaused') : t('landing.serviceActive')}
            <span className="mx-1 text-white/40">•</span>
            <Users className="h-3 w-3" />
            <span className="font-semibold">{waitingCount}</span> {t('landing.waitingNow')}
          </div>

          {/* Primary CTA */}
          <Button
            asChild
            size="lg"
            className="w-full bg-white text-primary hover:bg-blue-50 md:w-auto md:min-w-[200px]"
          >
            <Link href={`/${locale}/join`}>
              {t('navigation.customer')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <QuickAction
            icon={<Clock className="h-5 w-5" />}
            title={locale === 'zh' ? '实时状态' : 'En vivo'}
            color="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
          />
          <QuickAction
            icon={<Bell className="h-5 w-5" />}
            title={locale === 'zh' ? '即时通知' : 'Alertas'}
            color="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
          />
          <QuickAction
            icon={<Users className="h-5 w-5" />}
            title={locale === 'zh' ? '无需排队' : 'Sin fila'}
            color="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300"
          />
          <QuickAction
            icon={<ChevronRight className="h-5 w-5" />}
            title={locale === 'zh' ? '管理面板' : 'Admin'}
            href={`/${locale}/dashboard`}
            color="bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300"
          />
        </div>

        {/* Feature Cards - Horizontal snap scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          <FeatureCard
            emoji="📱"
            title={locale === 'zh' ? '手机取号' : 'Desde el móvil'}
            desc={locale === 'zh' ? '扫码或点击即可加入队列' : 'Únete a la cola desde tu teléfono'}
          />
          <FeatureCard
            emoji="⏱️"
            title={locale === 'zh' ? '实时追踪' : 'Tiempo real'}
            desc={locale === 'zh' ? '随时查看你的排队位置' : 'Conoce tu posición al instante'}
          />
          <FeatureCard
            emoji="🔔"
            title={locale === 'zh' ? '智能提醒' : 'Notificaciones'}
            desc={locale === 'zh' ? '轮到你时自动通知' : 'Te avisamos cuando sea tu turno'}
          />
        </div>

        {/* Demo badge */}
        <div className="mt-6 text-center">
          <Badge variant="secondary" className="text-xs">{t('common.demo')}</Badge>
        </div>
      </main>
    </div>
  );
}

function QuickAction({ icon, title, color, href }: { icon: React.ReactNode; title: string; color: string; href?: string }) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 ${color} active:scale-[0.97] transition-transform`}>
      {icon}
      <span className="text-xs font-medium md:text-sm">{title}</span>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : <div>{content}</div>;
}

function FeatureCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <Card className="min-w-[240px] shrink-0 snap-center border-border/30 bg-card/80 md:min-w-0">
      <CardContent className="p-4">
        <div className="mb-2 text-2xl">{emoji}</div>
        <h3 className="mb-1 text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}
