import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';

interface SuggestionChipsProps {
  suggestions: string[];
  onAddSuggestion: (suggestion: string) => void;
  disabled?: boolean;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ 
  suggestions, 
  onAddSuggestion, 
  disabled = false 
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div 
      id="suggestions-area" 
      className="flex flex-wrap gap-2 items-center animate-in fade-in slide-in-from-top-1" 
      aria-label="Smart Suggestions"
    >
      <div className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 mr-1" aria-hidden="true">
        <Sparkles className="w-3 h-3" />
        SUGGESTIONS:
      </div>
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          onClick={() => onAddSuggestion(suggestion)}
          disabled={disabled}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 rounded-md text-[10px] text-slate-300 hover:text-white transition-all active:scale-95 group focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Add suggestion: ${suggestion}`}
        >
          <span>{suggestion}</span>
          <PlusCircle className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
};