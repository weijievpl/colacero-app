'use client';
// Required: Uses client-side hooks for theme and locale switching

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  showLogo?: boolean;
  showNav?: boolean;
}

export function TopBar({ showLogo = true, showNav = false }: TopBarProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md pt-[env(safe-area-inset-top,0px)] md:border-b">
      <div className="flex h-14 items-center justify-between px-4 md:container md:mx-auto md:h-16 md:px-4">
        {/* Logo */}
        {showLogo && (
          <Link 
            href={`/${locale}`} 
            className="flex items-center gap-2"
            aria-label="ColaCero - Inicio"
          >
            <Image
              src="/assets/images/colacero-logo.png"
              alt="ColaCero"
              width={180}
              height={40}
              className="h-7 w-auto md:h-10"
              priority
            />
          </Link>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-1 md:gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
