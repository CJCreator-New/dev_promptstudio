import React, { useState, useEffect } from 'react';
import { X, Wand2 } from 'lucide-react';
import { extractVariables, interpolateVariables } from '../utils/variableInterpolation';

interface VariableEditorProps {
  template: string;
  onApply: (result: string) => void;
  onClose: () => void;
}

export const VariableEditor: React.FC<VariableEditorProps> = ({ template, onApply, onClose }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const variables = extractVariables(template);

  useEffect(() => {
    const initial: Record<string, string> = {};
    variables.forEach(v => initial[v] = '');
    setValues(initial);
  }, [template]);

  const handleApply = () => {
    const result = interpolateVariables(template, values);
    onApply(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-800 border border-slate-600 rounded-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Fill Template Variables</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {variables.map(v => (
            <div key={v}>
              <label className="block text-xs font-medium text-slate-300 mb-2">{v}</label>
              <input
                type="text"
                value={values[v] || ''}
                onChange={e => setValues({ ...values, [v]: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={`Enter ${v}...`}
              />
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
};
