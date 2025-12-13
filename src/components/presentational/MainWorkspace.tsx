import React, { memo, Suspense } from 'react';
import { Menu } from 'lucide-react';
import PromptInput from '../PromptInput';
import PromptOutput from '../PromptOutput';
import { EnhancementOptions } from '../../types';
import { KeyProvider } from '../../types/apiKeys';

interface MainWorkspaceProps {
  input: string;
  setInput: (value: string) => void;
  options: EnhancementOptions;
  setOptions: (options: EnhancementOptions) => void;
  enhancedPrompt: string | null;
  originalPrompt: string | null;
  isLoading: boolean;
  isBooting: boolean;
  isReadOnly: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: number | null;
  provider: KeyProvider;
  onProviderChange: (provider: KeyProvider) => void;
  onEnhance: () => void;
  onSave: () => void;
  onSaveTemplate: () => void;
  onShare: () => void;
  onChainPrompt: (output: string) => void;
  onABTest: () => void;
  onEvaluate: () => void;
  onMobileHistoryOpen: () => void;
}

export const MainWorkspace = memo<MainWorkspaceProps>(({
  input,
  setInput,
  options,
  setOptions,
  enhancedPrompt,
  originalPrompt,
  isLoading,
  isBooting,
  isReadOnly,
  saveStatus,
  lastSaved,
  provider,
  onProviderChange,
  onEnhance,
  onSave,
  onSaveTemplate,
  onShare,
  onChainPrompt,
  onABTest,
  onEvaluate,
  onMobileHistoryOpen,
}) => {
  return (
    <main className="flex-1 max-w-[1920px] w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 flex flex-col lg:flex-row gap-4 lg:gap-5 relative">
      <button 
        onClick={onMobileHistoryOpen}
        className="lg:hidden fixed top-20 right-4 z-40 p-3 min-w-[44px] min-h-[44px] bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 focus:ring-2 focus:ring-blue-500 rounded-lg flex items-center justify-center shadow-lg border border-slate-700"
        aria-label="Open history sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1 w-full lg:max-w-[45%] h-[calc(100vh-120px)] min-h-[400px]">
        <PromptInput 
          input={input}
          setInput={setInput}
          options={options}
          setOptions={setOptions}
          onEnhance={onEnhance}
          onSave={onSave}
          onSaveTemplate={onSaveTemplate}
          isLoading={isLoading}
          isBooting={isBooting}
          readOnly={isReadOnly}
          saveStatus={saveStatus}
          lastSaved={lastSaved}
          provider={provider}
          onProviderChange={onProviderChange}
        />
      </div>

      <div className="flex-1 w-full lg:max-w-[45%] h-[calc(100vh-120px)] min-h-[400px]">
        <PromptOutput 
          enhancedPrompt={enhancedPrompt} 
          originalPrompt={originalPrompt}
          options={options}
          onShare={onShare}
          onChainPrompt={onChainPrompt}
          onABTest={onABTest}
          onEvaluate={onEvaluate}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
});

MainWorkspace.displayName = 'MainWorkspace';
