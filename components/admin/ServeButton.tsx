'use client';
// Required: Uses Framer Motion for tap animation

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueueStore, selectWaitingCount } from '@/lib/store/queueStore';

interface ServeButtonProps {
  label: string;
}

export function ServeButton({ label }: ServeButtonProps) {
  const serveNext = useQueueStore((s) => s.serveNext);
  const waitingCount = useQueueStore(selectWaitingCount);
  const isPaused = useQueueStore((s) => s.isPaused);
  
  const isDisabled = waitingCount === 0 || isPaused;

  const handleServe = () => {
    serveNext();
  };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
    >
      <Button
        onClick={handleServe}
        disabled={isDisabled}
        className="min-h-[48px] w-full gap-2 bg-green-600 text-lg hover:bg-green-700 disabled:bg-muted"
        size="lg"
      >
        {label}
        <ArrowRight className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}
