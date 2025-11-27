import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, measureRenderTime } from '../utils/performance';

describe('Performance Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('debounce', () => {
    test('delays function execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('cancels previous calls when called again', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      vi.advanceTimersByTime(50);
      debouncedFn(); // This should cancel the previous call
      
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('passes arguments correctly', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('arg1', 'arg2');
      vi.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    test('executes function immediately on first call', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('ignores subsequent calls within limit', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('allows calls after limit period', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      vi.advanceTimersByTime(100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test('passes arguments correctly', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn('test', 123);
      expect(mockFn).toHaveBeenCalledWith('test', 123);
    });
  });

  describe('measureRenderTime', () => {
    test('returns render time measurement function', () => {
      const endMeasurement = measureRenderTime('TestComponent');
      expect(typeof endMeasurement).toBe('function');
    });

    test('measures time correctly', () => {
      const mockPerformanceNow = vi.spyOn(performance, 'now');
      mockPerformanceNow.mockReturnValueOnce(100).mockReturnValueOnce(120);
      
      const endMeasurement = measureRenderTime('TestComponent');
      const renderTime = endMeasurement();
      
      expect(renderTime).toBe(20);
    });

    test('warns for slow renders', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockPerformanceNow = vi.spyOn(performance, 'now');
      mockPerformanceNow.mockReturnValueOnce(100).mockReturnValueOnce(120); // 20ms render
      
      const endMeasurement = measureRenderTime('SlowComponent');
      endMeasurement();
      
      expect(consoleSpy).toHaveBeenCalledWith('SlowComponent render took 20.00ms');
      
      consoleSpy.mockRestore();
    });

    test('does not warn for fast renders', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockPerformanceNow = vi.spyOn(performance, 'now');
      mockPerformanceNow.mockReturnValueOnce(100).mockReturnValueOnce(110); // 10ms render
      
      const endMeasurement = measureRenderTime('FastComponent');
      endMeasurement();
      
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});