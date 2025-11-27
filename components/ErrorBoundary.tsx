import React, { ErrorInfo, ReactNode } from 'react';
import { FullPageError } from './ErrorComponents';
import { logger } from '../utils/errorLogging';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.log(error, { componentStack: errorInfo.componentStack });
  }

  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      return <FullPageError error={this.state.error} resetErrorBoundary={this.resetErrorBoundary} />;
    }

    return this.props.children;
  }
}