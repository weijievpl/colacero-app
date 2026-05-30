'use client';
// Required: Uses client-side state

import { Clock } from 'lucide-react';

interface WaitEstimateProps {
  minutes: number;
  label: string;
  valueLabel: string;
}

export function WaitEstimate({ minutes, label, valueLabel }: WaitEstimateProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
      <div className="flex items-center gap-3">
        <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="text-lg font-semibold text-foreground">
        {valueLabel}
      </span>
    </div>
  );
}
