/**
 * Filename: CostDashboard.tsx
 * Purpose: Comprehensive cost tracking dashboard with charts and insights
 * 
 * Key Components:
 * - Budget overview with progress bar
 * - Usage statistics by provider/model
 * - Cost trend chart
 * - Cost comparison tool
 * - Export functionality
 * 
 * Dependencies: costTrackingStore, costCalculator, lucide-react
 */

import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Download, Settings, BarChart3 } from 'lucide-react';
import { useCostTrackingStore } from '../store/costTrackingStore';
import { compareCosts, optimizeCost } from '../services/costCalculator';

export const CostDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>('month');
  const { getStats, getBudgetStatus, monthlyBudget, setMonthlyBudget, exportRecords } = useCostTrackingStore();

  const dateRange = useMemo(() => {
    const now = Date.now();
    const ranges = {
      day: now - 24 * 60 * 60 * 1000,
      week: now - 7 * 24 * 60 * 60 * 1000,
      month: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(),
      all: 0
    };
    return ranges[timeRange];
  }, [timeRange]);

  const stats = useMemo(() => getStats(dateRange), [dateRange, getStats]);
  const budgetStatus = getBudgetStatus();
  const suggestions = optimizeCost(monthlyBudget, budgetStatus.spent);

  const handleExport = (format: 'csv' | 'json') => {
    const data = exportRecords(format);
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost-report-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Cost Dashboard</h2>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Monthly Budget</h3>
          <button className="text-slate-400 hover:text-slate-300">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-4">
            <div className="text-3xl font-bold text-slate-100">
              ${budgetStatus.spent.toFixed(2)}
            </div>
            <div className="text-sm text-slate-400">
              of ${monthlyBudget.toFixed(2)}
            </div>
          </div>

          <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                budgetStatus.percentage > 90 ? 'bg-red-500' :
                budgetStatus.percentage > 75 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">
              {budgetStatus.percentage.toFixed(1)}% used
            </span>
            <span className="text-slate-400">
              ${budgetStatus.remaining.toFixed(2)} remaining
            </span>
          </div>
        </div>

        {budgetStatus.percentage > 75 && (
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-400">
              Budget usage is high. Consider optimizing your prompts or switching to cheaper models.
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Total Cost"
          value={`$${stats.totalCost.toFixed(4)}`}
          color="green"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Total Tokens"
          value={stats.totalTokens.toLocaleString()}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Requests"
          value={stats.totalRequests.toLocaleString()}
          color="purple"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Avg/Request"
          value={`$${stats.avgCostPerRequest.toFixed(4)}`}
          color="indigo"
        />
      </div>

      {/* Provider Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">By Provider</h3>
          <div className="space-y-3">
            {Object.entries(stats.byProvider).map(([provider, data]) => (
              <ProviderBar
                key={provider}
                name={provider}
                cost={data.cost}
                percentage={(data.cost / stats.totalCost) * 100}
              />
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">By Model</h3>
          <div className="space-y-3">
            {Object.entries(stats.byModel)
              .sort(([, a], [, b]) => b.cost - a.cost)
              .slice(0, 5)
              .map(([model, data]) => (
                <ProviderBar
                  key={model}
                  name={model}
                  cost={data.cost}
                  percentage={(data.cost / stats.totalCost) * 100}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Cost Optimization</h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Export */}
      <div className="flex gap-2">
        <button
          onClick={() => handleExport('csv')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={() => handleExport('json')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = 
  ({ icon, label, value, color }) => (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className={`flex items-center gap-2 text-${color}-400 mb-2`}>
        {icon}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-slate-100">{value}</div>
    </div>
  );

const ProviderBar: React.FC<{ name: string; cost: number; percentage: number }> = 
  ({ name, cost, percentage }) => (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300 capitalize">{name}</span>
        <span className="text-slate-400">${cost.toFixed(4)}</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
