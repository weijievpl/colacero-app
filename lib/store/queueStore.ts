'use client';
// Required: Zustand uses React hooks internally

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QueueStore, Ticket, JoinFormData } from '../types';
import { generateTicketId } from '../queue/generateTicketId';
import { calculatePosition, getWaitingCount } from '../queue/calculatePosition';
import { estimateWait, calculateAvgServiceTime } from '../queue/estimateWait';
import { applyServiceAction, getNextTicket } from '../queue/applyServiceAction';
import { generateInitialQueue, generateInitialHistory } from '../utils/generateMockData';
import { DEFAULT_AVG_SERVICE_TIME_MS, MAX_HISTORY_SIZE } from '../constants';

const initialState = {
  tickets: [] as Ticket[],
  history: [] as Ticket[],
  currentNumber: 0,
  nextNumber: 1,
  status: 'active' as const,
  avgServiceTimeMs: DEFAULT_AVG_SERVICE_TIME_MS,
  isPaused: false,
  simulationActive: true,
  lastActivity: new Date(),
  hasUserInteracted: false,
};

export const useQueueStore = create<QueueStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      joinQueue: (data: JoinFormData): Ticket => {
        const state = get();
        const position = getWaitingCount(state.tickets) + 1;
        const estimatedWaitMs = estimateWait(position, state.avgServiceTimeMs);
        
        const ticket: Ticket = {
          id: generateTicketId(),
          number: state.nextNumber,
          name: data.name,
          reason: data.reason,
          phone: data.phone,
          status: 'waiting',
          joinedAt: new Date(),
          estimatedWaitMs,
          position,
          isSimulated: false,
        };

        set((s) => ({
          tickets: [...s.tickets, ticket],
          nextNumber: s.nextNumber + 1,
          lastActivity: new Date(),
          status: 'active',
        }));

        return ticket;
      },

      serveNext: (): Ticket | null => {
        const state = get();
        const nextTicket = getNextTicket(state.tickets);
        
        if (!nextTicket) return null;

        const servedTicket = applyServiceAction(nextTicket, 'serve');

        set((s) => ({
          tickets: s.tickets.filter((t) => t.id !== nextTicket.id),
          history: [servedTicket, ...s.history].slice(0, MAX_HISTORY_SIZE),
          currentNumber: servedTicket.number,
          lastActivity: new Date(),
        }));

        // Recalculate positions for remaining tickets
        get().updatePositions();

        return servedTicket;
      },

      pauseQueue: () => {
        set({ isPaused: true, status: 'paused' });
      },

      resumeQueue: () => {
        const state = get();
        const hasWaiting = state.tickets.some((t) => t.status === 'waiting');
        set({ 
          isPaused: false, 
          status: hasWaiting ? 'active' : 'empty' 
        });
      },

      cancelTicket: (ticketId: string) => {
        set((s) => ({
          tickets: s.tickets.filter((t) => t.id !== ticketId),
          lastActivity: new Date(),
        }));
        get().updatePositions();
      },

      clearQueue: () => {
        set((s) => ({
          tickets: [],
          status: s.isPaused ? 'paused' : 'empty',
          lastActivity: new Date(),
        }));
      },

      addSimulatedTicket: () => {
        const state = get();
        if (state.isPaused || !state.simulationActive) return;

        // Use simulation helper internally
        const position = getWaitingCount(state.tickets) + 1;
        const names = ['María', 'Carlos', 'Ana', 'José', 'Laura', 'Miguel'];
        const reasons = ['information', 'appointment', 'payment', 'pickup', 'other'] as const;

        const ticket: Ticket = {
          id: generateTicketId(),
          number: state.nextNumber,
          name: names[Math.floor(Math.random() * names.length)],
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          status: 'waiting',
          joinedAt: new Date(),
          estimatedWaitMs: estimateWait(position, state.avgServiceTimeMs),
          position,
          isSimulated: true,
        };

        set((s) => ({
          tickets: [...s.tickets, ticket],
          nextNumber: s.nextNumber + 1,
          status: 'active',
          lastActivity: new Date(),
        }));
      },

      toggleSimulation: () => {
        set((s) => ({ simulationActive: !s.simulationActive }));
      },

      updateAvgServiceTime: () => {
        const state = get();
        const serviceTimes = state.history
          .filter((t) => t.servedAt && t.joinedAt)
          .map((t) => new Date(t.servedAt!).getTime() - new Date(t.joinedAt).getTime());
        
        const avgTime = calculateAvgServiceTime(serviceTimes);
        set({ avgServiceTimeMs: avgTime });
      },

      getTicketById: (ticketId: string): Ticket | undefined => {
        const state = get();
        return state.tickets.find((t) => t.id === ticketId) ||
               state.history.find((t) => t.id === ticketId);
      },

      setUserInteracted: () => {
        set({ hasUserInteracted: true });
      },

      initializeWithMockData: () => {
        const queueCount = 5 + Math.floor(Math.random() * 4); // 5-8 tickets
        const historyCount = 12 + Math.floor(Math.random() * 7); // 12-18 tickets
        
        const history = generateInitialHistory(historyCount, historyCount, 'es');
        const queue = generateInitialQueue(queueCount, historyCount + 1, 'es');
        
        set({
          tickets: queue,
          history,
          currentNumber: historyCount,
          nextNumber: historyCount + queueCount + 1,
          status: 'active',
          avgServiceTimeMs: DEFAULT_AVG_SERVICE_TIME_MS,
          isPaused: false,
          simulationActive: true,
          lastActivity: new Date(),
        });
      },

      // Internal helper to update positions
      updatePositions: () => {
        set((s) => ({
          tickets: s.tickets.map((ticket) => ({
            ...ticket,
            position: calculatePosition(s.tickets, ticket.number),
            estimatedWaitMs: estimateWait(
              calculatePosition(s.tickets, ticket.number),
              s.avgServiceTimeMs
            ),
          })),
        }));
      },
    }),
    {
      name: 'colacero-queue',
      partialize: (state) => ({
        // Only persist essential data
        currentNumber: state.currentNumber,
        nextNumber: state.nextNumber,
        simulationActive: state.simulationActive,
      }),
    }
  )
);

// Selectors for atomic access
export const selectTickets = (state: QueueStore) => state.tickets;
export const selectHistory = (state: QueueStore) => state.history;
export const selectCurrentNumber = (state: QueueStore) => state.currentNumber;
export const selectIsPaused = (state: QueueStore) => state.isPaused;
export const selectSimulationActive = (state: QueueStore) => state.simulationActive;
export const selectWaitingCount = (state: QueueStore) => 
  state.tickets.filter((t) => t.status === 'waiting').length;
export const selectServedTodayCount = (state: QueueStore) => state.history.length;
