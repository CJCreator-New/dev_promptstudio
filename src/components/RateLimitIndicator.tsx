import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

interface RateLimitIndicatorProps {
  used: number;
  limit: number;
  resetTime?: number;
}

export const RateLimitIndicator: React.FC<RateLimitIndicatorProps> = ({ used, limit, resetTime }) => {
  const percentage = (used / limit) * 100;
  const isWarning = percentage > 80;
  const isCritical = percentage > 95;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
      isCritical ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
      isWarning ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
      'bg-slate-800 text-slate-400 border border-slate-700'
    }`}>
      {isCritical ? (
        <AlertTriangle className="w-3.5 h-3.5" />
      ) : (
        <Activity className="w-3.5 h-3.5" />
      )}
      <span className="font-medium">
        {used}/{limit} requests
      </span>
      {resetTime && (
        <span className="text-slate-500">• Resets in {Math.ceil((resetTime - Date.now()) / 60000)}m</span>
      )}
    </div>
  );
};
