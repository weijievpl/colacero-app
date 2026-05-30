import type { Ticket, TicketReason } from '../types';
import { MAX_HISTORY_SIZE } from '../constants';

/**
 * Filters and sorts history tickets
 * @param tickets - Array of tickets
 * @param reason - Optional reason filter
 * @returns Filtered and sorted tickets
 */
export function filterHistory(
  tickets: Ticket[],
  reason?: TicketReason
): Ticket[] {
  let filtered = tickets.filter((t) => t.status === 'served');
  
  if (reason) {
    filtered = filtered.filter((t) => t.reason === reason);
  }
  
  // Sort by servedAt descending (most recent first)
  return filtered
    .sort((a, b) => {
      const dateA = a.servedAt ? new Date(a.servedAt).getTime() : 0;
      const dateB = b.servedAt ? new Date(b.servedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, MAX_HISTORY_SIZE);
}

/**
 * Exports history to CSV format
 * @param tickets - Array of tickets
 * @returns CSV string
 */
export function exportHistoryToCsv(tickets: Ticket[]): string {
  const headers = ['id', 'number', 'name', 'reason', 'joinedAt', 'servedAt', 'waitMinutes'];
  const rows = tickets.map((ticket) => {
    const waitMs = ticket.servedAt 
      ? new Date(ticket.servedAt).getTime() - new Date(ticket.joinedAt).getTime()
      : 0;
    const waitMinutes = Math.round(waitMs / 60000);
    
    return [
      ticket.id,
      ticket.number,
      ticket.name || '',
      ticket.reason || '',
      new Date(ticket.joinedAt).toISOString(),
      ticket.servedAt ? new Date(ticket.servedAt).toISOString() : '',
      waitMinutes,
    ].join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
}
