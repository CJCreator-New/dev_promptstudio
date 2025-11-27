import React from 'react';
import { Cloud, Check, Loader2, AlertCircle, RotateCcw } from 'lucide-react';

interface SaveStatusProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: number | null;
  retryCount?: number;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ status, lastSaved, retryCount = 0 }) => {
  if (status === 'idle' && !lastSaved) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'saving': return retryCount > 0 ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-slate-700/50 bg-slate-800/50';
      case 'saved': return 'border-green-500/50 bg-green-500/10';
      case 'error': return 'border-red-500/50 bg-red-500/10';
      default: return 'border-slate-700/50 bg-slate-800/50';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors min-w-[120px] h-7 ${getStatusColor()}`}>
      {status === 'saving' && (
        retryCount > 0 ? 
          <RotateCcw className="w-3 h-3 text-yellow-400 animate-spin" /> :
          <Loader2 className="w-3 h-3 text-primary animate-spin" />
      )}
      {status === 'saved' && <Check className="w-3 h-3 text-green-400" />}
      {status === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
      {status === 'idle' && <Cloud className="w-3 h-3 text-muted" />}

      <span className="text-[10px] font-medium text-slate-400">
        {status === 'saving' && (retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Saving...')}
        {status === 'error' && 'Save Failed'}
        {(status === 'saved' || status === 'idle') && lastSaved && (
          <>Saved {formatTimeAgo(lastSaved)}</>
        )}
      </span>
    </div>
  );
};