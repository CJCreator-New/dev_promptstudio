import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnalyticsData {
  period: string;
  totalFeedback: number;
  avgRating: number;
  byCategory: Record<string, number>;
  trend: number;
}

interface FeedbackAnalyticsProps {
  data: AnalyticsData[];
  className?: string;
}

export const FeedbackAnalytics: React.FC<FeedbackAnalyticsProps> = ({ data, className = '' }) => {
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const ratingTrend = latest && previous ? latest.avgRating - previous.avgRating : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Trend Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-elevated border border-border rounded-lg">
          <div className="text-sm text-muted mb-1">Total Feedback</div>
          <div className="text-3xl font-bold mb-2">{latest?.totalFeedback || 0}</div>
          <div className={`flex items-center gap-1 text-sm ${
            (latest?.trend || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {(latest?.trend || 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(latest?.trend || 0)}% from last period</span>
          </div>
        </div>

        <div className="p-6 bg-elevated border border-border rounded-lg">
          <div className="text-sm text-muted mb-1">Average Rating</div>
          <div className="text-3xl font-bold mb-2">{latest?.avgRating.toFixed(1) || '0.0'}</div>
          <div className={`flex items-center gap-1 text-sm ${
            ratingTrend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {ratingTrend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(ratingTrend).toFixed(1)} from last period</span>
          </div>
        </div>

        <div className="p-6 bg-elevated border border-border rounded-lg">
          <div className="text-sm text-muted mb-1">Top Category</div>
          <div className="text-3xl font-bold mb-2">
            {latest && Object.entries(latest.byCategory).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
          </div>
          <div className="text-sm text-muted">
            {latest && Object.entries(latest.byCategory).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} submissions
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="p-6 bg-elevated border border-border rounded-lg">
        <h3 className="font-semibold mb-4">Feedback Over Time</h3>
        <div className="h-64 flex items-end gap-2">
          {data.map((item, idx) => {
            const maxValue = Math.max(...data.map(d => d.totalFeedback));
            const height = (item.totalFeedback / maxValue) * 100;
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-accent-primary rounded-t hover:bg-accent-primary-hover transition-all cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`${item.totalFeedback} feedback`}
                />
                <div className="text-xs text-muted">{item.period}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="p-6 bg-elevated border border-border rounded-lg">
        <h3 className="font-semibold mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {latest && Object.entries(latest.byCategory).map(([category, count]) => {
            const percentage = (count / latest.totalFeedback) * 100;
            return (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{category}</span>
                  <span className="text-muted">{count} ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
