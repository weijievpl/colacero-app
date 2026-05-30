'use client';
// Required: Client component for conditional rendering

import { PauseCircle, XCircle, CheckCircle } from 'lucide-react';

type Status = 'active' | 'paused' | 'closed';

interface ServiceStatusBannerProps {
  status: Status;
  activeLabel: string;
  pausedLabel: string;
  closedLabel: string;
  pausedMessage?: string;
}

export function ServiceStatusBanner({
  status,
  activeLabel,
  pausedLabel,
  closedLabel,
  pausedMessage,
}: ServiceStatusBannerProps) {
  const config = {
    active: {
      icon: CheckCircle,
      label: activeLabel,
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      dotClass: 'bg-green-500',
    },
    paused: {
      icon: PauseCircle,
      label: pausedLabel,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      dotClass: 'bg-yellow-500',
    },
    closed: {
      icon: XCircle,
      label: closedLabel,
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      dotClass: 'bg-red-500',
    },
  };

  const { icon: Icon, label, className, dotClass } = config[status];

  return (
    <div 
      className={`rounded-lg p-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden="true" />
        <Icon className="h-5 w-5" aria-hidden="true" />
        <span className="font-medium">{label}</span>
      </div>
      {status === 'paused' && pausedMessage && (
        <p className="mt-2 text-sm opacity-90">{pausedMessage}</p>
      )}
    </div>
  );
}
