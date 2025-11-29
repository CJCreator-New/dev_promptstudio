import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';

interface Criterion {
  id: string;
  name: string;
  weight: number;
  passed?: boolean;
}

interface EvaluationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  output: string;
}

export const EvaluationPanel: React.FC<EvaluationPanelProps> = ({ isOpen, onClose, output }) => {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: '1', name: 'Clarity', weight: 30 },
    { id: '2', name: 'Completeness', weight: 30 },
    { id: '3', name: 'Accuracy', weight: 40 }
  ]);

  const addCriterion = () => {
    setCriteria([...criteria, { id: Date.now().toString(), name: '', weight: 10 }]);
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const togglePass = (id: string) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, passed: c.passed === undefined ? true : !c.passed } : c));
  };

  const score = criteria.reduce((acc, c) => acc + (c.passed ? c.weight : 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-800 border border-slate-600 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Evaluation Panel</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Overall Score</span>
              <span className={`text-2xl font-bold ${score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {score}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all ${score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Evaluation Criteria</h3>
            <button
              onClick={addCriterion}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Criterion
            </button>
          </div>

          <div className="space-y-3">
            {criteria.map(c => (
              <div key={c.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePass(c.id)}
                    className={`flex-shrink-0 ${c.passed === true ? 'text-green-400' : c.passed === false ? 'text-red-400' : 'text-slate-500'}`}
                  >
                    {c.passed === true ? <CheckCircle className="w-6 h-6" /> : c.passed === false ? <XCircle className="w-6 h-6" /> : <div className="w-6 h-6 border-2 border-slate-500 rounded-full"></div>}
                  </button>
                  <input
                    value={c.name}
                    onChange={e => setCriteria(criteria.map(cr => cr.id === c.id ? { ...cr, name: e.target.value } : cr))}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                    placeholder="Criterion name..."
                  />
                  <input
                    type="number"
                    value={c.weight}
                    onChange={e => setCriteria(criteria.map(cr => cr.id === c.id ? { ...cr, weight: parseInt(e.target.value) || 0 } : cr))}
                    className="w-20 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white text-center"
                    min="0"
                    max="100"
                  />
                  <span className="text-xs text-slate-400">%</span>
                  {criteria.length > 1 && (
                    <button onClick={() => removeCriterion(c.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
