'use client';
// Required: Uses Framer Motion for animations

import { motion } from 'framer-motion';

interface PositionTrackerProps {
  position: number;
  total: number;
  label: string;
  valueLabel: string;
}

export function PositionTracker({ position, total, label, valueLabel }: PositionTrackerProps) {
  const progress = total > 0 ? ((total - position + 1) / total) * 100 : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{valueLabel}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>
    </div>
  );
}
