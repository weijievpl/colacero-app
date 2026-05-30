/**
 * ColaCero - Application Constants
 */

import type { BusinessInfo, Locale } from './types';

// Supported locales
export const LOCALES: Locale[] = ['es', 'en', 'zh', 'pt', 'fr'];
export const DEFAULT_LOCALE: Locale = 'es';

// Queue configuration
export const MAX_HISTORY_SIZE = 50;
export const SIMULATION_INTERVAL_MIN = 8000; // 8 seconds
export const SIMULATION_INTERVAL_MAX = 14000; // 14 seconds
export const POLLING_INTERVAL = 3000; // 3 seconds
export const MIN_SUBMIT_DELAY = 150; // ms for UX

// Default service time (4 minutes in ms)
export const DEFAULT_AVG_SERVICE_TIME_MS = 4 * 60 * 1000;

// Storage keys
export const STORAGE_KEYS = {
  locale: 'colacero-locale',
  theme: 'colacero-theme',
  ticket: (id: string) => `colacero-ticket-${id}`,
} as const;

// Business info (demo data)
export const BUSINESS_INFO: BusinessInfo = {
  name: 'Consultoría Martínez & Asociados',
  address: 'Calle Mayor 42, 28001 Madrid',
  phone: '+34 91 123 45 67',
  hours: {
    'Lunes – Viernes': '9:00 – 18:00',
    'Sábado': '10:00 – 14:00',
    'Domingo': 'Cerrado',
  },
  coordinates: {
    lat: 40.4168,
    lng: -3.7038,
  },
  description: 'Servicio integral de consultoría empresarial y jurídica.',
};

// Reason weights for simulation (more common = higher weight)
export const REASON_WEIGHTS = {
  information: 35,
  appointment: 25,
  payment: 20,
  pickup: 10,
  complaint: 5,
  other: 5,
} as const;

// Audio alert configuration
export const AUDIO_ALERT = {
  frequency1: 880,
  duration1: 0.1,
  frequency2: 1100,
  duration2: 0.15,
  gap: 0.05,
} as const;

// Vibration pattern
export const VIBRATION_PATTERN = [200, 100, 200];

// Animation durations
export const ANIMATION = {
  instant: 100,
  fast: 150,
  normal: 250,
  slow: 400,
  enter: 300,
  exit: 200,
} as const;
