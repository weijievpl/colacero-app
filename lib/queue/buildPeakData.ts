import type { Ticket, PeakHourData } from '../types';

/**
 * Builds peak hour data from ticket history
 * @param tickets - Array of served tickets
 * @returns Array of 24 PeakHourData objects (one per hour)
 */
export function buildPeakData(tickets: Ticket[]): PeakHourData[] {
  // Initialize all 24 hours with 0
  const hourCounts = new Array(24).fill(0);
  
  // Count tickets by hour they were served
  tickets
    .filter((t) => t.status === 'served' && t.servedAt)
    .forEach((ticket) => {
      const hour = new Date(ticket.servedAt!).getHours();
      hourCounts[hour]++;
    });
  
  return hourCounts.map((count, hour) => ({
    hour,
    count,
  }));
}

/**
 * Finds the peak hour from peak data
 * @param peakData - Array of PeakHourData
 * @returns The hour with the most activity
 */
export function findPeakHour(peakData: PeakHourData[]): number {
  if (peakData.length === 0) return 10; // Default to 10 AM
  
  let maxCount = 0;
  let peakHour = 10;
  
  peakData.forEach(({ hour, count }) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hour;
    }
  });
  
  return peakHour;
}

/**
 * Formats hour for display (e.g., "10:00" or "10h")
 * @param hour - Hour (0-23)
 * @param format - Format type
 * @returns Formatted hour string
 */
export function formatHour(hour: number, format: 'short' | 'full' = 'short'): string {
  if (format === 'full') {
    return `${hour.toString().padStart(2, '0')}:00`;
  }
  return `${hour}h`;
}
