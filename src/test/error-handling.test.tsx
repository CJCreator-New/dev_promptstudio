import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent, waitFor } from './test-utils';
import { 
  formatErrorMessage, 
  withRetry, 
  createErrorContext, 
  logError 
} from '../utils/errorHandling';
import { InlineError, FullPageError } from '../components/ErrorComponents';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Property 18: API Error User Feedback
describe('Property 18: API Error User Feedback', () => {
  test('API errors provide clear user feedback', () => {
    fc.assert(fc.property(
      fc.record({
        name: fc.constantFrom('NetworkError', 'ValidationError', 'APIError', 'RateLimitError'),
        message: fc.string({ minLength: 1, maxLength: 100 })
      }),
      (errorData) => {
        const error = new Error(errorData.message);
        error.name = errorData.name;
        
        const userMessage = formatErrorMessage(error);
        
        // User message should be clear and actionable
        expect(userMessage).toBeTruthy();
        expect(userMessage.length).toBeGreaterThan(10);
        expect(userMessage).not.toContain('undefined');
        expect(userMessage).not.toContain('null');
        
        // Should not expose technical details
        expect(userMessage).not.toMatch(/stack|trace|internal/i);
        
        return true;
      }
    ));
  });

  test('inline errors display near form inputs', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 50 }),
      (errorMessage) => {
        const TestForm = () => (
          <div>
            <input data-testid="input" aria-describedby="input-error" />
            <InlineError message={errorMessage} id="input-error" />
          </div>
        );

        const { getByTestId } = render(<TestForm />);
        const input = getByTestId('input');
        const errorElement = screen.getByRole('alert');
        
        // Error should be associated with input
        expect(input.getAttribute('aria-describedby')).toBe('input-error');
        expect(errorElement.id).toBe('input-error');
        expect(errorElement.textContent).toContain(errorMessage);
        
        return true;
      }
    ));
  });
});

// Property 19: Network Error Retry Mechanism
describe('Property 19: Network Error Retry Mechanism', () => {
  test('retry mechanism handles network failures correctly', async () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 5 }),
      fc.integer({ min: 100, max: 1000 }),
      async (maxAttempts, delay) => {
        let attemptCount = 0;
        const mockOperation = vi.fn().mockImplementation(() => {
          attemptCount++;
          if (attemptCount < maxAttempts) {
            throw new Error('Network error');
          }
          return Promise.resolve('success');
        });

        const result = await withRetry(mockOperation, { maxAttempts, delay });
        
        expect(result).toBe('success');
        expect(mockOperation).toHaveBeenCalledTimes(maxAttempts);
        
        return true;
      }
    ));
  });

  test('retry mechanism respects maximum attempts', async () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 3 }),
      async (maxAttempts) => {
        const mockOperation = vi.fn().mockRejectedValue(new Error('Persistent error'));

        await expect(
          withRetry(mockOperation, { maxAttempts, delay: 10 })
        ).rejects.toThrow('Persistent error');
        
        expect(mockOperation).toHaveBeenCalledTimes(maxAttempts);
        
        return true;
      }
    ));
  });

  test('exponential backoff increases delay correctly', async () => {
    const delays: number[] = [];
    const originalSetTimeout = global.setTimeout;
    
    global.setTimeout = vi.fn().mockImplementation((callback, delay) => {
      delays.push(delay);
      return originalSetTimeout(callback, 0);
    });

    const mockOperation = vi.fn()
      .mockRejectedValueOnce(new Error('Error 1'))
      .mockRejectedValueOnce(new Error('Error 2'))
      .mockResolvedValueOnce('success');

    await withRetry(mockOperation, { maxAttempts: 3, delay: 100, backoff: true });
    
    expect(delays).toEqual([100, 200]); // 100 * 2^0, 100 * 2^1
    
    global.setTimeout = originalSetTimeout;
  });
});

