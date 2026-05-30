'use client';
// Required: Uses client-side navigation and dropdown state

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LOCALES } from '@/lib/constants';
import type { Locale } from '@/lib/types';

const LOCALE_LABELS: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  zh: '中文',
  pt: 'Português',
  fr: 'Français',
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as Locale) || 'es';

  const handleLocaleChange = (newLocale: Locale) => {
    // Replace the locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('colacero-locale', newLocale);
    }
    
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={currentLocale === locale ? 'bg-accent' : ''}
            aria-selected={currentLocale === locale}
          >
            {LOCALE_LABELS[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
