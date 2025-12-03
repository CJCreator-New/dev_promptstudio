import React from 'react';
import { useFreeModels } from '../hooks/useFreeModels';
import { Sparkles } from 'lucide-react';

export const FreeModelsPanel: React.FC<{ onSelectModel: (modelId: string) => void }> = ({ onSelectModel }) => {
  const { models, lastSynced } = useFreeModels();

  if (models.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-green-400" />
        <h3 className="text-sm font-semibold text-slate-200">Free Models Today</h3>
        <span className="text-xs text-slate-500">({models.length})</span>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelectModel(model.id)}
            className="w-full text-left p-2 rounded bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-200 truncate">{model.name}</div>
                <div className="text-xs text-slate-400 truncate">{model.id}</div>
              </div>
              <div className="text-xs text-slate-500 ml-2">
                {(model.contextLength / 1000).toFixed(0)}K
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {lastSynced && (
        <div className="text-xs text-slate-500 mt-2">
          Updated: {new Date(lastSynced).toLocaleString()}
        </div>
      )}
    </div>
  );
};
