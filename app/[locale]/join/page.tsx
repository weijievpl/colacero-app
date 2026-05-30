import { useTranslations } from 'next-intl';
import { TopBar } from '@/components/shared/TopBar';
import { JoinForm } from '@/components/customer/JoinForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function JoinPage() {
  const t = useTranslations('join');

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <Card className="mx-auto max-w-md border-border/50 bg-card/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
            <CardDescription className="text-base">{t('subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <JoinForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
