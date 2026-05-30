'use client';
// Required: Uses Zustand store and client-side navigation

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Users, CheckCircle, Clock } from 'lucide-react';
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

  // Initialize mock data on first load
  useEffect(() => {
    if (tickets.length === 0) {
      initializeWithMockData();
    }
  }, [tickets.length, initializeWithMockData]);

  return (
    <div className="min-h-[100dvh] bg-background">
      <TopBar />
      
      <main className="px-4 pb-24 pt-6 md:container md:mx-auto md:px-4 md:pb-16 md:pt-16">
        {/* Hero Section */}
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="mb-6 flex justify-center md:mb-8">
            <Image
              src="/assets/images/colacero-logo.png"
              alt="ColaCero"
              width={280}
              height={80}
              className="h-12 w-auto md:h-20"
              priority
            />
          </div>

          <h1 className="mb-3 text-balance text-3xl font-bold tracking-tight text-foreground md:mb-4 md:text-6xl">
            {t('landing.hero')}
          </h1>
          
          <p className="mb-6 text-pretty text-base text-muted-foreground md:mb-8 md:text-xl">
            {t('landing.subtitle')}
          </p>

          {/* Status Badge */}
          <div className="mb-6 flex justify-center md:mb-8">
            <Badge 
              variant={isPaused ? 'secondary' : 'default'}
              className={`gap-2 px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm ${
                isPaused 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full md:h-2 md:w-2 ${isPaused ? 'bg-yellow-500' : 'bg-green-500'}`} />
              {isPaused ? t('landing.servicePaused') : t('landing.serviceActive')}
            </Badge>
          </div>

          {/* Waiting Count */}
          <Card className="mx-auto mb-6 max-w-xs border-2 border-primary/20 bg-card/50 backdrop-blur md:mb-8">
            <CardContent className="flex items-center justify-center gap-3 p-3 md:p-4">
              <Users className="h-4 w-4 text-primary md:h-5 md:w-5" aria-hidden="true" />
              <span className="text-base font-medium md:text-lg">
                <span className="text-xl font-bold text-primary md:text-2xl">{waitingCount}</span>
                {' '}
                {t('landing.waitingNow')}
              </span>
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button 
              asChild 
              size="lg" 
              className="w-full gap-2 bg-primary px-8 text-lg hover:bg-primary/90 sm:w-auto"
            >
              <Link href={`/${locale}/join`}>
                {t('navigation.customer')}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="w-full gap-2 px-8 text-lg sm:w-auto"
            >
              <Link href={`/${locale}/dashboard`}>
                {t('navigation.admin')}
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Features - Horizontal scroll on mobile, grid on desktop */}
        <motion.div 
          className="mx-auto mt-12 flex max-w-4xl gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 md:mt-24 md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FeatureCard 
            icon={<Clock className="h-7 w-7 md:h-8 md:w-8" />}
            title={locale === 'zh' ? '实时更新' : locale === 'es' ? 'Tiempo real' : 'Real-time'}
            description={locale === 'zh' ? '随时了解您的排队位置' : locale === 'es' ? 'Conoce tu posición al instante' : 'Know your position instantly'}
          />
          <FeatureCard 
            icon={<CheckCircle className="h-7 w-7 md:h-8 md:w-8" />}
            title={locale === 'zh' ? '即时通知' : locale === 'es' ? 'Notificaciones' : 'Notifications'}
            description={locale === 'zh' ? '轮到您时立即通知' : locale === 'es' ? 'Te avisamos cuando sea tu turno' : 'We notify you when it\'s your turn'}
          />
          <FeatureCard 
            icon={<Users className="h-7 w-7 md:h-8 md:w-8" />}
            title={locale === 'zh' ? '无需排队' : locale === 'es' ? 'Sin esperas' : 'No waiting'}
            description={locale === 'zh' ? '用手机取号，自由活动' : locale === 'es' ? 'Saca número y muévete libre' : 'Get your number and move freely'}
          />
        </motion.div>

        {/* Demo Banner */}
        <div className="mt-8 text-center md:mt-12">
          <Badge variant="secondary" className="text-xs">
            {t('common.demo')}
          </Badge>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <Card className="min-w-[260px] shrink-0 snap-center border-border/50 bg-card/50 backdrop-blur md:min-w-0">
      <CardContent className="flex flex-col items-center p-5 text-center md:p-6">
        <div className="mb-3 text-primary md:mb-4">
          {icon}
        </div>
        <h3 className="mb-1.5 font-semibold text-foreground md:mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
