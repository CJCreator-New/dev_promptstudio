import React from 'react';
import { X, ArrowLeftRight } from 'lucide-react';

interface VersionCompareProps {
  v1: string;
  v2: string;
  onClose: () => void;
}

export const VersionCompare: React.FC<VersionCompareProps> = ({ v1, v2, onClose }) => {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-800 border border-slate-600 rounded-xl w-full max-w-6xl max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Compare Versions</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 border-r border-slate-700 overflow-y-auto p-6">
            <h3 className="text-sm font-medium text-blue-400 mb-3">Version 1</h3>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{v1}</pre>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-medium text-green-400 mb-3">Version 2</h3>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{v2}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
