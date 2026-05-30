/**
 * ColaCero - Core Type Definitions
 * All shared types for the queue management system
 */

// Ticket status enum
export type TicketStatus = 'waiting' | 'serving' | 'served' | 'cancelled';

// Ticket reason enum
export type TicketReason = 
  | 'information' 
  | 'appointment' 
  | 'complaint' 
  | 'payment' 
  | 'pickup' 
  | 'other';

// Queue status enum
export type QueueStatus = 'active' | 'paused' | 'closed' | 'empty';

// Supported locales
export type Locale = 'es' | 'en' | 'zh' | 'pt' | 'fr';

// Core Ticket interface
export interface Ticket {
  id: string;
  number: number;
  name?: string;
  reason?: TicketReason;
  phone?: string;
  status: TicketStatus;
  joinedAt: Date;
  servedAt?: Date;
  estimatedWaitMs: number;
  position: number;
  isSimulated: boolean;
}

// Form data for joining queue
export interface JoinFormData {
  name?: string;
  reason?: TicketReason;
  phone?: string;
}

// Business location info
export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  hours: Record<string, string>;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
}

// Peak hour data for charts
export interface PeakHourData {
  hour: number;
  count: number;
}

// Stats for dashboard
export interface QueueStats {
  waiting: number;
  servedToday: number;
  avgTimeMinutes: number;
  peakHour: number;
}

// Queue store state
export interface QueueState {
  tickets: Ticket[];
  history: Ticket[];
  currentNumber: number;
  nextNumber: number;
  status: QueueStatus;
  avgServiceTimeMs: number;
  isPaused: boolean;
  simulationActive: boolean;
  lastActivity: Date;
  hasUserInteracted: boolean;
}

// Queue store actions
export interface QueueActions {
  joinQueue: (data: JoinFormData) => Ticket;
  serveNext: () => Ticket | null;
  pauseQueue: () => void;
  resumeQueue: () => void;
  cancelTicket: (ticketId: string) => void;
  clearQueue: () => void;
  addSimulatedTicket: () => void;
  toggleSimulation: () => void;
  updateAvgServiceTime: () => void;
  getTicketById: (ticketId: string) => Ticket | undefined;
  setUserInteracted: () => void;
  initializeWithMockData: () => void;
}

// Combined store type
export type QueueStore = QueueState & QueueActions;

// Notification permission state
export type NotificationPermission = 'default' | 'granted' | 'denied';
