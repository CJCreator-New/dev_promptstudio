import React, { useState } from 'react';
import { X, Play, Plus, Trash2 } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface Variant {
  id: string;
  name: string;
  prompt: string;
  result?: string;
}

interface ABTestWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  basePrompt: string;
}

export const ABTestWorkspace: React.FC<ABTestWorkspaceProps> = ({ isOpen, onClose, basePrompt }) => {
  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', name: 'Variant A', prompt: basePrompt },
    { id: '2', name: 'Variant B', prompt: '' }
  ]);
  const [testInput, setTestInput] = useState('');

  const addVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), name: `Variant ${String.fromCharCode(65 + variants.length)}`, prompt: '' }]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const runTests = () => {
    trackEvent('ab_test_run', { variant_count: variants.length });
    // Placeholder for actual test execution
    alert('A/B test execution coming soon!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-800 border border-slate-600 rounded-xl w-full max-w-6xl max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">A/B Test Workspace</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Test Input</label>
            <textarea
              value={testInput}
              onChange={e => setTestInput(e.target.value)}
              className="w-full h-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Enter test input to run against all variants..."
            />
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Variants</h3>
            <button
              onClick={addVariant}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Variant
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variants.map(v => (
              <div key={v.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <input
                    value={v.name}
                    onChange={e => setVariants(variants.map(vr => vr.id === v.id ? { ...vr, name: e.target.value } : vr))}
                    className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white font-medium"
                  />
                  {variants.length > 2 && (
                    <button onClick={() => removeVariant(v.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <textarea
                  value={v.prompt}
                  onChange={e => setVariants(variants.map(vr => vr.id === v.id ? { ...vr, prompt: e.target.value } : vr))}
                  className="w-full h-32 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                  placeholder="Enter variant prompt..."
                />
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={runTests}
            disabled={!testInput || variants.some(v => !v.prompt)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Run Tests
          </button>
        </div>
      </div>
    </div>
  );
};
