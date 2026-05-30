/**
 * Audio alert using Web Audio API
 * No external audio files needed - generates tones programmatically
 */

import { AUDIO_ALERT } from '../constants';

let audioContext: AudioContext | null = null;

/**
 * Gets or creates the AudioContext
 * Must be called after user interaction due to autoplay policy
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContext;
  } catch {
    return null;
  }
}

/**
 * Plays a tone at the specified frequency
 * @param ctx - AudioContext
 * @param frequency - Frequency in Hz
 * @param duration - Duration in seconds
 * @param startTime - When to start playing
 */
function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  startTime: number
): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  // Smooth envelope to avoid clicks
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
  
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

/**
 * Plays the alert sound sequence
 * Sequence: 880Hz (0.1s) → silence (0.05s) → 1100Hz (0.15s)
 * @param hasUserInteracted - Whether user has interacted (required for autoplay)
 * @returns true if sound played, false otherwise
 */
export function playAlertSound(hasUserInteracted: boolean): boolean {
  if (!hasUserInteracted) return false;
  
  const ctx = getAudioContext();
  if (!ctx) return false;
  
  try {
    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const now = ctx.currentTime;
    const { frequency1, duration1, frequency2, duration2, gap } = AUDIO_ALERT;
    
    // First tone
    playTone(ctx, frequency1, duration1, now);
    
    // Second tone after gap
    playTone(ctx, frequency2, duration2, now + duration1 + gap);
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Cleanup audio context
 */
export function cleanupAudioContext(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}
