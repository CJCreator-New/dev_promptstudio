import React, { useState } from 'react';
import { Clock, Play, Save, Copy, ChevronLeft, ChevronRight, GitBranch } from 'lucide-react';
import { HistoryItem } from '../types';
import { trackEvent } from '../utils/analytics';

interface RecentPromptsRailProps {
  history: HistoryItem[];
  onRerun: (item: HistoryItem) => void;
  onSaveAsTemplate: (item: HistoryItem) => void;
  onDuplicate: (item: HistoryItem) => void;
  onViewVersions?: (item: HistoryItem) => void;
}

export const RecentPromptsRail: React.FC<RecentPromptsRailProps> = ({
  history,
  onRerun,
  onSaveAsTemplate,
  onDuplicate,
  onViewVersions
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const recentPrompts = history.slice(0, 10);

  const handleAction = (action: string, item: HistoryItem) => {
    trackEvent('rail_action', { action, prompt_id: item.id });
    
    if (action === 'rerun') onRerun(item);
    else if (action === 'save') onSaveAsTemplate(item);
    else if (action === 'duplicate') onDuplicate(item);
    else if (action === 'versions' && onViewVersions) onViewVersions(item);
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-elevated border border-border rounded-l-lg p-2 hover:bg-overlay transition-colors z-40 shadow-md"
        aria-label="Expand recent prompts"
      >
        <ChevronLeft className="w-5 h-5 text-muted" />
      </button>
    );
  }

  return (
    <div className="w-80 bg-elevated border-l border-border flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted" />
          <h3 className="font-semibold text-foreground text-sm">Recent Prompts</h3>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-overlay rounded transition-colors"
          aria-label="Collapse rail"
        >
          <ChevronRight className="w-4 h-4 text-muted" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {recentPrompts.length === 0 ? (
          <div className="p-4 text-center text-muted text-sm">
            Your recent prompts will appear here
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {recentPrompts.map((item) => (
              <div
                key={item.id}
                className="bg-background border border-border rounded-lg p-3 hover:border-border-strong hover:shadow-sm transition-all group"
              >
                <div className="text-xs text-muted mb-2">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
                <div className="text-sm text-foreground line-clamp-2 mb-3">
                  {item.original}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleAction('rerun', item)}
                    className="flex items-center gap-1 px-2 py-1 bg-elevated hover:bg-overlay text-foreground text-xs rounded transition-colors"
                    title="Rerun"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleAction('save', item)}
                    className="flex items-center gap-1 px-2 py-1 bg-elevated hover:bg-overlay text-foreground text-xs rounded transition-colors"
                    title="Save as Template"
                  >
                    <Save className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleAction('duplicate', item)}
                    className="flex items-center gap-1 px-2 py-1 bg-elevated hover:bg-overlay text-foreground text-xs rounded transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {onViewVersions && (
                    <button
                      onClick={() => handleAction('versions', item)}
                      className="flex items-center gap-1 px-2 py-1 bg-elevated hover:bg-overlay text-foreground text-xs rounded transition-colors"
                      title="Version History"
                    >
                      <GitBranch className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
