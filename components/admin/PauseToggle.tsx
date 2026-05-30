'use client';
// Required: Uses Zustand store for state

import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueueStore, selectIsPaused } from '@/lib/store/queueStore';

interface PauseToggleProps {
  pauseLabel: string;
  resumeLabel: string;
}

export function PauseToggle({ pauseLabel, resumeLabel }: PauseToggleProps) {
  const isPaused = useQueueStore(selectIsPaused);
  const pauseQueue = useQueueStore((s) => s.pauseQueue);
  const resumeQueue = useQueueStore((s) => s.resumeQueue);

  const handleToggle = () => {
    if (isPaused) {
      resumeQueue();
    } else {
      pauseQueue();
    }
  };

  return (
    <Button
      onClick={handleToggle}
      variant={isPaused ? 'default' : 'outline'}
      className={`min-h-[48px] gap-2 ${isPaused ? 'bg-green-600 hover:bg-green-700' : ''}`}
    >
      {isPaused ? (
        <>
          <Play className="h-4 w-4" />
          {resumeLabel}
        </>
      ) : (
        <>
          <Pause className="h-4 w-4" />
          {pauseLabel}
        </>
      )}
    </Button>
  );
}
