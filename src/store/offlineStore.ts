import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Operation {
  id: number;
  type: string;
  entity: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

interface OfflineStore {
  isOnline: boolean;
  operations: Operation[];
  setOnline: (online: boolean) => void;
  queueOperation: (op: Omit<Operation, 'id' | 'timestamp' | 'synced'>) => void;
  markSynced: (id: number) => void;
  getPendingOperations: () => Operation[];
}

export const useOfflineStore = create<OfflineStore>()(
  persist(
    (set, get) => ({
      isOnline: navigator.onLine,
      operations: [],
      setOnline: (online) => set({ isOnline: online }),
      queueOperation: (op) => set((state) => ({
        operations: [...state.operations, { ...op, id: Date.now(), timestamp: Date.now(), synced: false }]
      })),
      markSynced: (id) => set((state) => ({
        operations: state.operations.map(op => op.id === id ? { ...op, synced: true } : op)
      })),
      getPendingOperations: () => get().operations.filter(op => !op.synced),
    }),
    { name: 'offline-store' }
  )
);