// Property 20: Validation Error Proximity
describe('Property 20: Validation Error Proximity', () => {
  test('validation errors appear close to their inputs', () => {
    fc.assert(fc.property(
      fc.record({
        inputId: fc.string({ minLength: 1, maxLength: 20 }),
        errorMessage: fc.string({ minLength: 1, maxLength: 100 })
      }),
      ({ inputId, errorMessage }) => {
        const TestForm = () => (
          <div>
            <label htmlFor={inputId}>Test Input</label>
            <input id={inputId} data-testid="input" aria-describedby={`${inputId}-error`} />
            <InlineError message={errorMessage} id={`${inputId}-error`} />
          </div>
        );

        const { getByTestId, container } = render(<TestForm />);
        const input = getByTestId('input');
        const errorElement = container.querySelector(`#${inputId}-error`);
        
        expect(errorElement).toBeInTheDocument();
        expect(input.getAttribute('aria-describedby')).toBe(`${inputId}-error`);
        
        // Error should be visually close to input (same container)
        const inputRect = input.getBoundingClientRect();
        const errorRect = errorElement!.getBoundingClientRect();
        
        // Error should be below the input (proximity check)
        expect(errorRect.top).toBeGreaterThanOrEqual(inputRect.bottom);
        
        return true;
      }
    ));
  });
});

// Property 21: Error Boundary Recovery
describe('Property 21: Error Boundary Recovery', () => {
  test('error boundary provides recovery options', () => {
    const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div data-testid="success">Success</div>;
    };

    const TestApp = ({ shouldThrow }: { shouldThrow: boolean }) => (
      <ErrorBoundary>
        <ThrowError shouldThrow={shouldThrow} />
      </ErrorBoundary>
    );

    const { rerender, getByTestId, queryByTestId } = render(<TestApp shouldThrow={false} />);
    
    // Initially should render successfully
    expect(getByTestId('success')).toBeInTheDocument();
    
    // Trigger error
    rerender(<TestApp shouldThrow={true} />);
    
    // Should show error boundary
    expect(queryByTestId('success')).not.toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Should have recovery button
    const resetButton = screen.getByTestId('reset-error-boundary');
    expect(resetButton).toBeInTheDocument();
    
    // Recovery should work
    fireEvent.click(resetButton);
    rerender(<TestApp shouldThrow={false} />);
    
    expect(getByTestId('success')).toBeInTheDocument();
  });
});

// Property 22: Error Logging Context
describe('Property 22: Error Logging Context', () => {
  test('error logging includes context without sensitive data', () => {
    fc.assert(fc.property(
      fc.record({
        component: fc.string({ minLength: 1, maxLength: 20 }),
        action: fc.string({ minLength: 1, maxLength: 20 }),
        userId: fc.option(fc.string(), { nil: undefined })
      }),
      ({ component, action, userId }) => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        const error = new Error('Test error');
        const context = createErrorContext(component, action);
        if (userId) {
          context.userId = userId;
        }
        
        logError(error, context);
        
        expect(consoleSpy).toHaveBeenCalled();
        const logCall = consoleSpy.mock.calls[0];
        const logData = logCall[1];
        
        // Should include error details
        expect(logData.message).toBe('Test error');
        expect(logData.name).toBe('Error');
        
        // Should include context
        expect(logData.context.component).toBe(component);
        expect(logData.context.action).toBe(action);
        expect(logData.context.timestamp).toBeDefined();
        expect(logData.context.userAgent).toBeDefined();
        expect(logData.context.url).toBeDefined();
        
        // Should redact sensitive data
        if (userId) {
          expect(logData.context.userId).toBe('[REDACTED]');
        }
        
        consoleSpy.mockRestore();
        return true;
      }
    ));
  });

  test('error context creation excludes sensitive information', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 20 }),
      fc.string({ minLength: 1, maxLength: 20 }),
      (component, action) => {
        const context = createErrorContext(component, action);
        
        expect(context.component).toBe(component);
        expect(context.action).toBe(action);
        expect(context.timestamp).toBeTypeOf('number');
        expect(context.userAgent).toBeTypeOf('string');
        expect(context.url).toBeTypeOf('string');
        
        // Should not include sensitive data by default
        expect(context.userId).toBeUndefined();
        
        return true;
      }
    ));
  });
});