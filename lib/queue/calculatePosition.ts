import type { Ticket } from '../types';

/**
 * Calculates the position of a ticket in the queue
 * @param tickets - Array of all waiting tickets
 * @param ticketNumber - The ticket number to find
 * @returns Position (1-based) or -1 if not found
 */
export function calculatePosition(tickets: Ticket[], ticketNumber: number): number {
  const waitingTickets = tickets
    .filter((t) => t.status === 'waiting')
    .sort((a, b) => a.number - b.number);
  
  const index = waitingTickets.findIndex((t) => t.number === ticketNumber);
  return index === -1 ? -1 : index + 1;
}

/**
 * Gets the total count of waiting tickets
 * @param tickets - Array of all tickets
 * @returns Number of waiting tickets
 */
export function getWaitingCount(tickets: Ticket[]): number {
  return tickets.filter((t) => t.status === 'waiting').length;
}
