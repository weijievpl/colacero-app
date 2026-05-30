import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Noto_Sans_SC } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import { BottomNav } from '@/components/shared/BottomNav';
import { LOCALES } from '@/lib/constants';
import '../globals.css';

// Import all locale messages statically for export compatibility
import esMessages from '../../messages/es.json';
import enMessages from '../../messages/en.json';
import zhMessages from '../../messages/zh.json';
import ptMessages from '../../messages/pt.json';
import frMessages from '../../messages/fr.json';

const messagesMap: Record<string, any> = {
  es: esMessages,
  en: enMessages,
  zh: zhMessages,
  pt: ptMessages,
  fr: frMessages,
};

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cjk',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
};

export const metadata: Metadata = {
  title: 'ColaCero - La cola que no se nota',
  description: 'Sistema de gestión de colas en tiempo real.',
  icons: {
    icon: '/assets/images/colacero-logo.png',
    apple: '/assets/images/colacero-logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ColaCero',
  },
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const messages = messagesMap[locale] || messagesMap['es'];
  
  const fontClasses = `${inter.variable} ${jetbrainsMono.variable} ${locale === 'zh' ? notoSansSC.variable : ''}`;

  return (
    <html lang={locale} suppressHydrationWarning className="bg-background">
      <body className={`${fontClasses} font-sans antialiased min-h-[100dvh]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="colacero-theme"
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <BottomNav locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
