import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import React from 'react';

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock logger
vi.mock('../utils/errorLogging', () => ({
  logger: {
    error: vi.fn()
  }
}));

describe('Error Boundary Properties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console errors in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Property 37: Error Boundary Catch', () => {
    it('should catch all component errors', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Should show error UI instead of crashing
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should catch errors from nested components', () => {
      const NestedComponent = () => (
        <div>
          <div>
            <ThrowError />
          </div>
        </div>
      );

      render(
        <ErrorBoundary>
          <NestedComponent />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should not catch errors outside boundary', () => {
      const { container } = render(
        <div>
          <ErrorBoundary>
            <div>Safe content</div>
          </ErrorBoundary>
        </div>
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Safe content')).toBeInTheDocument();
    });
  });

  describe('Property 38: Error Fallback UI', () => {
    it('should display clear error message', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/test error/i)).toBeInTheDocument();
    });

    it('should show error ID for tracking', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/error id:/i)).toBeInTheDocument();
    });

    it('should provide user-friendly error messages', () => {
      const NetworkError = () => {
        throw new Error('fetch failed');
      };

      render(
        <ErrorBoundary>
          <NetworkError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/network connection issue/i)).toBeInTheDocument();
    });

    it('should show data preservation message', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/your work has been automatically saved/i)).toBeInTheDocument();
    });
  });

  describe('Property 39: Error Logging', () => {
    it('should log errors with stack traces', async () => {
      const { logger } = await import('../utils/errorLogging');
      
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(logger.error).toHaveBeenCalled();
      const logCall = vi.mocked(logger.error).mock.calls[0];
      expect(logCall[0]).toBeInstanceOf(Error);
      expect(logCall[1]).toHaveProperty('context', 'ErrorBoundary');
      expect(logCall[1]).toHaveProperty('componentStack');
    });

    it('should include error context in logs', async () => {
      const { logger } = await import('../utils/errorLogging');
      
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const logCall = vi.mocked(logger.error).mock.calls[0];
      expect(logCall[1]).toHaveProperty('errorId');
      expect(logCall[1]).toHaveProperty('timestamp');
    });

    it('should display stack trace when requested', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const showDetailsButton = screen.getByText(/show technical details/i);
      fireEvent.click(showDetailsButton);

      expect(screen.getByText(/stack trace/i)).toBeInTheDocument();
    });
  });

  describe('Property 40: Error Boundary Reset', () => {
    it('should provide reset functionality', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const resetButton = screen.getByTestId('reset-error-boundary');
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toHaveTextContent(/continue working/i);
    });

    it('should clear error state on reset', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();

      const resetButton = screen.getByTestId('reset-error-boundary');
      fireEvent.click(resetButton);

      // After reset, should try to render children again
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should allow custom fallback with reset', () => {
      const customFallback = (error: Error, reset: () => void) => (
        <div>
          <p>Custom error: {error.message}</p>
          <button onClick={reset}>Custom Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/custom error/i)).toBeInTheDocument();
      expect(screen.getByText(/custom reset/i)).toBeInTheDocument();
    });
  });

  describe('Property 41: State Preservation on Error', () => {
    it('should preserve localStorage data when error occurs', () => {
      localStorage.setItem('test-key', 'test-value');
      
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Data should still be in localStorage
      expect(localStorage.getItem('test-key')).toBe('test-value');
    });

    it('should backup state to sessionStorage', () => {
      localStorage.setItem('important-data', 'user-work');
      
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const preserved = sessionStorage.getItem('error_preserved_state');
      expect(preserved).toBeTruthy();
      
      if (preserved) {
        const data = JSON.parse(preserved);
        expect(data.localStorage['important-data']).toBe('user-work');
      }
    });

    it('should restore preserved state on reset', () => {
      localStorage.setItem('user-input', 'preserved-content');
      
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Clear localStorage to simulate data loss
      localStorage.removeItem('user-input');

      const resetButton = screen.getByTestId('reset-error-boundary');
      fireEvent.click(resetButton);

      // Should restore from preserved state
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(localStorage.getItem('user-input')).toBe('preserved-content');
    });

    it('should call custom error handler if provided', () => {
      const onError = vi.fn();
      
      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });
});