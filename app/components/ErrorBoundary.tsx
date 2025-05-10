'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  maxRetries?: number;
  resetTimeout?: number;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0
  };

  private resetTimeoutId?: NodeJS.Timeout;

  public static defaultProps = {
    maxRetries: 3,
    resetTimeout: 5000 // 5 seconds
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private handleRetry = () => {
    const { maxRetries = 3, resetTimeout = 5000 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      // Auto-reset after timeout
      this.resetTimeoutId = setTimeout(() => {
        this.setState({
          hasError: false,
          retryCount: 0
        });
      }, resetTimeout);
    }
  };

  public render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback, maxRetries = 3 } = this.props;

    if (hasError) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {error?.message || 'An unexpected error occurred'}
            </p>
            {retryCount < maxRetries ? (
              <button
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry ({maxRetries - retryCount} attempts remaining)
              </button>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                Maximum retry attempts reached. Please refresh the page.
              </p>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
} 