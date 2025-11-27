import { create } from 'zustand';
import { AppStore } from './types';
import { DomainType, ComplexityLevel, PlatformType, GenerationMode } from '../types';

export const useAppStore = create<AppStore>((set) => ({
  // State
  input: '',
  options: {
    domain: DomainType.FRONTEND,
    platform: PlatformType.WEB,
    targetTool: 'general',
    complexity: ComplexityLevel.DETAILED,
    mode: GenerationMode.PROMPT,
    includeTechStack: true,
    includeBestPractices: true,
    includeEdgeCases: false,
    includeCodeSnippet: false,
    includeExampleUsage: false,
    includeTests: false,
    useThinking: false,
  },
  enhancedPrompt: null,
  originalPrompt: null,
  isLoading: false,
  recoveryDraft: null,

  // Actions
  setInput: (input) => set({ input }),
  setOptions: (options) => 
    set((state) => ({ 
      options: { ...state.options, ...options } 
    })),
  setEnhancedPrompt: (prompt) => set({ enhancedPrompt: prompt }),
  setOriginalPrompt: (prompt) => set({ originalPrompt: prompt }),
  setLoading: (loading) => set({ isLoading: loading }),
  setRecoveryDraft: (draft) => set({ recoveryDraft: draft }),
  resetPrompts: () => set({ 
    enhancedPrompt: null, 
    originalPrompt: null 
  }),
}));