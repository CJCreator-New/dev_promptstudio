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
    <div className="space-y-1 min-w-0 border-b border-border pb-4">
      <div className="flex items-center justify-center gap-2 bg-elevated p-1.5 rounded-lg border border-border shadow-sm inline-flex mx-auto w-full md:w-auto overflow-x-auto">
        {modes.map((modeOption) => (
          <button
            key={modeOption.value}
            onClick={() => onChange(modeOption.value)}
            disabled={disabled}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              mode === modeOption.value 
                ? 'bg-accent-primary text-white shadow-md' 
                : 'text-muted hover:text-foreground hover:bg-overlay'
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