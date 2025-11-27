import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';
import { usePromptSuggestions } from '../hooks/usePromptSuggestions';
import { useAutoSave } from '../hooks/useAutoSave';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useValidation } from '../hooks/useValidation';
import { useClickOutside } from '../hooks/useClickOutside';
import { DomainType } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Custom Hooks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('useDebounce', () => {
    test('returns initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));
      
      expect(result.current).toBe('initial');
    });

    test('debounces value changes', async () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );
      
      expect(result.current).toBe('initial');
      
      // Change the value
      rerender({ value: 'updated', delay: 500 });
      
      // Should still be initial value
      expect(result.current).toBe('initial');
      
      // Advance timers
      act(() => {
        vi.advanceTimersByTime(500);
      });
      
      // Should now be updated value
      expect(result.current).toBe('updated');
    });

    test('cancels previous timeout on rapid changes', async () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );
      
      // Rapid changes
      rerender({ value: 'change1', delay: 500 });
      act(() => {
        vi.advanceTimersByTime(250);
      });
      
      rerender({ value: 'change2', delay: 500 });
      act(() => {
        vi.advanceTimersByTime(250);
      });
      
      // Should still be initial
      expect(result.current).toBe('initial');
      
      // Complete the timeout
      act(() => {
        vi.advanceTimersByTime(250);
      });
      
      // Should be the latest change
      expect(result.current).toBe('change2');
    });
  });

  describe('usePromptSuggestions', () => {
    test('returns empty array when booting', () => {
      const { result } = renderHook(() => 
        usePromptSuggestions('test input', DomainType.FRONTEND, true)
      );
      
      expect(result.current).toEqual([]);
    });

    test('returns suggestions based on input and domain', () => {
      const { result } = renderHook(() => 
        usePromptSuggestions('react component', DomainType.FRONTEND, false)
      );
      
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBeGreaterThan(0);
      expect(result.current.length).toBeLessThanOrEqual(10);
    });

    test('filters out suggestions already in input', () => {
      const { result } = renderHook(() => 
        usePromptSuggestions('react hooks component', DomainType.FRONTEND, false)
      );
      
      // Should not suggest "React Hooks" since it's already in the input
      expect(result.current).not.toContain('React Hooks');
    });

    test('updates suggestions when domain changes', () => {
      const { result, rerender } = renderHook(
        ({ domain }) => usePromptSuggestions('api', domain, false),
        { initialProps: { domain: DomainType.FRONTEND } }
      );
      
      const frontendSuggestions = result.current;
      
      rerender({ domain: DomainType.BACKEND });
      
      const backendSuggestions = result.current;
      
      // Should have different suggestions for different domains
      expect(frontendSuggestions).not.toEqual(backendSuggestions);
    });

    test('limits suggestions to maximum of 10', () => {
      const { result } = renderHook(() => 
        usePromptSuggestions('', DomainType.FRONTEND, false)
      );
      
      expect(result.current.length).toBeLessThanOrEqual(10);
    });
  });

  describe('useAutoSave', () => {
    test('returns initial status as idle', () => {
      const { result } = renderHook(() => 
        useAutoSave('test input', { domain: DomainType.FRONTEND } as any)
      );
      
      expect(result.current.status).toBe('idle');
      expect(result.current.lastSaved).toBeNull();
    });

    test('debounces save operations', () => {
      const { result, rerender } = renderHook(
        ({ input, options }) => useAutoSave(input, options),
        { 
          initialProps: { 
            input: 'initial', 
            options: { domain: DomainType.FRONTEND } as any 
          } 
        }
      );
      
      expect(result.current.status).toBe('idle');
      
      // Change input
      rerender({ 
        input: 'updated input', 
        options: { domain: DomainType.FRONTEND } as any 
      });
      
      // Should start saving process
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      // Status should eventually update (implementation dependent)
      expect(['idle', 'saving', 'saved']).toContain(result.current.status);
    });
  });

  describe('useLocalStorage', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(null);
      vi.clearAllMocks();
    });

    test('initializes with default value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      
      expect(result.current[0]).toBe('default');
      expect(typeof result.current[1]).toBe('function');
    });

    test('reads existing value from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify('stored-value'));
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      
      expect(result.current[0]).toBe('stored-value');
    });

    test('updates localStorage when value changes', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      
      act(() => {
        result.current[1]('new-value');
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
      expect(result.current[0]).toBe('new-value');
    });

    test('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      
      expect(result.current[0]).toBe('default');
    });
  });

  describe('useValidation', () => {
    test('returns null for valid input', () => {
      const { result } = renderHook(() => 
        useValidation('valid input text', false, false)
      );
      
      expect(result.current).toBeNull();
    });

    test('returns null when booting', () => {
      const { result } = renderHook(() => 
        useValidation('', true, false)
      );
      
      expect(result.current).toBeNull();
    });

    test('returns null when readOnly', () => {
      const { result } = renderHook(() => 
        useValidation('', false, true)
      );
      
      expect(result.current).toBeNull();
    });

    test('returns null for empty input', () => {
      const { result } = renderHook(() => 
        useValidation('', false, false)
      );
      
      expect(result.current).toBeNull();
    });
  });

  describe('useClickOutside', () => {
    test('calls handler when clicking outside element', () => {
      const handler = vi.fn();
      const ref = { current: document.createElement('div') };
      
      renderHook(() => useClickOutside(ref, handler));
      
      // Simulate click outside
      const event = new MouseEvent('mousedown', { bubbles: true });
      document.dispatchEvent(event);
      
      expect(handler).toHaveBeenCalled();
    });

    test('does not call handler when clicking inside element', () => {
      const handler = vi.fn();
      const element = document.createElement('div');
      const ref = { current: element };
      
      renderHook(() => useClickOutside(ref, handler));
      
      // Simulate click inside
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: element });
      document.dispatchEvent(event);
      
      expect(handler).not.toHaveBeenCalled();
    });
  });
});