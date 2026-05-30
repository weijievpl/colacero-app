import type { Ticket, TicketStatus } from '../types';

export type ServiceAction = 'serve' | 'cancel';

/**
 * Applies a service action to a ticket
 * @param ticket - The ticket to modify
 * @param action - The action to apply
 * @returns Updated ticket (new object, not mutated)
 */
export function applyServiceAction(
  ticket: Ticket,
  action: ServiceAction
): Ticket {
  const now = new Date();
  
  switch (action) {
    case 'serve':
      return {
        ...ticket,
        status: 'served' as TicketStatus,
        servedAt: now,
      };
    case 'cancel':
      return {
        ...ticket,
        status: 'cancelled' as TicketStatus,
      };
    default:
      return ticket;
  }
}

/**
 * Gets the next ticket to serve from the queue
 * @param tickets - Array of all tickets
 * @returns The next waiting ticket or null
 */
export function getNextTicket(tickets: Ticket[]): Ticket | null {
  const waiting = tickets
    .filter((t) => t.status === 'waiting')
    .sort((a, b) => a.number - b.number);
  
  return waiting[0] || null;
}
