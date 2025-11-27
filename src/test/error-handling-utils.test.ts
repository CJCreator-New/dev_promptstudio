import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  formatErrorMessage, 
  withRetry, 
  createErrorContext, 
  logError 
} from '../utils/errorHandling';

describe('Error Handling Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('formatErrorMessage', () => {
    test('formats network errors correctly', () => {
      const networkError = new Error('fetch failed');
      networkError.name = 'NetworkError';
      
      const message = formatErrorMessage(networkError);
      expect(message).toBe('Network connection issue. Please check your internet connection and try again.');
    });

    test('formats validation errors correctly', () => {
      const validationError = new Error('Invalid input provided');
      validationError.name = 'ValidationError';
      
      const message = formatErrorMessage(validationError);
      expect(message).toBe('Invalid input provided');
    });

    test('formats rate limit errors correctly', () => {
      const rateLimitError = new Error('Rate limit exceeded: 429');
      
      const message = formatErrorMessage(rateLimitError);
      expect(message).toBe('Too many requests. Please wait a moment before trying again.');
    });

    test('formats server errors correctly', () => {
      const serverError = new Error('Internal server error: 500');
      
      const message = formatErrorMessage(serverError);
      expect(message).toBe('Service temporarily unavailable. Please try again in a few moments.');
    });

    test('provides generic message for unknown errors', () => {
      const unknownError = new Error('Something weird happened');
      
      const message = formatErrorMessage(unknownError);
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('withRetry', () => {
    test('succeeds on first attempt', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success');
      
      const result = await withRetry(mockOperation, { maxAttempts: 3, delay: 100 });
      
      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    test('retries on failure and eventually succeeds', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValueOnce('success');
      
      const resultPromise = withRetry(mockOperation, { maxAttempts: 3, delay: 100 });
      
      // Advance timers to trigger retries
      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(100);
      
      const result = await resultPromise;
      
      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    test('throws error after max attempts', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Persistent failure'));
      
      const resultPromise = withRetry(mockOperation, { maxAttempts: 2, delay: 100 });
      
      // Advance timer for first retry
      await vi.advanceTimersByTimeAsync(100);
      
      await expect(resultPromise).rejects.toThrow('Persistent failure');
      expect(mockOperation).toHaveBeenCalledTimes(2);
    });

    test('uses exponential backoff when enabled', async () => {
      const delays: number[] = [];
      const originalSetTimeout = global.setTimeout;
      
      global.setTimeout = vi.fn().mockImplementation((callback, delay) => {
        delays.push(delay);
        return originalSetTimeout(callback, 0);
      });

      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValueOnce('success');

      await withRetry(mockOperation, { maxAttempts: 3, delay: 100, backoff: true });
      
      expect(delays).toEqual([100, 200]); // 100 * 2^0, 100 * 2^1
      
      global.setTimeout = originalSetTimeout;
    });

    test('uses fixed delay when backoff is disabled', async () => {
      const delays: number[] = [];
      const originalSetTimeout = global.setTimeout;
      
      global.setTimeout = vi.fn().mockImplementation((callback, delay) => {
        delays.push(delay);
        return originalSetTimeout(callback, 0);
      });

      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValueOnce('success');

      await withRetry(mockOperation, { maxAttempts: 3, delay: 100, backoff: false });
      
      expect(delays).toEqual([100, 100]); // Fixed delay
      
      global.setTimeout = originalSetTimeout;
    });
  });

  describe('createErrorContext', () => {
    test('creates context with required fields', () => {
      const context = createErrorContext('TestComponent', 'testAction');
      
      expect(context.component).toBe('TestComponent');
      expect(context.action).toBe('testAction');
      expect(context.timestamp).toBeTypeOf('number');
      expect(context.userAgent).toBeTypeOf('string');
      expect(context.url).toBeTypeOf('string');
    });

    test('works with optional parameters', () => {
      const context = createErrorContext();
      
      expect(context.component).toBeUndefined();
      expect(context.action).toBeUndefined();
      expect(context.timestamp).toBeTypeOf('number');
      expect(context.userAgent).toBeTypeOf('string');
      expect(context.url).toBeTypeOf('string');
    });

    test('captures current timestamp', () => {
      const before = Date.now();
      const context = createErrorContext();
      const after = Date.now();
      
      expect(context.timestamp).toBeGreaterThanOrEqual(before);
      expect(context.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('logError', () => {
    test('logs error with context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new Error('Test error');
      const context = createErrorContext('TestComponent', 'testAction');
      
      logError(error, context);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Error Log]',
        expect.objectContaining({
          message: 'Test error',
          name: 'Error',
          stack: error.stack,
          context: expect.objectContaining({
            component: 'TestComponent',
            action: 'testAction'
          })
        })
      );
      
      consoleSpy.mockRestore();
    });

    test('redacts sensitive data from context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new Error('Test error');
      const context = createErrorContext('TestComponent', 'testAction');
      context.userId = 'sensitive-user-id';
      
      logError(error, context);
      
      const logCall = consoleSpy.mock.calls[0];
      const logData = logCall[1];
      
      expect(logData.context.userId).toBe('[REDACTED]');
      
      consoleSpy.mockRestore();
    });

    test('handles context without sensitive data', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new Error('Test error');
      const context = createErrorContext('TestComponent', 'testAction');
      
      logError(error, context);
      
      const logCall = consoleSpy.mock.calls[0];
      const logData = logCall[1];
      
      expect(logData.context.userId).toBeUndefined();
      
      consoleSpy.mockRestore();
    });
  });
});