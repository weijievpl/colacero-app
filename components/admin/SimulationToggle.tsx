'use client';
// Required: Uses Zustand store and client-side effects

import { useEffect, useRef } from 'react';
import { Zap, ZapOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useQueueStore, selectSimulationActive, selectIsPaused } from '@/lib/store/queueStore';
import { SIMULATION_INTERVAL_MIN, SIMULATION_INTERVAL_MAX } from '@/lib/constants';

interface SimulationToggleProps {
  label: string;
  onLabel: string;
  offLabel: string;
}

export function SimulationToggle({ label, onLabel, offLabel }: SimulationToggleProps) {
  const simulationActive = useQueueStore(selectSimulationActive);
  const isPaused = useQueueStore(selectIsPaused);
  const toggleSimulation = useQueueStore((s) => s.toggleSimulation);
  const addSimulatedTicket = useQueueStore((s) => s.addSimulatedTicket);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Run simulation
  useEffect(() => {
    if (simulationActive && !isPaused) {
      const scheduleNext = () => {
        const delay = SIMULATION_INTERVAL_MIN + Math.random() * (SIMULATION_INTERVAL_MAX - SIMULATION_INTERVAL_MIN);
        intervalRef.current = setTimeout(() => {
          addSimulatedTicket();
          scheduleNext();
        }, delay);
      };
      
      scheduleNext();
    }
    
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [simulationActive, isPaused, addSimulatedTicket]);

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4">
      <div className="flex items-center gap-3">
        {simulationActive ? (
          <Zap className="h-5 w-5 text-yellow-500" />
        ) : (
          <ZapOff className="h-5 w-5 text-muted-foreground" />
        )}
        <div>
          <Label htmlFor="simulation-toggle" className="cursor-pointer font-medium">
            {label}
          </Label>
          <p className="text-sm text-muted-foreground">
            {simulationActive ? onLabel : offLabel}
          </p>
        </div>
      </div>
      <Switch
        id="simulation-toggle"
        checked={simulationActive}
        onCheckedChange={toggleSimulation}
      />
    </div>
  );
}
