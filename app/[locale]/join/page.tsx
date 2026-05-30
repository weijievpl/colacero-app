import { useTranslations } from 'next-intl';
import { TopBar } from '@/components/shared/TopBar';
import { JoinForm } from '@/components/customer/JoinForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function JoinPage() {
  const t = useTranslations('join');

  return (
    <div className="min-h-[100dvh] bg-background">
      <TopBar />
      
      <main className="px-4 pb-24 pt-4 md:container md:mx-auto md:px-4 md:pb-16 md:pt-16">
        <Card className="mx-auto max-w-md border-border/50 bg-card/80 backdrop-blur md:border md:shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold md:text-2xl">{t('title')}</CardTitle>
            <CardDescription className="text-sm md:text-base">{t('subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <JoinForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
