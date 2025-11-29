import React, { useState, useEffect } from 'react';
import { Clock, GitBranch, Eye, X } from 'lucide-react';
import { db, Version } from '../utils/db';
import { HistoryItem } from '../types';

interface VersionTimelineProps {
  item: HistoryItem;
  onClose: () => void;
  onCompare: (v1: string, v2: string) => void;
}

export const VersionTimeline: React.FC<VersionTimelineProps> = ({ item, onClose, onCompare }) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    loadVersions();
  }, [item.id]);

  const loadVersions = async () => {
    const promptId = parseInt(item.id.replace(/\D/g, '')) || Date.now();
    const v = await db.versions.where('promptId').equals(promptId).reverse().sortBy('timestamp');
    setVersions(v);
  };

  const saveVersion = async (message: string) => {
    const promptId = parseInt(item.id.replace(/\D/g, '')) || Date.now();
    await db.versions.add({
      promptId,
      content: item.enhanced,
      timestamp: Date.now(),
      message
    });
    loadVersions();
  };

  const handleSelect = (content: string) => {
    if (selected.includes(content)) {
      setSelected(selected.filter(s => s !== content));
    } else if (selected.length < 2) {
      setSelected([...selected, content]);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-800 border border-slate-600 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Version History</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-400">Current Version</span>
              <button
                onClick={() => {
                  const msg = prompt('Version message:');
                  if (msg) saveVersion(msg);
                }}
                className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded"
              >
                Save Version
              </button>
            </div>
            <p className="text-sm text-slate-300 line-clamp-3">{item.enhanced}</p>
          </div>

          {versions.map((v, i) => (
            <div
              key={v.id}
              className={`bg-slate-700 border rounded-lg p-4 cursor-pointer transition-colors ${
                selected.includes(v.content) ? 'border-blue-500' : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => handleSelect(v.content)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">{new Date(v.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-xs font-medium text-slate-300 mb-1">{v.message}</p>
              <p className="text-sm text-slate-400 line-clamp-2">{v.content}</p>
            </div>
          ))}
        </div>

        {selected.length === 2 && (
          <div className="px-6 py-4 border-t border-slate-700 flex justify-end">
            <button
              onClick={() => onCompare(selected[0], selected[1])}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg"
            >
              <Eye className="w-4 h-4" />
              Compare Versions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
