/**
 * Error handling utilities
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

export interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff?: boolean;
  onRetry?: (attempt: number) => void;
  shouldRetry?: (error: Error) => boolean;
}

/**
 * Create error context without sensitive data
 */
export const createErrorContext = (component?: string, action?: string): ErrorContext => ({
  component,
  action,
  timestamp: Date.now(),
  userAgent: navigator.userAgent,
  url: window.location.href,
});

/**
 * Format error message for user display
 */
export const formatErrorMessage = (error: Error): string => {
  const msg = error.message.toLowerCase();
  
  if (error.name === 'NetworkError' || msg.includes('fetch') || msg.includes('network')) {
    return "We're having trouble connecting. Your work is saved locally.";
  }
  
  if (error.name === 'ValidationError') {
    return error.message;
  }
  
  if (msg.includes('429') || msg.includes('rate limit')) {
    return "You're working fast! Let's pause for a moment (30 seconds).";
  }
  
  if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('api key')) {
    return 'Please add your API key in Settings to use AI features.';
  }
  
  if (msg.includes('500') || msg.includes('503') || msg.includes('server')) {
    return "The service is taking a short break. We'll retry automatically.";
  }
  
  if (msg.includes('storage') || msg.includes('quota')) {
    return 'Browser storage is almost full. Consider clearing old data.';
  }
  
  return "Something unexpected happened. Don't worry - your work is safe.";
};

/**
 * Retry mechanism for network operations with smart backoff
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = { maxAttempts: 3, delay: 1000, backoff: true }
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if we should retry this error
      if (options.shouldRetry && !options.shouldRetry(lastError)) {
        throw lastError;
      }
      
      // Don't retry on last attempt
      if (attempt === options.maxAttempts) {
        throw lastError;
      }
      
      // Notify about retry
      options.onRetry?.(attempt);
      
      // Calculate delay with exponential backoff
      const delay = options.backoff 
        ? options.delay * Math.pow(2, attempt - 1)
        : options.delay;
        
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: Error): boolean => {
  const msg = error.message.toLowerCase();
  return (
    msg.includes('network') ||
    msg.includes('timeout') ||
    msg.includes('429') ||
    msg.includes('500') ||
    msg.includes('503') ||
    msg.includes('fetch')
  );
};

/**
 * Check if user is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Wait for online connection
 */
export const waitForOnline = (): Promise<void> => {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve();
      return;
    }
    
    const handleOnline = () => {
      window.removeEventListener('online', handleOnline);
      resolve();
    };
    
    window.addEventListener('online', handleOnline);
  });
};

/**
 * Log error with context (no sensitive data)
 */
export const logError = (error: Error, context: ErrorContext): void => {
  const errorLog = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    context: {
      ...context,
      // Ensure no sensitive data is logged
      userId: context.userId ? '[REDACTED]' : undefined,
    },
    isOnline: navigator.onLine,
    timestamp: new Date().toISOString(),
  };
  
  console.error('[Error Log]', errorLog);
  
  // Store error for offline reporting
  try {
    const errors = JSON.parse(localStorage.getItem('pending_errors') || '[]');
    errors.push(errorLog);
    // Keep only last 10 errors
    localStorage.setItem('pending_errors', JSON.stringify(errors.slice(-10)));
  } catch (e) {
    // Ignore storage errors
  }
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production' && navigator.onLine) {
    // Example: sendToErrorService(errorLog);
  }
};

/**
 * Sync pending errors when online
 */
export const syncPendingErrors = async (): Promise<void> => {
  if (!navigator.onLine) return;
  
  try {
    const errors = JSON.parse(localStorage.getItem('pending_errors') || '[]');
    if (errors.length === 0) return;
    
    // Send to error tracking service
    // await sendToErrorService(errors);
    
    // Clear pending errors after successful sync
    localStorage.removeItem('pending_errors');
  } catch (e) {
    console.warn('Failed to sync pending errors:', e);
  }
};

// Auto-sync errors when coming online
if (typeof window !== 'undefined') {
  window.addEventListener('online', syncPendingErrors);
}