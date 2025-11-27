import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutoSave } from '../hooks/useAutoSave';
import { useDraftRecovery } from '../hooks/useDraftRecovery';
import { DomainType, GenerationMode } from '../types';

// Mock dependencies
vi.mock('../utils/db', () => ({
  db: {
    drafts: {
      add: vi.fn(),
      count: vi.fn(),
      orderBy: vi.fn(),
      bulkDelete: vi.fn()
    }
  }
}));

vi.mock('../utils/errorLogging', () => ({
  logger: { error: vi.fn() }
}));

const mockOptions = {
  domain: DomainType.FRONTEND,
  mode: GenerationMode.PROMPT,
  targetTool: 'general',
  complexity: 'intermediate' as any,
  platform: 'web' as any,
  includeTechStack: false,
  includeBestPractices: false,
  includeEdgeCases: false,
  includeCodeSnippet: false,
  includeExampleUsage: false,
  includeTests: false,
  useThinking: false
};

describe('Auto-Save Unit Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useAutoSave Hook', () => {
    it('should initialize with idle status', () => {
      const { result } = renderHook(() => useAutoSave('', mockOptions));
      
      expect(result.current.status).toBe('idle');
      expect(result.current.lastSaved).toBeNull();
      expect(result.current.retryCount).toBe(0);
    });

    it('should debounce save operations correctly', async () => {
      const { db } = await import('../utils/db');
      db.drafts.add.mockResolvedValue(undefined);
      db.drafts.count.mockResolvedValue(5);
      
      const { result, rerender } = renderHook(
        ({ input }) => useAutoSave(input, mockOptions),
        { initialProps: { input: 'test' } }
      );

      expect(result.current.status).toBe('saving');

      // Change input multiple times quickly
      rerender({ input: 'test1' });
      rerender({ input: 'test2' });
      rerender({ input: 'test3' });

      // Should still be saving, not saved yet
      expect(result.current.status).toBe('saving');
      expect(db.drafts.add).not.toHaveBeenCalled();

      // Complete debounce period
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(db.drafts.add).toHaveBeenCalledTimes(1);
    });

    it('should handle cleanup logic correctly', async () => {
      const { db } = await import('../utils/db');
      
      // Mock 12 drafts exist
      db.drafts.count.mockResolvedValue(12);
      db.drafts.add.mockResolvedValue(undefined);
      
      const mockOldDrafts = [
        { id: 1, timestamp: 1000 },
        { id: 2, timestamp: 2000 }
      ];
      
      db.drafts.orderBy.mockReturnValue({
        limit: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(mockOldDrafts)
        })
      });

      const { result } = renderHook(() => useAutoSave('test input', mockOptions));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Should delete 2 oldest drafts (12 - 10 = 2)
      expect(db.drafts.bulkDelete).toHaveBeenCalledWith([1, 2]);
    });

    it('should implement exponential backoff retry logic', async () => {
      const { db } = await import('../utils/db');
      
      db.drafts.add
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAutoSave('test', mockOptions));

      // Initial attempt
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(db.drafts.add).toHaveBeenCalledTimes(1);

      // First retry (1s delay)
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(db.drafts.add).toHaveBeenCalledTimes(2);

      // Second retry (2s delay - exponential backoff)
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(db.drafts.add).toHaveBeenCalledTimes(3);
      expect(result.current.status).toBe('saved');
    });

    it('should stop retrying after max attempts', async () => {
      const { db } = await import('../utils/db');
      const { logger } = await import('../utils/errorLogging');
      
      db.drafts.add.mockRejectedValue(new Error('Persistent failure'));

      const { result } = renderHook(() => useAutoSave('test', mockOptions));

      // Initial + 3 retries
      act(() => {
        vi.advanceTimersByTime(2000); // Initial
        vi.advanceTimersByTime(1000); // Retry 1 (1s)
        vi.advanceTimersByTime(2000); // Retry 2 (2s)
        vi.advanceTimersByTime(4000); // Retry 3 (4s)
      });

      expect(db.drafts.add).toHaveBeenCalledTimes(4);
      expect(result.current.status).toBe('error');
      expect(logger.error).toHaveBeenCalledTimes(4);
    });

    it('should not save empty input', async () => {
      const { db } = await import('../utils/db');
      
      const { result } = renderHook(() => useAutoSave('', mockOptions));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(db.drafts.add).not.toHaveBeenCalled();
      expect(result.current.status).toBe('idle');
    });
  });

  describe('useDraftRecovery Hook', () => {
    it('should load recent drafts on mount', async () => {
      const { db } = await import('../utils/db');
      
      const mockDrafts = [
        { id: 1, input: 'draft 1', options: mockOptions, timestamp: Date.now() },
        { id: 2, input: 'draft 2', options: mockOptions, timestamp: Date.now() - 1000 }
      ];

      db.drafts.orderBy.mockReturnValue({
        reverse: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            toArray: vi.fn().mockResolvedValue(mockDrafts)
          })
        })
      });

      const { result } = renderHook(() => useDraftRecovery());

      // Wait for async effect
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.drafts).toEqual(mockDrafts);
      expect(result.current.showModal).toBe(true);
    });

    it('should not show modal when no drafts exist', async () => {
      const { db } = await import('../utils/db');
      
      db.drafts.orderBy.mockReturnValue({
        reverse: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            toArray: vi.fn().mockResolvedValue([])
          })
        })
      });

      const { result } = renderHook(() => useDraftRecovery());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.showModal).toBe(false);
    });

    it('should handle draft recovery correctly', () => {
      const { result } = renderHook(() => useDraftRecovery());
      
      const mockDraft = { 
        id: 1, 
        input: 'test', 
        options: mockOptions, 
        timestamp: Date.now() 
      };

      act(() => {
        const recovered = result.current.recoverDraft(mockDraft);
        expect(recovered).toEqual(mockDraft);
      });

      expect(result.current.showModal).toBe(false);
    });

    it('should handle modal dismissal', () => {
      const { result } = renderHook(() => useDraftRecovery());

      act(() => {
        result.current.dismissModal();
      });

      expect(result.current.showModal).toBe(false);
    });
  });
});