/**
 * Date formatting utilities using Intl API
 */

/**
 * Formats a date to time string (HH:mm)
 * @param date - Date to format
 * @param locale - Locale string
 * @returns Formatted time string
 */
export function formatTime(date: Date | string, locale: string = 'es'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Formats a date to full date string
 * @param date - Date to format
 * @param locale - Locale string
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: string = 'es'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Formats a date to short date string
 * @param date - Date to format
 * @param locale - Locale string
 * @returns Formatted short date string
 */
export function formatShortDate(date: Date | string, locale: string = 'es'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Formats a date to datetime string
 * @param date - Date to format
 * @param locale - Locale string
 * @returns Formatted datetime string
 */
export function formatDateTime(date: Date | string, locale: string = 'es'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
