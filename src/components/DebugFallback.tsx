import React from 'react';

interface DebugFallbackProps {
  error: Error;
  reset: () => void;
}

export const DebugFallback: React.FC<DebugFallbackProps> = ({ error, reset }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-800 rounded-lg p-6 border border-red-500">
        <h1 className="text-2xl font-bold text-red-400 mb-4">App Crashed</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Error:</h2>
          <p className="text-red-300 bg-slate-900 p-3 rounded font-mono text-sm">
            {error.message}
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Stack Trace:</h2>
          <pre className="text-xs text-slate-300 bg-slate-900 p-3 rounded overflow-auto max-h-40">
            {error.stack}
          </pre>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};