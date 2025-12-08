import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, RefreshCw, X } from 'lucide-react';
import { getErrorDetails, shouldAutoRetry } from '../utils/userFriendlyErrors';

interface ErrorToastProps {
  error: Error | string;
  onRetry?: () => void;
  onDismiss: () => void;
  autoRetryDelay?: number;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ 
  error, 
  onRetry, 
  onDismiss,
  autoRetryDelay = 3000 
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const errorDetails = getErrorDetails(error);
  const canAutoRetry = shouldAutoRetry(error) && onRetry && retryCount < 3;

  useEffect(() => {
    if (canAutoRetry && !isRetrying) {
      const timer = setTimeout(() => {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
        onRetry?.();
        setTimeout(() => setIsRetrying(false), 1000);
      }, autoRetryDelay);
      
      return () => clearTimeout(timer);
    }
  }, [canAutoRetry, autoRetryDelay, onRetry, isRetrying]);

  const handleManualRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    onRetry?.();
    setTimeout(() => setIsRetrying(false), 1000);
  };

  const severityConfig = {
    info: { icon: Info, color: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    warning: { icon: AlertCircle, color: 'yellow', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    error: { icon: AlertCircle, color: 'red', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    critical: { icon: AlertCircle, color: 'red', bg: 'bg-red-500/20', border: 'border-red-500/50' }
  };

  const config = severityConfig[errorDetails.severity];
  const Icon = config.icon;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 w-96 ${config.bg} border ${config.border} rounded-xl shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-4 fade-in duration-300`}
      role="alert"
      aria-live="assertive"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-${config.color}-500/20 flex items-center justify-center`}>
            <Icon className={`w-4 h-4 text-${config.color}-400`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white mb-1">
              {errorDetails.title}
            </h4>
            <p className="text-xs text-slate-300 mb-2">
              {errorDetails.message}
            </p>
            <p className="text-xs text-slate-400">
              {errorDetails.action}
            </p>

            {canAutoRetry && (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>
                  {isRetrying ? 'Retrying...' : `Auto-retry in ${Math.ceil(autoRetryDelay / 1000)}s (${retryCount + 1}/3)`}
                </span>
              </div>
            )}

            {errorDetails.recoverySteps && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {showDetails ? 'Hide' : 'Show'} recovery steps
              </button>
            )}

            {showDetails && errorDetails.recoverySteps && (
              <ul className="mt-2 space-y-1 text-xs text-slate-400">
                {errorDetails.recoverySteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-slate-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorDetails.canRetry && onRetry && !canAutoRetry && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleManualRetry}
              disabled={isRetrying}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-xs font-medium"
            >
              <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Manager Hook
export const useErrorToast = () => {
  const [error, setError] = useState<Error | string | null>(null);
  const [retryCallback, setRetryCallback] = useState<(() => void) | undefined>();

  const showError = (err: Error | string, onRetry?: () => void) => {
    setError(err);
    setRetryCallback(() => onRetry);
  };

  const dismissError = () => {
    setError(null);
    setRetryCallback(undefined);
  };

  const ErrorToastComponent = error ? (
    <ErrorToast 
      error={error} 
      onRetry={retryCallback} 
      onDismiss={dismissError}
    />
  ) : null;

  return { showError, dismissError, ErrorToastComponent };
};
