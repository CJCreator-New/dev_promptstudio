import React, { useState } from 'react';
import { useMetricsStore } from '../store/metricsStore';
import { useAgentStore } from '../store/agentStore';
import { calculateTrend, compareAgents } from '../services/metricsCollector';

export const AgentMetrics: React.FC = () => {
  const { getAllMetrics, getEntriesByAgent } = useMetricsStore();
  const { agents } = useAgentStore();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>('week');

  const allMetrics = getAllMetrics();
  const rankings = compareAgents(agents.map((a) => a.id));

  const getTimeRangeMs = () => {
    const now = Date.now();
    switch (timeRange) {
      case 'day': return now - 24 * 60 * 60 * 1000;
      case 'week': return now - 7 * 24 * 60 * 60 * 1000;
      case 'month': return now - 30 * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  };

  const selectedMetrics = selectedAgent
    ? getEntriesByAgent(selectedAgent).filter((e) => e.timestamp >= getTimeRangeMs())
    : [];

  const successTrend = calculateTrend(
    selectedMetrics.map((e) => (e.success ? 100 : 0))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Agent Performance Metrics</h1>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {range === 'all' ? 'All Time' : `Last ${range}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <h2 className="font-semibold mb-3">Agent Leaderboard</h2>
          <div className="space-y-2">
            {rankings.map((ranking) => {
              const agent = agents.find((a) => a.id === ranking.agentId);
              const metrics = allMetrics.find((m) => m.agentId === ranking.agentId);
              if (!agent || !metrics) return null;

              return (
                <div
                  key={ranking.agentId}
                  onClick={() => setSelectedAgent(ranking.agentId)}
                  className={`p-4 bg-white border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                    selectedAgent === ranking.agentId ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        ranking.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                        ranking.rank === 2 ? 'bg-gray-100 text-gray-700' :
                        ranking.rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        #{ranking.rank}
                      </div>
                      <div>
                        <div className="font-semibold">{agent.name}</div>
                        <div className="text-xs text-gray-600">{agent.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{metrics.successRate.toFixed(0)}%</div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Tasks</div>
                      <div className="font-semibold">{metrics.totalTasks}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Avg Time</div>
                      <div className="font-semibold">{(metrics.avgDuration / 1000).toFixed(1)}s</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Cost</div>
                      <div className="font-semibold">${metrics.totalCost.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Quality</div>
                      <div className="font-semibold">{metrics.avgQualityScore.toFixed(1)}/10</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Summary Stats</h2>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold text-blue-700">
                {allMetrics.reduce((sum, m) => sum + m.totalTasks, 0)}
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Avg Success Rate</div>
              <div className="text-2xl font-bold text-green-700">
                {allMetrics.length > 0
                  ? (allMetrics.reduce((sum, m) => sum + m.successRate, 0) / allMetrics.length).toFixed(0)
                  : 0}%
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">Total Cost</div>
              <div className="text-2xl font-bold text-purple-700">
                ${allMetrics.reduce((sum, m) => sum + m.totalCost, 0).toFixed(2)}
              </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-sm text-orange-600 mb-1">Active Agents</div>
              <div className="text-2xl font-bold text-orange-700">
                {allMetrics.filter((m) => m.totalTasks > 0).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedAgent && selectedMetrics.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Detailed Performance</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Trend:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                successTrend === 'up' ? 'bg-green-100 text-green-700' :
                successTrend === 'down' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {successTrend === 'up' ? '↗ Improving' : successTrend === 'down' ? '↘ Declining' : '→ Stable'}
              </span>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedMetrics.slice(-20).reverse().map((entry) => (
              <div key={entry.id} className={`p-3 rounded border ${
                entry.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    entry.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {entry.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Duration:</span> {(entry.duration / 1000).toFixed(1)}s
                  </div>
                  <div>
                    <span className="text-gray-600">Tokens:</span> {entry.tokens}
                  </div>
                  <div>
                    <span className="text-gray-600">Cost:</span> ${entry.cost.toFixed(4)}
                  </div>
                  {entry.qualityScore && (
                    <div>
                      <span className="text-gray-600">Quality:</span> {entry.qualityScore.toFixed(1)}/10
                    </div>
                  )}
                </div>
                {entry.errorMessage && (
                  <div className="mt-2 text-xs text-red-600">{entry.errorMessage}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
