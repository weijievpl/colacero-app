'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FABProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function FAB({ icon, onClick, label, variant = 'primary', className }: FABProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={label}
      className={cn(
        'fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg md:hidden',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground'
          : 'bg-card text-foreground border border-border',
        className
      )}
    >
      {icon}
    </motion.button>
  );
}
