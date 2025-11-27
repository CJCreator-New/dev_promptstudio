import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, render } from '@testing-library/react';
import { useAutoSave } from '../hooks/useAutoSave';
import { useDraftRecovery } from '../hooks/useDraftRecovery';
import { SaveStatus } from '../components/SaveStatus';
import { DraftRecoveryModal } from '../components/DraftRecoveryModal';
import { DomainType, GenerationMode } from '../types';

// Mock db
vi.mock('../utils/db', () => ({
  db: {
    drafts: {
      add: vi.fn(),
      count: vi.fn().mockResolvedValue(5),
      orderBy: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue([])
        }),
        reverse: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            toArray: vi.fn().mockResolvedValue([])
          })
        })
      }),
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

describe('Auto-Save Properties', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Property 27: Draft Save Timing', () => {
    it('should save exactly 2 seconds after inactivity', async () => {
      const { db } = await import('../utils/db');
      const { result } = renderHook(() => useAutoSave('test input', mockOptions));

      expect(result.current.status).toBe('saving');

      // Fast-forward exactly 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(db.drafts.add).toHaveBeenCalled();
    });

    it('should reset timer on input changes', async () => {
      const { db } = await import('../utils/db');
      const { result, rerender } = renderHook(
        ({ input }) => useAutoSave(input, mockOptions),
        { initialProps: { input: 'initial' } }
      );

      // Change input after 1 second
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      rerender({ input: 'changed' });

      // Advance another 1.5 seconds (total 2.5s, but timer reset)
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Should not have saved yet
      expect(db.drafts.add).not.toHaveBeenCalled();

      // Advance final 0.5 seconds to complete 2s from last change
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(db.drafts.add).toHaveBeenCalled();
    });
  });

  describe('Property 28: Draft Recovery Offer', () => {
    it('should show recovery modal when drafts exist', () => {
      const mockDrafts = [
        { id: 1, input: 'test', options: mockOptions, timestamp: Date.now() }
      ];

      const { container } = render(
        <DraftRecoveryModal
          isOpen={true}
          drafts={mockDrafts}
          onRecover={() => {}}
          onDismiss={() => {}}
        />
      );

      expect(container.querySelector('.modal-overlay')).toBeInTheDocument();
      expect(container.textContent).toContain('Recover Draft');
    });

    it('should not show modal when no drafts exist', () => {
      const { container } = render(
        <DraftRecoveryModal
          isOpen={true}
          drafts={[]}
          onRecover={() => {}}
          onDismiss={() => {}}
        />
      );

      expect(container.querySelector('.modal-overlay')).not.toBeInTheDocument();
    });
  });

  describe('Property 29: Save Status Visibility', () => {
    it('should show saving status during save operation', () => {
      const { container } = render(
        <SaveStatus status="saving" lastSaved={null} />
      );

      expect(container.textContent).toContain('Saving...');
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should show saved status with timestamp', () => {
      const timestamp = Date.now();
      const { container } = render(
        <SaveStatus status="saved" lastSaved={timestamp} />
      );

      expect(container.textContent).toContain('Saved');
    });

    it('should show error status on save failure', () => {
      const { container } = render(
        <SaveStatus status="error" lastSaved={null} />
      );

      expect(container.textContent).toContain('Save Failed');
    });

    it('should show retry status with count', () => {
      const { container } = render(
        <SaveStatus status="saving" lastSaved={null} retryCount={2} />
      );

      expect(container.textContent).toContain('Retrying... (2/3)');
    });
  });

  describe('Property 30: Draft Cleanup Limit', () => {
    it('should maintain only 10 most recent drafts', async () => {
      const { db } = await import('../utils/db');
      
      // Mock 15 drafts exist
      db.drafts.count.mockResolvedValueOnce(15);
      db.drafts.orderBy.mockReturnValueOnce({
        limit: vi.fn().mockReturnValueOnce({
          toArray: vi.fn().mockResolvedValueOnce([
            { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
          ])
        })
      });

      const { result } = renderHook(() => useAutoSave('test', mockOptions));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Should delete 5 oldest drafts (15 - 10 = 5)
      expect(db.drafts.bulkDelete).toHaveBeenCalledWith([1, 2, 3, 4, 5]);
    });
  });

  describe('Property 31: Save Failure Retry', () => {
    it('should retry failed saves with exponential backoff', async () => {
      const { db } = await import('../utils/db');
      
      // Mock first two attempts to fail
      db.drafts.add
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAutoSave('test', mockOptions));

      // Initial save attempt
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // First retry after 1s
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Second retry after 2s (exponential backoff)
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(db.drafts.add).toHaveBeenCalledTimes(3);
    });

    it('should stop retrying after max attempts', async () => {
      const { db } = await import('../utils/db');
      
      // Mock all attempts to fail
      db.drafts.add.mockRejectedValue(new Error('Persistent error'));

      const { result } = renderHook(() => useAutoSave('test', mockOptions));

      // Initial save + 3 retries
      act(() => {
        vi.advanceTimersByTime(2000); // Initial
        vi.advanceTimersByTime(1000); // Retry 1
        vi.advanceTimersByTime(2000); // Retry 2  
        vi.advanceTimersByTime(4000); // Retry 3
        vi.advanceTimersByTime(8000); // Should not retry again
      });

      expect(db.drafts.add).toHaveBeenCalledTimes(4); // Initial + 3 retries
      expect(result.current.status).toBe('error');
    });
  });
});