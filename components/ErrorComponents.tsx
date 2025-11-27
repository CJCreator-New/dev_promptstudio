import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

// --- Inline Input Error ---
interface InlineErrorProps {
  message?: string | null;
}

export const InlineError: React.FC<InlineErrorProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-2 text-red-400 text-xs animate-in slide-in-from-top-1 fade-in duration-200" role="alert">
      <AlertTriangle className="w-3.5 h-3.5" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

// --- Full Page Error (Boundary Fallback) ---
interface FullPageErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const FullPageError: React.FC<FullPageErrorProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-slate-400 text-sm mb-6">
          DevPrompt Studio encountered an unexpected error. We've logged this issue.
        </p>
        
        <div className="bg-slate-950 rounded-lg p-4 mb-6 border border-slate-800 text-left overflow-auto max-h-32">
          <code className="text-xs font-mono text-red-300 break-all">
            {error.message}
          </code>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          <button
            onClick={resetErrorBoundary}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};