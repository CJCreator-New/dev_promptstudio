import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Analytics {
  id: number;
  promptId: number;
  usageCount: number;
  successRate: number;
  avgResponseTime: number;
  lastUsed: number;
}

interface AnalyticsStore {
  analytics: Analytics[];
  trackUsage: (promptId: number, responseTime: number, success: boolean) => void;
  getAnalytics: (promptId: number) => Analytics | undefined;
  getAllAnalytics: () => Analytics[];
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      analytics: [],
      trackUsage: (promptId, responseTime, success) => set((state) => {
        const existing = state.analytics.find(a => a.promptId === promptId);
        if (existing) {
          const newUsageCount = existing.usageCount + 1;
          const newSuccessRate = ((existing.successRate * existing.usageCount) + (success ? 1 : 0)) / newUsageCount;
          const newAvgResponseTime = ((existing.avgResponseTime * existing.usageCount) + responseTime) / newUsageCount;
          return {
            analytics: state.analytics.map(a => 
              a.promptId === promptId 
                ? { ...a, usageCount: newUsageCount, successRate: newSuccessRate, avgResponseTime: newAvgResponseTime, lastUsed: Date.now() }
                : a
            )
          };
        }
        return {
          analytics: [...state.analytics, {
            id: Date.now(),
            promptId,
            usageCount: 1,
            successRate: success ? 1 : 0,
            avgResponseTime: responseTime,
            lastUsed: Date.now(),
          }]
        };
      }),
      getAnalytics: (promptId) => get().analytics.find(a => a.promptId === promptId),
      getAllAnalytics: () => get().analytics,
    }),
    { name: 'analytics-store' }
  )
);
