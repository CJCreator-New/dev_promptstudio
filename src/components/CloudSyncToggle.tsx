import React, { useState } from 'react';
import { Cloud, CloudOff } from 'lucide-react';

interface CloudSyncToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const CloudSyncToggle: React.FC<CloudSyncToggleProps> = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
        enabled 
          ? 'bg-green-900/20 text-green-300 border border-green-500/30' 
          : 'bg-slate-700 text-slate-400 border border-slate-600'
      }`}
      title={enabled ? 'Cloud sync enabled' : 'Cloud sync disabled'}
    >
      {enabled ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
      <span className="hidden sm:inline">{enabled ? 'Synced' : 'Local only'}</span>
    </button>
  );
};