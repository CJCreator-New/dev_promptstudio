import React, { useRef, useEffect } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Settings2, Lock, Save, LayoutTemplate, Lightbulb, ChevronDown, Sparkles, BrainCircuit } from 'lucide-react';
import { DomainType, ComplexityLevel, EnhancementOptions, PlatformType, GenerationMode } from '../../types';
import { notifySuccess, notifyConfigChange } from '../ToastSystem';
import { ConfigPanelSkeleton, SuggestionsSkeleton } from '../Loaders';
import { Spinner } from '../LoadingPrimitives';
import { InlineError } from '../ErrorComponents';
import { EXAMPLE_PROMPTS } from '../../utils/constants';
import { SaveStatus } from '../SaveStatus';
import { Checkbox, Textarea, Dropdown } from '../atomic';
import { ModeSelector } from './ModeSelector';
import { ConfigurationPanel } from './ConfigurationPanel';
import { SuggestionChips } from './SuggestionChips';
import { usePromptSuggestions } from '../../hooks/usePromptSuggestions';
import { useValidation } from '../../hooks/useValidation';

interface PromptInputProps {
  input: string;
  setInput: (value: string) => void;
  options: EnhancementOptions;
  setOptions: (options: EnhancementOptions) => void;
  onEnhance: () => void;
  onSave: () => void;
  onSaveTemplate: () => void;
  isLoading: boolean;
  isBooting?: boolean;
  readOnly?: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: number | null;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  input, 
  setInput, 
  options, 
  setOptions, 
  onEnhance, 
  onSave,
  onSaveTemplate,
  isLoading,
  isBooting = false,
  readOnly = false,
  saveStatus = 'idle',
  lastSaved = null
}) => {
  const validationError = useValidation(input, isBooting, readOnly);
  const suggestions = usePromptSuggestions(input, options.domain, isBooting);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.activeElement?.id === 'main-input' && !readOnly) {
        setInput('');
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [readOnly, setInput]);

  const handleLoadExample = (text: string, label: string) => {
    if (readOnly) return;
    setInput(text);
    notifySuccess(`Loaded example: ${label}`);
  };

  const addSuggestion = (suggestion: string) => {
    if (readOnly) return;
    const needsSpace = input.length > 0 && !input.endsWith(' ');
    setInput(input + (needsSpace ? ' ' : '') + suggestion);
    notifySuccess(`Added "${suggestion}"`);
  };

  const handleModeChange = (mode: GenerationMode) => {
    setOptions({ ...options, mode });
  };

  const handleOptionsChange = (newOptions: EnhancementOptions) => {
    setOptions(newOptions);
    notifyConfigChange('Configuration updated');
  };

  const isAdvancedMode = options.mode !== GenerationMode.BASIC;

  const exampleDropdownItems = EXAMPLE_PROMPTS.map(ex => ({
    label: ex.label,
    description: ex.text,
    onClick: () => handleLoadExample(ex.text, ex.label)
  }));

  return (
    <div className={`flex flex-col h-full card-base ${readOnly ? 'opacity-80' : 'card-interactive'}`}>
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between z-20 gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <h2 className="text-sm font-semibold text-secondary flex items-center gap-2 whitespace-nowrap">
            {readOnly ? <Lock className="w-4 h-4 text-slate-500" aria-hidden="true" /> : <Settings2 className="w-4 h-4 text-indigo-400" aria-hidden="true" />}
            Configuration
          </h2>
          {!readOnly && !isBooting && (
             <SaveStatus status={saveStatus} lastSaved={lastSaved} retryCount={0} />
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!readOnly && !isBooting && (
            <>
              <button 
                onClick={onSaveTemplate}
                disabled={!input.trim()}
                className="btn-ghost px-3 py-1.5 text-xs"
                title="Save current input text as a reusable template"
              >
                <LayoutTemplate className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Template</span>
              </button>

              <button 
                onClick={onSave}
                disabled={!input.trim()}
                className="btn-ghost px-3 py-1.5 text-xs"
                title="Save current configuration as a project"
              >
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Project</span>
              </button>

              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10 hover:border-indigo-500/30 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Examples</span>
                    <ChevronDown className="w-3 h-3" aria-hidden="true" />
                  </button>
                }
                items={exampleDropdownItems}
              />
            </>
          )}
        </div>
      </div>

      <Tooltip.Provider>
        {isBooting ? (
          <ConfigPanelSkeleton />
        ) : (
          <>
            {/* Mode Selector */}
            <div className="px-6 pt-6">
              <ModeSelector
                mode={options.mode}
                onChange={handleModeChange}
                disabled={readOnly}
              />
            </div>

            {/* Configuration Panel */}
            <ConfigurationPanel
              options={options}
              onChange={handleOptionsChange}
              disabled={readOnly}
              isAdvancedMode={isAdvancedMode}
            />
          </>
        )}
      </Tooltip.Provider>

      {/* Advanced Options Checkboxes */}
      {isAdvancedMode && (
        <div className={`px-6 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-slate-800/30 border-b border-slate-800 animate-in fade-in duration-300 ${readOnly ? 'pointer-events-none grayscale-[0.5]' : ''}`}>
          <Checkbox
            label="Stack Recs"
            icon={<span className="text-xs">⚡</span>}
            checked={options.includeTechStack}
            onChange={(e) => setOptions({...options, includeTechStack: e.target.checked})}
            disabled={readOnly}
          />
          
          <Checkbox
            label="Best Practices"
            icon={<span className="text-xs">🛡</span>}
            checked={options.includeBestPractices}
            onChange={(e) => setOptions({...options, includeBestPractices: e.target.checked})}
            disabled={readOnly}
          />
          
          <Checkbox
            label="Edge Cases"
            icon={<span className="text-xs">⚠</span>}
            checked={options.includeEdgeCases}
            onChange={(e) => setOptions({...options, includeEdgeCases: e.target.checked})}
            disabled={readOnly}
          />
          
          <Checkbox
            label="Code Snippet"
            icon={<span className="text-xs">📄</span>}
            checked={!!options.includeCodeSnippet}
            onChange={(e) => setOptions({...options, includeCodeSnippet: e.target.checked})}
            disabled={readOnly}
          />
          
          <Checkbox
            label="Example Usage"
            icon={<span className="text-xs">💻</span>}
            checked={!!options.includeExampleUsage}
            onChange={(e) => setOptions({...options, includeExampleUsage: e.target.checked})}
            disabled={readOnly}
          />
          
          <Checkbox
            label="Include Tests"
            icon={<span className="text-xs">🧪</span>}
            checked={!!options.includeTests}
            onChange={(e) => setOptions({...options, includeTests: e.target.checked})}
            disabled={readOnly}
          />
          
          <Checkbox
            label="Thinking Mode"
            icon={<BrainCircuit className="w-3 h-3" />}
            checked={options.useThinking}
            onChange={(e) => {
              setOptions({...options, useThinking: e.target.checked});
              if (e.target.checked) {
                notifyConfigChange("Thinking Mode enabled (v3.0 Pro)");
              }
            }}
            disabled={readOnly}
            className={options.useThinking ? 'text-purple-400' : ''}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="flex-1 px-6 pb-6 flex flex-col gap-3">
        <Textarea
          id="main-input"
          label={options.mode === GenerationMode.OUTLINE ? 'Rough Topic or Idea' : 'Your Rough Idea'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={options.mode === GenerationMode.OUTLINE ? "e.g., A comprehensive project plan for migrating a monolith to microservices..." : "e.g., I want a react login form with validation and a nice dark mode design..."}
          readOnly={readOnly || isBooting}
          error={validationError || undefined}
          characterCount
          className="flex-1"
        />

        {!readOnly && (
          isBooting ? (
            <SuggestionsSkeleton />
          ) : (
            <SuggestionChips
              suggestions={suggestions}
              onAddSuggestion={addSuggestion}
              disabled={readOnly}
            />
          )
        )}
        
        {!readOnly && (
          <button
            onClick={onEnhance}
            disabled={isLoading || !input.trim() || isBooting || !!validationError}
            className={`
              mt-1 relative w-full py-4 rounded-xl font-bold text-white shadow-lg
              transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden focus-ring
              ${isLoading || !input.trim() || isBooting || !!validationError
                ? 'bg-secondary text-muted cursor-not-allowed' 
                : options.useThinking
                  ? 'gradient-thinking hover:shadow-purple-500/25'
                  : 'gradient-primary hover:shadow-indigo-500/25'}
              active:scale-[0.99]
            `}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                <span>
                  {options.useThinking ? 'Reasoning & Generating...' 
                    : options.mode === GenerationMode.OUTLINE ? 'Generating Outline...' 
                    : options.mode === GenerationMode.BASIC ? 'Refining...'
                    : 'Enhancing Prompt...'}
                </span>
              </>
            ) : (
              <>
                {options.useThinking ? <BrainCircuit className="w-5 h-5" aria-hidden="true" /> : <Sparkles className="w-5 h-5" aria-hidden="true" />}
                <span>
                  {options.useThinking ? 'Enhance with Thinking' 
                    : options.mode === GenerationMode.OUTLINE ? 'Generate Outline' 
                    : options.mode === GenerationMode.BASIC ? 'Refine Prompt'
                    : 'Enhance Prompt'}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptInput;