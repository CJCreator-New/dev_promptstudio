import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FullPageError } from '../components/ErrorComponents';
import React from 'react';

const ThrowError: React.FC = () => {
  throw new Error('Test error message');
};

vi.mock('../utils/errorLogging', () => ({
  logger: {
    error: vi.fn()
  }
}));

describe('Error Boundary Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Error Catching Behavior', () => {
    it('should catch errors and update state', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should generate unique error IDs', () => {
      const { container: container1 } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const errorId1 = screen.getByText(/error id:/i).textContent;

      const { container: container2 } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const errorId2 = screen.getAllByText(/error id:/i)[1].textContent;

      expect(errorId1).not.toBe(errorId2);
    });

    it('should render children when no error', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal content')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Fallback UI Rendering', () => {
    it('should render FullPageError component', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/test error message/i)).toBeInTheDocument();
    });

    it('should show both reset and reload buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/continue working/i)).toBeInTheDocument();
      expect(screen.getByText(/reload page/i)).toBeInTheDocument();
    });

    it('should toggle technical details', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.queryByText(/stack trace/i)).not.toBeInTheDocument();

      const showButton = screen.getByText(/show technical details/i);
      fireEvent.click(showButton);

      expect(screen.getByText(/stack trace/i)).toBeInTheDocument();
      expect(screen.getByText(/hide technical details/i)).toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset error state when reset button clicked', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const resetButton = screen.getByTestId('reset-error-boundary');
      fireEvent.click(resetButton);

      rerender(
        <ErrorBoundary>
          <div>Recovered</div>
        </ErrorBoundary>
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should preserve and restore localStorage on reset', () => {
      localStorage.setItem('draft', 'important data');
      
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      localStorage.clear();

      const resetButton = screen.getByTestId('reset-error-boundary');
      fireEvent.click(resetButton);

      expect(localStorage.getItem('draft')).toBe('important data');
    });
  });

  describe('FullPageError Component', () => {
    it('should display error message', () => {
      const error = new Error('Custom error message');
      const reset = vi.fn();

      render(<FullPageError error={error} resetErrorBoundary={reset} />);

      expect(screen.getByText(/custom error message/i)).toBeInTheDocument();
    });

    it('should call reset function when button clicked', () => {
      const error = new Error('Test');
      const reset = vi.fn();

      render(<FullPageError error={error} resetErrorBoundary={reset} />);

      const resetButton = screen.getByTestId('reset-error-boundary');
      fireEvent.click(resetButton);

      expect(reset).toHaveBeenCalledTimes(1);
    });

    it('should show error ID when provided', () => {
      const error = new Error('Test');
      const reset = vi.fn();
      const errorId = 'error_123456';

      render(<FullPageError error={error} errorId={errorId} resetErrorBoundary={reset} />);

      expect(screen.getByText(errorId)).toBeInTheDocument();
    });

    it('should display component stack when provided', () => {
      const error = new Error('Test');
      const reset = vi.fn();
      const errorInfo = {
        componentStack: '\n    at Component\n    at Parent'
      };

      render(<FullPageError error={error} errorInfo={errorInfo} resetErrorBoundary={reset} />);

      const showButton = screen.getByText(/show technical details/i);
      fireEvent.click(showButton);

      expect(screen.getByText(/component stack/i)).toBeInTheDocument();
    });
  });

  describe('State Preservation', () => {
    it('should backup state to sessionStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const preserved = sessionStorage.getItem('error_preserved_state');
      expect(preserved).toBeTruthy();

      if (preserved) {
        const data = JSON.parse(preserved);
        expect(data.localStorage.key1).toBe('value1');
        expect(data.localStorage.key2).toBe('value2');
        expect(data.timestamp).toBeDefined();
      }
    });

    it('should handle preservation errors gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });

      // Should not crash when preservation fails
      expect(() => {
        render(
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>
        );
      }).not.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('Custom Error Handler', () => {
    it('should call onError callback when provided', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(onError.mock.calls[0][1]).toHaveProperty('componentStack');
    });

    it('should use custom fallback when provided', () => {
      const customFallback = (error: Error, reset: () => void) => (
        <div data-testid="custom-fallback">
          Custom: {error.message}
          <button onClick={reset}>Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText(/custom: test error message/i)).toBeInTheDocument();
    });
  });
});