import React, { useState } from 'react';
import { Clock, Play, Save, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { HistoryItem } from '../types';
import { trackEvent } from '../utils/analytics';

interface RecentPromptsRailProps {
  history: HistoryItem[];
  onRerun: (item: HistoryItem) => void;
  onSaveAsTemplate: (item: HistoryItem) => void;
  onDuplicate: (item: HistoryItem) => void;
}

export const RecentPromptsRail: React.FC<RecentPromptsRailProps> = ({
  history,
  onRerun,
  onSaveAsTemplate,
  onDuplicate
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const recentPrompts = history.slice(0, 10);

  const handleAction = (action: string, item: HistoryItem) => {
    trackEvent('rail_action', { action, prompt_id: item.id });
    
    if (action === 'rerun') onRerun(item);
    else if (action === 'save') onSaveAsTemplate(item);
    else if (action === 'duplicate') onDuplicate(item);
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 rounded-l-lg p-2 hover:bg-slate-700 transition-colors z-40"
        aria-label="Expand recent prompts"
      >
        <ChevronLeft className="w-5 h-5 text-slate-400" />
      </button>
    );
  }

  return (
    <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Recent Prompts</h3>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
          aria-label="Collapse rail"
        >
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {recentPrompts.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm">
            Your recent prompts will appear here
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {recentPrompts.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-colors group"
              >
                <div className="text-xs text-slate-400 mb-2">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
                <div className="text-sm text-slate-300 line-clamp-2 mb-3">
                  {item.original}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction('rerun', item)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors"
                    title="Rerun"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleAction('save', item)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors"
                    title="Save as Template"
                  >
                    <Save className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleAction('duplicate', item)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
