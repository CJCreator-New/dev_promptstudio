import React, { ErrorInfo, ReactNode } from 'react';
import { FullPageError } from './ErrorComponents';
import { logger } from '../utils/errorLogging';

interface Props {
  children?: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  private preservedState: any = null;

  public state: State = {
    hasError: false,
    error: null,
    errorId: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Preserve user data before error
    this.preserveUserData();

    // Log error with full stack trace and context
    logger.error(error, {
      context: 'ErrorBoundary',
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
    });

    // Store error info for display
    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private preserveUserData = () => {
    try {
      // Preserve localStorage data
      const preservedData = {
        localStorage: { ...localStorage },
        timestamp: Date.now(),
      };
      this.preservedState = preservedData;
      
      // Store in sessionStorage as backup
      sessionStorage.setItem('error_preserved_state', JSON.stringify(preservedData));
    } catch (e) {
      console.warn('Failed to preserve user data:', e);
    }
  };

  public resetErrorBoundary = () => {
    // Restore preserved state if available
    if (this.preservedState) {
      try {
        Object.keys(this.preservedState.localStorage).forEach(key => {
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, this.preservedState.localStorage[key]);
          }
        });
      } catch (e) {
        console.warn('Failed to restore user data:', e);
      }
    }

    this.setState({ 
      hasError: false, 
      error: null, 
      errorId: null,
      errorInfo: null 
    });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetErrorBoundary);
      }

      return (
        <FullPageError 
          error={this.state.error} 
          errorId={this.state.errorId}
          errorInfo={this.state.errorInfo}
          resetErrorBoundary={this.resetErrorBoundary} 
        />
      );
    }

    return this.props.children;
  }
}