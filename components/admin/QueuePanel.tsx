'use client';
// Required: Uses Zustand store and Framer Motion

import { AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketRow } from './TicketRow';
import { useQueueStore, selectTickets } from '@/lib/store/queueStore';
import type { TicketReason } from '@/lib/types';

interface QueuePanelProps {
  labels: {
    title: string;
    empty: string;
    emptySub: string;
    anonymous: string;
    cancel: string;
    reasons: Record<TicketReason, string>;
  };
  locale: string;
}

export function QueuePanel({ labels, locale }: QueuePanelProps) {
  const tickets = useQueueStore(selectTickets);
  const cancelTicket = useQueueStore((s) => s.cancelTicket);
  
  const waitingTickets = tickets
    .filter((t) => t.status === 'waiting')
    .sort((a, b) => a.number - b.number);

  return (
    <Card className="flex-1 overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          {labels.title}
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-sm font-normal text-primary">
            {waitingTickets.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {waitingTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">{labels.empty}</p>
            <p className="text-sm text-muted-foreground/70">{labels.emptySub}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {waitingTickets.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  onCancel={cancelTicket}
                  labels={{
                    anonymous: labels.anonymous,
                    cancel: labels.cancel,
                    reasons: labels.reasons,
                  }}
                  locale={locale}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
