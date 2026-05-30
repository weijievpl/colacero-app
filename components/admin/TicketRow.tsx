'use client';
// Required: Uses Framer Motion for animations and client-side state

import { motion } from 'framer-motion';
import { X, Info, Calendar, AlertTriangle, CreditCard, Package, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Ticket, TicketReason } from '@/lib/types';
import { formatTimeAgo } from '@/lib/queue/formatDuration';

const REASON_ICONS: Record<TicketReason, React.ReactNode> = {
  information: <Info className="h-4 w-4" />,
  appointment: <Calendar className="h-4 w-4" />,
  complaint: <AlertTriangle className="h-4 w-4" />,
  payment: <CreditCard className="h-4 w-4" />,
  pickup: <Package className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
};

interface TicketRowProps {
  ticket: Ticket;
  onCancel: (id: string) => void;
  labels: {
    anonymous: string;
    cancel: string;
    reasons: Record<TicketReason, string>;
  };
  locale: string;
}

export function TicketRow({ ticket, onCancel, labels, locale }: TicketRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4"
    >
      {/* Ticket Number */}
      <Badge 
        variant="default" 
        className="min-w-[48px] justify-center bg-primary px-3 py-1 font-mono text-lg"
      >
        {ticket.number.toString().padStart(2, '0')}
      </Badge>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {ticket.name || labels.anonymous}
        </p>
        {ticket.reason && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {REASON_ICONS[ticket.reason]}
            <span>{labels.reasons[ticket.reason]}</span>
          </div>
        )}
      </div>

      {/* Wait Time */}
      <div className="text-right text-sm text-muted-foreground">
        {formatTimeAgo(new Date(ticket.joinedAt), locale)}
      </div>

      {/* Cancel Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onCancel(ticket.id)}
        aria-label={labels.cancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
