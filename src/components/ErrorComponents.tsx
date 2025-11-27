import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

// --- Inline Input Error ---
interface InlineErrorProps {
  message?: string | null;
  id?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({ message, id }) => {
  if (!message) return null;
  return (
    <div 
      className="flex items-center gap-1.5 mt-2 text-red-400 text-xs animate-in slide-in-from-top-1 fade-in duration-200" 
      role="alert"
      id={id}
      aria-live="polite"
    >
      <AlertTriangle className="w-3.5 h-3.5" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

// --- Full Page Error (Boundary Fallback) ---
interface FullPageErrorProps {
  error: Error;
  errorId?: string | null;
  errorInfo?: React.ErrorInfo | null;
  resetErrorBoundary: () => void;
}

export const FullPageError: React.FC<FullPageErrorProps> = ({ error, errorId, errorInfo, resetErrorBoundary }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  const getUserFriendlyMessage = (error: Error) => {
    if (error.message.includes('fetch')) return 'Network connection issue. Please check your internet connection.';
    if (error.message.includes('undefined')) return 'A component failed to load properly.';
    return 'An unexpected error occurred. Your work has been preserved.';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" role="alert" aria-live="assertive">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-slate-400 text-sm">
              {getUserFriendlyMessage(error)}
            </p>
            {errorId && (
              <p className="mt-2 text-xs text-slate-500">
                Error ID: <code className="bg-slate-950 px-2 py-0.5 rounded">{errorId}</code>
              </p>
            )}
          </div>
        </div>
        
        <div className="bg-slate-950 rounded-lg p-4 mb-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Error Details</span>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </button>
          </div>
          <code className="text-xs font-mono text-red-300 block break-all">
            {error.message}
          </code>
          
          {showDetails && error.stack && (
            <details className="mt-3">
              <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400 mb-2">Stack Trace</summary>
              <pre className="text-[10px] font-mono text-slate-400 overflow-auto max-h-48 p-2 bg-slate-900 rounded">
                {error.stack}
              </pre>
            </details>
          )}
          
          {showDetails && errorInfo?.componentStack && (
            <details className="mt-3">
              <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400 mb-2">Component Stack</summary>
              <pre className="text-[10px] font-mono text-slate-400 overflow-auto max-h-48 p-2 bg-slate-900 rounded">
                {errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
          <p className="text-xs text-blue-300">
            ✓ Your work has been automatically saved and will be restored when you continue.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetErrorBoundary}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium focus-ring"
            data-testid="reset-error-boundary"
          >
            <Home className="w-4 h-4" />
            Continue Working
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm font-medium focus-ring"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};