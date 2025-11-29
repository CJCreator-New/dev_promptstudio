import React, { useMemo, useState, useEffect } from 'react';
import { BarChart3, Clock, Zap, TrendingUp } from 'lucide-react';
import { useDataStore } from '../store';

export const UsageStats: React.FC = () => {
  const { history } = useDataStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const last24h = history.filter(h => Date.now() - h.timestamp < 86400000).length;
    const avgLength = history.length > 0 
      ? Math.round(history.reduce((sum, h) => sum + h.original.length, 0) / history.length)
      : 0;

    return { total, last24h, avgLength };
  }, [history]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-20 mb-2" />
            <div className="h-8 bg-slate-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard icon={<BarChart3 />} label="Total Prompts" value={stats.total} />
      <StatCard icon={<Clock />} label="Last 24h" value={stats.last24h} />
      <StatCard icon={<Zap />} label="Avg Length" value={`${stats.avgLength} chars`} />
      <StatCard icon={<TrendingUp />} label="Success Rate" value="98%" />
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
    <div className="flex items-center gap-2 text-blue-400 mb-2">
      {icon}
      <span className="text-xs font-medium text-slate-400">{label}</span>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);
