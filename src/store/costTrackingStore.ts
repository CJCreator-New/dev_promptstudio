/**
 * Filename: costTrackingStore.ts
 * Purpose: Track token usage and costs across AI providers
 * 
 * Key Functions:
 * - trackUsage: Record API call with tokens and cost
 * - getStats: Calculate usage statistics
 * - getBudgetStatus: Check budget alerts
 * - exportData: Export usage data
 * 
 * Dependencies: zustand, pricingData
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateCost, getModelPricing } from '../utils/pricingData';

export interface UsageRecord {
  id: string;
  timestamp: number;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  promptId?: string;
  testSuiteId?: string;
}

export interface BudgetAlert {
  id: string;
  threshold: number;
  period: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
}

export interface UsageStats {
  totalCost: number;
  totalTokens: number;
  totalRequests: number;
  avgCostPerRequest: number;
  byProvider: Record<string, { cost: number; tokens: number; requests: number }>;
  byModel: Record<string, { cost: number; tokens: number; requests: number }>;
  trend: { date: string; cost: number; tokens: number }[];
}

interface CostTrackingStore {
  records: UsageRecord[];
  budgetAlerts: BudgetAlert[];
  monthlyBudget: number;
  
  trackUsage: (
    provider: string,
    model: string,
    inputTokens: number,
    outputTokens: number,
    metadata?: { promptId?: string; testSuiteId?: string }
  ) => void;
  
  getStats: (startDate?: number, endDate?: number) => UsageStats;
  getMonthlySpending: () => number;
  getBudgetStatus: () => { spent: number; remaining: number; percentage: number };
  setMonthlyBudget: (amount: number) => void;
  addBudgetAlert: (alert: Omit<BudgetAlert, 'id'>) => void;
  removeBudgetAlert: (id: string) => void;
  clearRecords: (beforeDate?: number) => void;
  exportRecords: (format: 'csv' | 'json') => string;
}

export const useCostTrackingStore = create<CostTrackingStore>()(
  persist(
    (set, get) => ({
      records: [],
      budgetAlerts: [],
      monthlyBudget: 100,

      trackUsage: (provider, model, inputTokens, outputTokens, metadata = {}) => {
        const pricing = getModelPricing(provider, model);
        if (!pricing) return;

        const cost = calculateCost(inputTokens, outputTokens, pricing);
        const record: UsageRecord = {
          id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          provider,
          model,
          inputTokens,
          outputTokens,
          cost,
          ...metadata
        };

        set((state) => ({
          records: [...state.records, record]
        }));
      },

      getStats: (startDate = 0, endDate = Date.now()) => {
        const records = get().records.filter(
          r => r.timestamp >= startDate && r.timestamp <= endDate
        );

        const stats: UsageStats = {
          totalCost: 0,
          totalTokens: 0,
          totalRequests: records.length,
          avgCostPerRequest: 0,
          byProvider: {},
          byModel: {},
          trend: []
        };

        records.forEach(record => {
          stats.totalCost += record.cost;
          stats.totalTokens += record.inputTokens + record.outputTokens;

          // By provider
          if (!stats.byProvider[record.provider]) {
            stats.byProvider[record.provider] = { cost: 0, tokens: 0, requests: 0 };
          }
          stats.byProvider[record.provider].cost += record.cost;
          stats.byProvider[record.provider].tokens += record.inputTokens + record.outputTokens;
          stats.byProvider[record.provider].requests += 1;

          // By model
          if (!stats.byModel[record.model]) {
            stats.byModel[record.model] = { cost: 0, tokens: 0, requests: 0 };
          }
          stats.byModel[record.model].cost += record.cost;
          stats.byModel[record.model].tokens += record.inputTokens + record.outputTokens;
          stats.byModel[record.model].requests += 1;
        });

        stats.avgCostPerRequest = stats.totalRequests > 0 
          ? stats.totalCost / stats.totalRequests 
          : 0;

        // Calculate trend (daily aggregation)
        const dailyMap = new Map<string, { cost: number; tokens: number }>();
        records.forEach(record => {
          const date = new Date(record.timestamp).toISOString().split('T')[0];
          const existing = dailyMap.get(date) || { cost: 0, tokens: 0 };
          dailyMap.set(date, {
            cost: existing.cost + record.cost,
            tokens: existing.tokens + record.inputTokens + record.outputTokens
          });
        });

        stats.trend = Array.from(dailyMap.entries())
          .map(([date, data]) => ({ date, ...data }))
          .sort((a, b) => a.date.localeCompare(b.date));

        return stats;
      },

      getMonthlySpending: () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const stats = get().getStats(startOfMonth);
        return stats.totalCost;
      },

      getBudgetStatus: () => {
        const spent = get().getMonthlySpending();
        const budget = get().monthlyBudget;
        return {
          spent,
          remaining: Math.max(0, budget - spent),
          percentage: budget > 0 ? (spent / budget) * 100 : 0
        };
      },

      setMonthlyBudget: (amount) => set({ monthlyBudget: amount }),

      addBudgetAlert: (alert) => {
        const id = `alert_${Date.now()}`;
        set((state) => ({
          budgetAlerts: [...state.budgetAlerts, { ...alert, id }]
        }));
      },

      removeBudgetAlert: (id) => set((state) => ({
        budgetAlerts: state.budgetAlerts.filter(a => a.id !== id)
      })),

      clearRecords: (beforeDate) => set((state) => ({
        records: beforeDate 
          ? state.records.filter(r => r.timestamp >= beforeDate)
          : []
      })),

      exportRecords: (format) => {
        const records = get().records;
        
        if (format === 'json') {
          return JSON.stringify(records, null, 2);
        }
        
        // CSV format
        const headers = 'Timestamp,Provider,Model,Input Tokens,Output Tokens,Cost\n';
        const rows = records.map(r => 
          `${new Date(r.timestamp).toISOString()},${r.provider},${r.model},${r.inputTokens},${r.outputTokens},${r.cost.toFixed(6)}`
        ).join('\n');
        
        return headers + rows;
      }
    }),
    { name: 'cost-tracking-store' }
  )
);
