'use client';
// Required: Uses Framer Motion for modal animation and client-side effects

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playAlertSound } from '@/lib/notifications/audioAlert';
import { triggerVibration } from '@/lib/notifications/vibrationAlert';
import { sendNotification } from '@/lib/notifications/browserNotification';
import { useQueueStore } from '@/lib/store/queueStore';

interface TurnAlertProps {
  isOpen: boolean;
  onDismiss: () => void;
  title: string;
  subtitle: string;
  dismissLabel: string;
  ticketNumber: number;
  customerName?: string;
  notificationBody?: string;
}

export function TurnAlert({
  isOpen,
  onDismiss,
  title,
  subtitle,
  dismissLabel,
  ticketNumber,
  customerName,
  notificationBody,
}: TurnAlertProps) {
  const hasUserInteracted = useQueueStore((s) => s.hasUserInteracted);

  // Play alerts when modal opens
  useEffect(() => {
    if (isOpen) {
      // Play sound (requires prior user interaction)
      playAlertSound(hasUserInteracted);
      
      // Vibrate
      triggerVibration();
      
      // Send browser notification
      if (notificationBody) {
        sendNotification(title, {
          body: notificationBody,
          tag: 'turn-alert',
          requireInteraction: true,
        });
      }
    }
  }, [isOpen, hasUserInteracted, title, notificationBody]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alert"
          aria-modal="true"
          aria-labelledby="turn-alert-title"
        >
          <motion.div
            className="mx-4 w-full max-w-sm rounded-2xl bg-card p-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="flex flex-col items-center text-center">
              {/* Success Icon */}
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>

              {/* Ticket Number */}
              <span className="mb-4 font-mono text-5xl font-bold text-primary">
                {ticketNumber.toString().padStart(2, '0')}
              </span>

              {/* Title */}
              <h2 id="turn-alert-title" className="mb-2 text-2xl font-bold text-foreground">
                {title}
              </h2>

              {/* Subtitle */}
              <p className="mb-8 text-muted-foreground">
                {subtitle}
              </p>

              {/* Dismiss Button */}
              <Button
                onClick={onDismiss}
                className="min-h-[48px] w-full text-lg"
                autoFocus
              >
                {dismissLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
