'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Ticket, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '', icon: Home, label: 'home' },
  { href: '/join', icon: Ticket, label: 'join' },
  { href: '/dashboard', icon: BarChart3, label: 'admin' },
];

export function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === '') return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(fullPath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom,0px)] md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <button
              key={item.label}
              onClick={() => router.push(`/${locale}${item.href}`)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full min-w-[64px] transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className={cn('size-6 transition-transform', active && 'scale-110')} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
