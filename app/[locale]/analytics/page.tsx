'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, Users, CheckCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TopBar } from '@/components/shared/TopBar';
import { useQueueStore, selectHistory, selectWaitingCount, selectServedTodayCount } from '@/lib/store/queueStore';
import { msToMinutes } from '@/lib/queue/estimateWait';
import { buildPeakData, findPeakHour, formatHour } from '@/lib/queue/buildPeakData';

export default function AnalyticsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';
  const t = useTranslations();
  
  const history = useQueueStore(selectHistory);
  const waitingCount = useQueueStore(selectWaitingCount);
  const servedTodayCount = useQueueStore(selectServedTodayCount);
  const avgServiceTimeMs = useQueueStore((s) => s.avgServiceTimeMs);
  
  const avgMinutes = msToMinutes(avgServiceTimeMs);
  const peakData = buildPeakData(history);
  const peakHour = findPeakHour(peakData);
  
  // Generate narrative insights
  const [narrative, setNarrative] = useState<string[]>([]);
  
  useEffect(() => {
    const insights: string[] = [];
    
    if (servedTodayCount > 0) {
      if (avgMinutes < 5) {
        insights.push(locale === 'zh' ? `⚡ 平均服务时间仅 ${avgMinutes} 分钟，效率极高！` : locale === 'es' ? `⚡ Tiempo medio de ${avgMinutes} min, ¡excelente eficiencia!` : `⚡ Average service time is only ${avgMinutes} min, excellent efficiency!`);
      } else if (avgMinutes > 15) {
        insights.push(locale === 'zh' ? `⏱️ 平均等待 ${avgMinutes} 分钟，考虑增加服务窗口` : locale === 'es' ? `⏱️ Espera media de ${avgMinutes} min, considera más ventanillas` : `⏱️ Average wait is ${avgMinutes} min, consider adding service points`);
      }
    }
    
    if (servedTodayCount > 20) {
      insights.push(locale === 'zh' ? `🎉 今日已服务 ${servedTodayCount} 位客户，忙碌的一天！` : locale === 'es' ? `🎉 ${servedTodayCount} clientes atendidos hoy, ¡día ocupado!` : `🎉 ${servedTodayCount} customers served today, busy day!`);
    } else if (servedTodayCount > 0 && servedTodayCount < 5) {
      insights.push(locale === 'zh' ? `📊 今日目前服务了 ${servedTodayCount} 位客户` : locale === 'es' ? `📊 ${servedTodayCount} clientes atendidos hasta ahora` : `📊 ${servedTodayCount} customers served so far today`);
    }
    
    if (peakHour >= 0) {
      insights.push(locale === 'zh' ? `📈 高峰时段通常在 ${formatHour(peakHour, 'full')} 左右` : locale === 'es' ? `📈 La hora pico suele ser alrededor de las ${formatHour(peakHour, 'full')}` : `📈 Peak hour is usually around ${formatHour(peakHour, 'full')}`);
    }
    
    if (waitingCount === 0 && servedTodayCount > 0) {
      insights.push(locale === 'zh' ? `✅ 队列已清空！所有客户都已服务完毕` : locale === 'es' ? `✅ ¡Cola vacía! Todos los clientes han sido atendidos` : `✅ Queue cleared! All customers have been served`);
    } else if (waitingCount > 10) {
      insights.push(locale === 'zh' ? `⚠️ 当前有 ${waitingCount} 人排队，建议加快服务速度` : locale === 'es' ? `⚠️ ${waitingCount} personas en cola, acelera el servicio` : `⚠️ ${waitingCount} people waiting, consider speeding up service`);
    }
    
    if (insights.length === 0) {
      insights.push(locale === 'zh' ? '📋 开始服务客户后将显示分析洞察' : locale === 'es' ? '📋 Las analíticas aparecerán cuando comiences a atender clientes' : '📋 Analytics insights will appear once you start serving customers');
    }
    
    setNarrative(insights);
  }, [servedTodayCount, avgMinutes, peakHour, waitingCount, locale]);

  return (
    <div className="min-h-[100dvh] bg-background">
      <TopBar />
      
      <main className="px-4 pb-24 pt-4 md:container md:mx-auto md:px-4 md:pb-16 md:pt-6">
        <h1 className="mb-4 text-xl font-bold md:text-2xl">
          {locale === 'zh' ? '分析洞察' : locale === 'es' ? 'Analíticas' : 'Analytics'}
        </h1>

        {/* Narrative Insights */}
        <div className="mb-6 space-y-3">
          {narrative.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border/30 bg-card p-4 text-sm leading-relaxed shadow-sm"
            >
              {insight}
            </motion.div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label={locale === 'zh' ? '排队中' : locale === 'es' ? 'En cola' : 'Waiting'}
            value={waitingCount.toString()}
            color="text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300"
          />
          <StatCard
            icon={<CheckCircle className="h-5 w-5" />}
            label={locale === 'zh' ? '今日服务' : locale === 'es' ? 'Hoy' : 'Today'}
            value={servedTodayCount.toString()}
            color="text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-300"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label={locale === 'zh' ? '平均时长' : locale === 'es' ? 'Promedio' : 'Average'}
            value={`${avgMinutes}m`}
            color="text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300"
          />
          <StatCard
            icon={<Calendar className="h-5 w-5" />}
            label={locale === 'zh' ? '高峰时段' : locale === 'es' ? 'Hora pico' : 'Peak'}
            value={peakHour >= 0 ? formatHour(peakHour, 'short') : '--'}
            color="text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300"
          />
        </div>

        {/* Hourly Distribution Chart (simple bar chart) */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold md:text-base">
              {locale === 'zh' ? '每小时服务分布' : locale === 'es' ? 'Distribución horaria' : 'Hourly Distribution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {peakData.length > 0 ? (
              <div className="flex items-end gap-1 h-32">
                {peakData.slice(0, 24).map((d, i) => {
                  const maxCount = Math.max(...peakData.map(p => p.count), 1);
                  const height = (d.count / maxCount) * 100;
                  const isPeak = d.hour === peakHour;
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.03, duration: 0.5 }}
                        className={`w-full rounded-t-sm ${isPeak ? 'bg-primary' : 'bg-muted-foreground/20'}`}
                        style={{ minHeight: d.count > 0 ? 4 : 0 }}
                      />
                      <span className="text-[8px] text-muted-foreground">{d.hour}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                {locale === 'zh' ? '暂无数据' : locale === 'es' ? 'Sin datos' : 'No data yet'}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 ${color}`}>
      {icon}
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs font-medium opacity-80">{label}</span>
    </div>
  );
}
