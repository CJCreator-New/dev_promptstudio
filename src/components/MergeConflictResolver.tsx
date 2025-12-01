/**
 * Filename: MergeConflictResolver.tsx
 * Purpose: UI for resolving merge conflicts between branches
 * 
 * Key Components:
 * - Side-by-side conflict view
 * - Accept current/incoming/both options
 * - Manual edit capability
 * - Conflict navigation
 * 
 * Dependencies: versionControlStore, lucide-react
 */

import React, { useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { MergeConflict } from '../store/versionControlStore';

interface MergeConflictResolverProps {
  conflicts: MergeConflict[];
  onResolve: (resolved: string) => void;
  onCancel: () => void;
}

export const MergeConflictResolver: React.FC<MergeConflictResolverProps> = ({
  conflicts,
  onResolve,
  onCancel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resolutions, setResolutions] = useState<string[]>(
    conflicts.map(c => c.current)
  );

  const currentConflict = conflicts[currentIndex];

  const handleAcceptCurrent = () => {
    const newResolutions = [...resolutions];
    newResolutions[currentIndex] = currentConflict.current;
    setResolutions(newResolutions);
    if (currentIndex < conflicts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleAcceptIncoming = () => {
    const newResolutions = [...resolutions];
    newResolutions[currentIndex] = currentConflict.incoming;
    setResolutions(newResolutions);
    if (currentIndex < conflicts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleAcceptBoth = () => {
    const newResolutions = [...resolutions];
    newResolutions[currentIndex] = `${currentConflict.current}\n\n${currentConflict.incoming}`;
    setResolutions(newResolutions);
    if (currentIndex < conflicts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = () => {
    const resolved = resolutions.join('\n');
    onResolve(resolved);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-xl font-semibold text-slate-100">Resolve Merge Conflicts</h3>
                <p className="text-sm text-slate-400">
                  Conflict {currentIndex + 1} of {conflicts.length}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Current Version */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-300">Current (Target)</h4>
                <button
                  onClick={handleAcceptCurrent}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition-colors"
                >
                  Accept Current
                </button>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg border border-green-500/30 h-64 overflow-y-auto">
                <pre className="text-sm text-slate-100 whitespace-pre-wrap">
                  {currentConflict.current}
                </pre>
              </div>
            </div>

            {/* Incoming Version */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-300">Incoming (Source)</h4>
                <button
                  onClick={handleAcceptIncoming}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
                >
                  Accept Incoming
                </button>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg border border-blue-500/30 h-64 overflow-y-auto">
                <pre className="text-sm text-slate-100 whitespace-pre-wrap">
                  {currentConflict.incoming}
                </pre>
              </div>
            </div>
          </div>

          {/* Accept Both Option */}
          <div className="mb-6">
            <button
              onClick={handleAcceptBoth}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Accept Both (Merge)
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-300 rounded-lg transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {conflicts.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentIndex ? 'bg-indigo-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentIndex(Math.min(conflicts.length - 1, currentIndex + 1))}
              disabled={currentIndex === conflicts.length - 1}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-300 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
          >
            Cancel Merge
          </button>
          <button
            onClick={handleFinish}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Complete Merge
          </button>
        </div>
      </div>
    </div>
  );
};
