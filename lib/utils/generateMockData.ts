import type { Ticket, TicketReason, Locale, PeakHourData } from '../types';
import { generateTicketId } from '../queue/generateTicketId';
import { getRandomName } from '../simulation/fakeNames';
import { REASON_WEIGHTS } from '../constants';

/**
 * Gets a weighted random reason
 */
function getWeightedReason(): TicketReason {
  const entries = Object.entries(REASON_WEIGHTS) as [TicketReason, number][];
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let random = Math.random() * total;
  
  for (const [reason, weight] of entries) {
    random -= weight;
    if (random <= 0) return reason;
  }
  
  return 'information';
}

/**
 * Generates initial waiting tickets
 * @param count - Number of tickets to generate
 * @param startNumber - Starting ticket number
 * @param locale - Locale for names
 * @returns Array of tickets
 */
export function generateInitialQueue(
  count: number,
  startNumber: number,
  locale: Locale = 'es'
): Ticket[] {
  const tickets: Ticket[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const joinedAt = new Date(now.getTime() - Math.random() * 30 * 60 * 1000); // Last 30 minutes
    tickets.push({
      id: generateTicketId(),
      number: startNumber + i,
      name: Math.random() > 0.3 ? getRandomName(locale) : undefined, // 70% have names
      reason: Math.random() > 0.2 ? getWeightedReason() : undefined, // 80% have reasons
      status: 'waiting',
      joinedAt,
      estimatedWaitMs: (i + 1) * 4 * 60 * 1000, // 4 min per person
      position: i + 1,
      isSimulated: true,
    });
  }
  
  return tickets;
}

/**
 * Generates initial history (served tickets)
 * @param count - Number of tickets to generate
 * @param endNumber - Ending ticket number (most recent)
 * @param locale - Locale for names
 * @returns Array of served tickets
 */
export function generateInitialHistory(
  count: number,
  endNumber: number,
  locale: Locale = 'es'
): Ticket[] {
  const tickets: Ticket[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Distribute over the last 4 hours with peaks at 10h and 12h
    const hoursAgo = Math.random() * 4;
    const joinedAt = new Date(now.getTime() - (hoursAgo + 0.1) * 60 * 60 * 1000);
    const serviceTime = (2 + Math.random() * 6) * 60 * 1000; // 2-8 minutes
    const servedAt = new Date(joinedAt.getTime() + serviceTime);
    
    tickets.push({
      id: generateTicketId(),
      number: endNumber - count + i + 1,
      name: Math.random() > 0.25 ? getRandomName(locale) : undefined,
      reason: Math.random() > 0.15 ? getWeightedReason() : undefined,
      status: 'served',
      joinedAt,
      servedAt,
      estimatedWaitMs: 0,
      position: 0,
      isSimulated: true,
    });
  }
  
  return tickets;
}

/**
 * Generates realistic peak hour data
 * @returns Array of 24 PeakHourData objects
 */
export function generatePeakData(): PeakHourData[] {
  // Realistic distribution: peaks at 10-11h and 16-17h, low at night
  const basePattern = [
    0, 0, 0, 0, 0, 0,  // 0-5h: closed
    2, 5, 8, 15, 18, 14, // 6-11h: morning buildup to peak
    16, 12, 10, 13, 17, 14, // 12-17h: afternoon with second peak
    8, 4, 2, 1, 0, 0  // 18-23h: evening wind down
  ];
  
  return basePattern.map((base, hour) => ({
    hour,
    count: Math.max(0, base + Math.floor(Math.random() * 4) - 2), // Add variance
  }));
}
