/**
 * Vibration API wrapper with safe fallback
 */

import { VIBRATION_PATTERN } from '../constants';

/**
 * Checks if Vibration API is supported
 */
export function isVibrationSupported(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Triggers vibration pattern
 * Pattern: [200ms vibrate, 100ms pause, 200ms vibrate]
 * @returns true if vibration triggered, false otherwise
 */
export function triggerVibration(): boolean {
  if (!isVibrationSupported()) return false;
  
  try {
    navigator.vibrate(VIBRATION_PATTERN);
    return true;
  } catch {
    return false;
  }
}

/**
 * Cancels any ongoing vibration
 */
export function cancelVibration(): void {
  if (isVibrationSupported()) {
    try {
      navigator.vibrate(0);
    } catch {
      // Silently fail
    }
  }
}
