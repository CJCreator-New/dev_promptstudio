import React from 'react';
import { Cloud, Check, Loader2, AlertCircle } from 'lucide-react';

interface SaveStatusProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: number | null;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ status, lastSaved }) => {
  if (status === 'idle' && !lastSaved) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50 transition-all">
      {status === 'saving' && <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />}
      {status === 'saved' && <Check className="w-3 h-3 text-green-400" />}
      {status === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
      {status === 'idle' && <Cloud className="w-3 h-3 text-slate-500" />}

      <span className="text-[10px] font-medium text-slate-400">
        {status === 'saving' && 'Saving...'}
        {status === 'error' && 'Save Failed'}
        {(status === 'saved' || status === 'idle') && lastSaved && (
          <>Saved {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
        )}
      </span>
    </div>
  );
};