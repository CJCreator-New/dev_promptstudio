import { useMetricsStore } from '../store/metricsStore';

export class MetricsCollector {
  private startTime: number = 0;
  private agentId: string;
  private taskId: string;

  constructor(agentId: string, taskId: string) {
    this.agentId = agentId;
    this.taskId = taskId;
  }

  start(): void {
    this.startTime = Date.now();
  }

  end(success: boolean, tokens: number, cost: number, qualityScore?: number, errorMessage?: string): void {
    const duration = Date.now() - this.startTime;
    
    useMetricsStore.getState().addEntry({
      agentId: this.agentId,
      taskId: this.taskId,
      timestamp: Date.now(),
      success,
      duration,
      tokens,
      cost,
      qualityScore,
      errorMessage,
    });
  }
}

export function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  
  const recent = values.slice(-5);
  const older = values.slice(-10, -5);
  
  if (older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  
  const diff = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'stable';
}

export function compareAgents(agentIds: string[]): Array<{
  agentId: string;
  rank: number;
  score: number;
}> {
  const { getAgentMetrics } = useMetricsStore.getState();
  
  const scores = agentIds.map((id) => {
    const metrics = getAgentMetrics(id);
    const score = 
      metrics.successRate * 0.4 +
      (metrics.avgQualityScore / 10) * 0.3 +
      (1 / (metrics.avgDuration / 1000)) * 0.2 +
      (1 / (metrics.totalCost + 1)) * 0.1;
    
    return { agentId: id, score };
  });
  
  scores.sort((a, b) => b.score - a.score);
  
  return scores.map((s, i) => ({ ...s, rank: i + 1 }));
}
