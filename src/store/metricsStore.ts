import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MetricEntry {
  id: string;
  agentId: string;
  taskId: string;
  timestamp: number;
  success: boolean;
  duration: number;
  tokens: number;
  cost: number;
  qualityScore?: number;
  errorMessage?: string;
}

export interface AgentMetrics {
  agentId: string;
  totalTasks: number;
  successfulTasks: number;
  failedTasks: number;
  successRate: number;
  avgDuration: number;
  avgTokens: number;
  totalCost: number;
  avgQualityScore: number;
  lastActive: number;
}

interface MetricsState {
  entries: MetricEntry[];
  
  addEntry: (entry: Omit<MetricEntry, 'id'>) => void;
  getAgentMetrics: (agentId: string) => AgentMetrics;
  getAllMetrics: () => AgentMetrics[];
  getEntriesByAgent: (agentId: string) => MetricEntry[];
  getEntriesByDateRange: (start: number, end: number) => MetricEntry[];
  clearMetrics: () => void;
}

export const useMetricsStore = create<MetricsState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: MetricEntry = {
          ...entry,
          id: `metric_${Date.now()}_${Math.random()}`,
        };
        set((state) => ({ entries: [...state.entries, newEntry] }));
      },

      getAgentMetrics: (agentId) => {
        const entries = get().entries.filter((e) => e.agentId === agentId);
        
        if (entries.length === 0) {
          return {
            agentId,
            totalTasks: 0,
            successfulTasks: 0,
            failedTasks: 0,
            successRate: 0,
            avgDuration: 0,
            avgTokens: 0,
            totalCost: 0,
            avgQualityScore: 0,
            lastActive: 0,
          };
        }

        const successful = entries.filter((e) => e.success);
        const failed = entries.filter((e) => !e.success);
        const withQuality = entries.filter((e) => e.qualityScore !== undefined);

        return {
          agentId,
          totalTasks: entries.length,
          successfulTasks: successful.length,
          failedTasks: failed.length,
          successRate: (successful.length / entries.length) * 100,
          avgDuration: entries.reduce((sum, e) => sum + e.duration, 0) / entries.length,
          avgTokens: entries.reduce((sum, e) => sum + e.tokens, 0) / entries.length,
          totalCost: entries.reduce((sum, e) => sum + e.cost, 0),
          avgQualityScore: withQuality.length > 0
            ? withQuality.reduce((sum, e) => sum + (e.qualityScore || 0), 0) / withQuality.length
            : 0,
          lastActive: Math.max(...entries.map((e) => e.timestamp)),
        };
      },

      getAllMetrics: () => {
        const agentIds = [...new Set(get().entries.map((e) => e.agentId))];
        return agentIds.map((id) => get().getAgentMetrics(id));
      },

      getEntriesByAgent: (agentId) => {
        return get().entries.filter((e) => e.agentId === agentId);
      },

      getEntriesByDateRange: (start, end) => {
        return get().entries.filter((e) => e.timestamp >= start && e.timestamp <= end);
      },

      clearMetrics: () => set({ entries: [] }),
    }),
    {
      name: 'metrics-storage',
      version: 1,
    }
  )
);
