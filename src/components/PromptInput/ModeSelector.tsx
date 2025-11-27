import React from 'react';
import { Wand2, Sparkles, FileText } from 'lucide-react';
import { GenerationMode } from '../../types';

interface ModeSelectorProps {
  mode: GenerationMode;
  onChange: (mode: GenerationMode) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange, disabled = false }) => {
  const modes = [
    {
      value: GenerationMode.BASIC,
      label: 'Basic Refinement',
      icon: <Wand2 className="w-4 h-4" />,
      title: 'Simple grammar and clarity improvements'
    },
    {
      value: GenerationMode.PROMPT,
      label: 'Prompt Enhancer',
      icon: <Sparkles className="w-4 h-4" />,
      title: 'Full prompt engineering with structure and best practices'
    },
    {
      value: GenerationMode.OUTLINE,
      label: 'Document Outline',
      icon: <FileText className="w-4 h-4" />,
      title: 'Generate a structured document outline'
    }
  ];

  return (
    <div className="space-y-1 min-w-0 md:col-span-4 border-b border-slate-700/50 pb-4 mb-2">
      <div className="flex items-center justify-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800 inline-flex mx-auto w-full md:w-auto overflow-x-auto">
        {modes.map((modeOption) => (
          <button
            key={modeOption.value}
            onClick={() => onChange(modeOption.value)}
            disabled={disabled}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              mode === modeOption.value 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={modeOption.title}
          >
            {modeOption.icon}
            {modeOption.label}
          </button>
        ))}
      </div>
    </div>
  );
};