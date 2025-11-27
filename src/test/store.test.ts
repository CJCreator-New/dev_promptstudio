import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore, useAppStore, useDataStore } from '../store';
import { DomainType } from '../types';

describe('Zustand Stores', () => {
  beforeEach(() => {
    // Reset stores before each test
    useUIStore.setState({
      isMobileHistoryOpen: false,
      isTemplateModalOpen: false,
      templateModalMode: 'create',
      editingTemplateId: null,
      templateFormData: { name: '', text: '', domain: 'Frontend' },
      isFeedbackOpen: false,
      isReadOnly: false,
      isBooting: true,
    }, true);
    
    useAppStore.setState({
      input: '',
      options: {
        domain: DomainType.FRONTEND,
        platform: 'web' as any,
        targetTool: 'general',
        complexity: 'detailed' as any,
        mode: 'prompt' as any,
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
    }, true);
    
    useDataStore.setState({
      history: [],
      savedProjects: [],
      customTemplates: [],
    }, true);
  });

  describe('UIStore', () => {
    it('should have correct initial state', () => {
      const state = useUIStore.getState();
      expect(state.isMobileHistoryOpen).toBe(false);
      expect(state.isBooting).toBe(true);
      expect(state.isReadOnly).toBe(false);
    });

    it('should update mobile history open state', () => {
      const { setMobileHistoryOpen } = useUIStore.getState();
      setMobileHistoryOpen(true);
      expect(useUIStore.getState().isMobileHistoryOpen).toBe(true);
    });
  });

  describe('AppStore', () => {
    it('should have correct initial state', () => {
      const state = useAppStore.getState();
      expect(state.input).toBe('');
      expect(state.isLoading).toBe(false);
      expect(state.enhancedPrompt).toBeNull();
    });

    it('should update input', () => {
      const { setInput } = useAppStore.getState();
      setInput('test prompt');
      expect(useAppStore.getState().input).toBe('test prompt');
    });

    it('should reset prompts', () => {
      const { setEnhancedPrompt, setOriginalPrompt, resetPrompts } = useAppStore.getState();
      setEnhancedPrompt('enhanced');
      setOriginalPrompt('original');
      
      resetPrompts();
      
      const state = useAppStore.getState();
      expect(state.enhancedPrompt).toBeNull();
      expect(state.originalPrompt).toBeNull();
    });
  });

  describe('DataStore', () => {
    it('should have correct initial state', () => {
      const state = useDataStore.getState();
      expect(state.history).toEqual([]);
      expect(state.savedProjects).toEqual([]);
      expect(state.customTemplates).toEqual([]);
    });

    it('should add history item', () => {
      const { addHistoryItem } = useDataStore.getState();
      const historyItem = {
        id: '1',
        original: 'test',
        enhanced: 'enhanced test',
        timestamp: Date.now(),
        domain: DomainType.FRONTEND,
        mode: 'prompt' as const,
      };
      
      addHistoryItem(historyItem);
      expect(useDataStore.getState().history).toHaveLength(1);
      expect(useDataStore.getState().history[0]).toEqual(historyItem);
    });

    it('should limit history to 50 items', () => {
      const { addHistoryItem } = useDataStore.getState();
      
      // Add 51 items
      for (let i = 0; i < 51; i++) {
        addHistoryItem({
          id: i.toString(),
          original: `test ${i}`,
          enhanced: `enhanced ${i}`,
          timestamp: Date.now(),
          domain: DomainType.FRONTEND,
          mode: 'prompt' as const,
        });
      }
      
      expect(useDataStore.getState().history).toHaveLength(50);
    });
  });
});