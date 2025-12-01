/**
 * Filename: CommitHistory.tsx
 * Purpose: Display commit history with timeline and rollback
 * 
 * Key Components:
 * - Commit timeline with messages
 * - Rollback functionality
 * - Commit details view
 * - Author and timestamp info
 * 
 * Dependencies: versionControlStore, lucide-react
 */

import React, { useState } from 'react';
import { GitCommit, RotateCcw, User, Clock, MessageSquare } from 'lucide-react';
import { useVersionControlStore, Commit } from '../store/versionControlStore';

interface CommitHistoryProps {
  onRollback?: (content: string) => void;
}

export const CommitHistory: React.FC<CommitHistoryProps> = ({ onRollback }) => {
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const { currentBranch, getHistory, rollback } = useVersionControlStore();
  
  const commits = getHistory(currentBranch);

  const handleRollback = (commitId: string) => {
    const content = rollback(commitId);
    if (content && onRollback) {
      onRollback(content);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <GitCommit className="w-5 h-5" />
          Commit History
        </h3>
        <span className="text-sm text-slate-400">{commits.length} commits</span>
      </div>

      {commits.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          No commits yet. Make your first commit!
        </div>
      ) : (
        <div className="space-y-3">
          {commits.map((commit, idx) => (
            <div
              key={commit.id}
              className="relative pl-6 pb-3 border-l-2 border-slate-700 last:border-l-0"
            >
              <div
                className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${
                  idx === 0 ? 'bg-indigo-500' : 'bg-slate-600'
                } border-2 border-slate-800`}
              />
              
              <div
                className="bg-slate-700 rounded-lg p-3 hover:bg-slate-600 transition-colors cursor-pointer"
                onClick={() => setSelectedCommit(commit)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-100 mb-1">
                      {commit.message}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {commit.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(commit.timestamp)}
                      </span>
                    </div>
                  </div>
                  {idx !== 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRollback(commit.id);
                      }}
                      className="p-1 hover:bg-indigo-900/30 text-indigo-400 rounded transition-colors"
                      title="Rollback to this commit"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {commit.id.substring(0, 12)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Commit Detail Modal */}
      {selectedCommit && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedCommit(null)}
        >
          <div
            className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Commit Details</h3>
              <button
                onClick={() => setSelectedCommit(null)}
                className="text-slate-400 hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                <div className="p-3 bg-slate-700 rounded-lg text-slate-100">
                  {selectedCommit.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Author</label>
                  <div className="p-3 bg-slate-700 rounded-lg text-slate-100">
                    {selectedCommit.author}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Timestamp</label>
                  <div className="p-3 bg-slate-700 rounded-lg text-slate-100">
                    {new Date(selectedCommit.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Commit ID</label>
                <div className="p-3 bg-slate-700 rounded-lg text-slate-100 font-mono text-sm">
                  {selectedCommit.id}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Content</label>
                <div className="p-3 bg-slate-700 rounded-lg text-slate-100 text-sm max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{selectedCommit.content}</pre>
                </div>
              </div>

              <button
                onClick={() => {
                  handleRollback(selectedCommit.id);
                  setSelectedCommit(null);
                }}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Rollback to this commit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
