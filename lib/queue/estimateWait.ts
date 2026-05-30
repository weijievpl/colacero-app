import { DEFAULT_AVG_SERVICE_TIME_MS } from '../constants';

/**
 * Estimates wait time in milliseconds based on position and average service time
 * @param position - Position in queue (1-based)
 * @param avgServiceTimeMs - Average service time in milliseconds
 * @returns Estimated wait time in milliseconds
 */
export function estimateWait(
  position: number,
  avgServiceTimeMs: number = DEFAULT_AVG_SERVICE_TIME_MS
): number {
  if (position <= 0) return 0;
  // Position 1 means you're next, so wait = 0
  // Position 2 means 1 person ahead, etc.
  return (position - 1) * avgServiceTimeMs;
}

/**
 * Converts milliseconds to minutes (rounded)
 * @param ms - Time in milliseconds
 * @returns Time in minutes
 */
export function msToMinutes(ms: number): number {
  return Math.round(ms / 60000);
}

/**
 * Calculates average service time from history
 * @param serviceTimes - Array of service durations in ms
 * @returns Average service time in ms
 */
export function calculateAvgServiceTime(serviceTimes: number[]): number {
  if (serviceTimes.length === 0) return DEFAULT_AVG_SERVICE_TIME_MS;
  const sum = serviceTimes.reduce((acc, time) => acc + time, 0);
  return Math.round(sum / serviceTimes.length);
}
