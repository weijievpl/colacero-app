'use client';
// Required: Uses Framer Motion for number animation

import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueueStore, selectCurrentNumber } from '@/lib/store/queueStore';

interface CurrentNumberDisplayProps {
  title: string;
  noTicketLabel: string;
}

export function CurrentNumberDisplay({ title, noTicketLabel }: CurrentNumberDisplayProps) {
  const currentNumber = useQueueStore(selectCurrentNumber);

  return (
    <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex items-center justify-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentNumber}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="font-mono text-5xl font-bold text-primary md:text-6xl"
            >
              {currentNumber > 0 ? currentNumber.toString().padStart(2, '0') : noTicketLabel}
            </motion.span>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
