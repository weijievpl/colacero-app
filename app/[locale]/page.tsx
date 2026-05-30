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
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/assets/images/colacero-logo.png"
              alt="ColaCero"
              width={280}
              height={80}
              className="h-16 w-auto md:h-20"
              priority
            />
          </div>

          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            {t('landing.hero')}
          </h1>
          
          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            {t('landing.subtitle')}
          </p>

          {/* Status Badge */}
          <div className="mb-8 flex justify-center">
            <Badge 
              variant={isPaused ? 'secondary' : 'default'}
              className={`gap-2 px-4 py-2 text-sm ${
                isPaused 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500'}`} />
              {isPaused ? t('landing.servicePaused') : t('landing.serviceActive')}
            </Badge>
          </div>

          {/* Waiting Count */}
          <Card className="mx-auto mb-8 max-w-xs border-2 border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="flex items-center justify-center gap-3 p-4">
              <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-lg font-medium">
                <span className="text-2xl font-bold text-primary">{waitingCount}</span>
                {' '}
                {t('landing.waitingNow')}
              </span>
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              asChild 
              size="lg" 
              className="min-h-[48px] w-full gap-2 bg-primary px-8 text-lg hover:bg-primary/90 sm:w-auto"
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
              className="min-h-[48px] w-full gap-2 px-8 text-lg sm:w-auto"
            >
              <Link href={`/${locale}/dashboard`}>
                {t('navigation.admin')}
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div 
          className="mx-auto mt-16 grid max-w-4xl gap-6 md:mt-24 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FeatureCard 
            icon={<Clock className="h-8 w-8" />}
            title={locale === 'zh' ? '实时更新' : locale === 'es' ? 'Tiempo real' : 'Real-time'}
            description={locale === 'zh' ? '随时了解您的排队位置' : locale === 'es' ? 'Conoce tu posición al instante' : 'Know your position instantly'}
          />
          <FeatureCard 
            icon={<CheckCircle className="h-8 w-8" />}
            title={locale === 'zh' ? '即时通知' : locale === 'es' ? 'Notificaciones' : 'Notifications'}
            description={locale === 'zh' ? '轮到您时立即通知' : locale === 'es' ? 'Te avisamos cuando sea tu turno' : 'We notify you when it\'s your turn'}
          />
          <FeatureCard 
            icon={<Users className="h-8 w-8" />}
            title={locale === 'zh' ? '无需排队' : locale === 'es' ? 'Sin esperas' : 'No waiting'}
            description={locale === 'zh' ? '用手机取号，自由活动' : locale === 'es' ? 'Saca número y muévete libre' : 'Get your number and move freely'}
          />
        </motion.div>

        {/* Demo Banner */}
        <div className="mt-12 text-center">
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
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="mb-4 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
