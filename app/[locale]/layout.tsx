import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Noto_Sans_SC } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme-provider';
import { LOCALES } from '@/lib/constants';
import '../globals.css';

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

export const metadata: Metadata = {
  title: 'ColaCero - La cola que no se nota',
  description: 'Sistema de gestión de colas en tiempo real. Obtén tu turno desde el móvil sin esperas.',
  icons: {
    icon: '/assets/images/colacero-logo.png',
    apple: '/assets/images/colacero-logo.png',
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
  const messages = await getMessages();
  
  // Add Chinese font class when locale is zh
  const fontClasses = `${inter.variable} ${jetbrainsMono.variable} ${locale === 'zh' ? notoSansSC.variable : ''}`;

  return (
    <html lang={locale} suppressHydrationWarning className="bg-background">
      <body className={`${fontClasses} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="colacero-theme"
        >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
