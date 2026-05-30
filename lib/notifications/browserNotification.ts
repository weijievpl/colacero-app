/**
 * Browser notification utilities with safe fallbacks
 */

/**
 * Checks if browser notifications are supported
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Gets current notification permission
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Requests notification permission
 * @returns Permission state after request
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

/**
 * Sends a browser notification
 * @param title - Notification title
 * @param options - Notification options
 */
export function sendNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!isNotificationSupported()) return null;
  if (Notification.permission !== 'granted') return null;
  
  try {
    return new Notification(title, {
      icon: '/assets/images/colacero-logo.png',
      badge: '/assets/images/colacero-logo.png',
      ...options,
    });
  } catch {
    return null;
  }
}
