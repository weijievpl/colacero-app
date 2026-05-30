'use client';
// Required: Uses dialog state

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useQueueStore, selectWaitingCount } from '@/lib/store/queueStore';

interface ClearQueueDialogProps {
  buttonLabel: string;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
}

export function ClearQueueDialog({
  buttonLabel,
  title,
  description,
  cancelLabel,
  confirmLabel,
}: ClearQueueDialogProps) {
  const clearQueue = useQueueStore((s) => s.clearQueue);
  const waitingCount = useQueueStore(selectWaitingCount);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="min-h-[48px] gap-2"
          disabled={waitingCount === 0}
        >
          <Trash2 className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={clearQueue} className="bg-destructive hover:bg-destructive/90">
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
