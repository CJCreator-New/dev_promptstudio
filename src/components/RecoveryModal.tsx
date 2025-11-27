import React from 'react';
import { RotateCcw, Trash2, Clock } from 'lucide-react';
import { Draft } from '../utils/db';

interface RecoveryModalProps {
  draft: Draft;
  onRestore: () => void;
  onDiscard: () => void;
}

export const RecoveryModal: React.FC<RecoveryModalProps> = ({ draft, onRestore, onDiscard }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <RotateCcw className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Restore Session?</h2>
            <p className="text-xs text-slate-400">We found unsaved work from your last visit.</p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2">
            <Clock className="w-3 h-3" />
            {new Date(draft.timestamp).toLocaleString()}
          </div>
          <p className="text-sm text-slate-300 line-clamp-3 font-medium">
            {draft.input}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDiscard}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Discard
          </button>
          <button
            onClick={onRestore}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
          >
            <RotateCcw className="w-4 h-4" />
            Restore
          </button>
        </div>
      </div>
    </div>
  );
};