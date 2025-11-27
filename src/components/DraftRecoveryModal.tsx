import React from 'react';
import { X, Clock, FileText } from 'lucide-react';
import { EnhancementOptions } from '../types';

interface Draft {
  id?: number;
  input: string;
  options: EnhancementOptions;
  timestamp: number;
}

interface DraftRecoveryModalProps {
  isOpen: boolean;
  drafts: Draft[];
  onRecover: (draft: Draft) => void;
  onDismiss: () => void;
}

export const DraftRecoveryModal: React.FC<DraftRecoveryModalProps> = ({
  isOpen,
  drafts,
  onRecover,
  onDismiss
}) => {
  if (!isOpen || drafts.length === 0) return null;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <div className="modal-content animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">Recover Draft</h2>
          </div>
          <button
            onClick={onDismiss}
            className="btn-ghost p-2"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-muted mb-4">
            We found {drafts.length} unsaved draft{drafts.length > 1 ? 's' : ''}. Would you like to recover one?
          </p>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {drafts.map((draft, index) => (
              <button
                key={draft.id || index}
                onClick={() => onRecover(draft)}
                className="w-full text-left p-3 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted" />
                    <span className="text-xs text-muted">{formatTime(draft.timestamp)}</span>
                  </div>
                  <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to recover
                  </span>
                </div>
                <p className="text-sm text-secondary line-clamp-2">
                  {draft.input.slice(0, 100)}{draft.input.length > 100 ? '...' : ''}
                </p>
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={onDismiss}
              className="btn-secondary flex-1"
            >
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};