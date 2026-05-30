/**
 * Formats a duration in milliseconds to a human-readable string
 * @param ms - Duration in milliseconds
 * @param locale - Locale for formatting
 * @returns Formatted duration string
 */
export function formatDuration(ms: number, locale: string = 'es'): string {
  const minutes = Math.round(ms / 60000);
  
  if (minutes < 1) {
    return locale === 'zh' ? '不到1分钟' : locale === 'es' ? '< 1 min' : '< 1 min';
  }
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  
  if (remainingMins === 0) {
    return locale === 'zh' 
      ? `${hours}小时` 
      : locale === 'es' 
        ? `${hours}h` 
        : `${hours}h`;
  }
  
  return locale === 'zh'
    ? `${hours}小时${remainingMins}分钟`
    : `${hours}h ${remainingMins}m`;
}

/**
 * Formats time elapsed since a date
 * @param date - The starting date
 * @param locale - Locale for formatting
 * @returns Formatted relative time string
 */
export function formatTimeAgo(date: Date, locale: string = 'es'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  
  if (minutes < 1) {
    return locale === 'zh' ? '刚刚' : locale === 'es' ? 'ahora' : 'just now';
  }
  
  if (minutes < 60) {
    return locale === 'zh' 
      ? `${minutes}分钟前` 
      : locale === 'es' 
        ? `hace ${minutes} min` 
        : `${minutes} min ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  return locale === 'zh'
    ? `${hours}小时前`
    : locale === 'es'
      ? `hace ${hours}h`
      : `${hours}h ago`;
}
