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
  if (error.name === 'NetworkError' || error.message.includes('fetch')) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  
  if (error.name === 'ValidationError') {
    return error.message;
  }
  
  if (error.message.includes('429')) {
    return 'Too many requests. Please wait a moment before trying again.';
  }
  
  if (error.message.includes('500') || error.message.includes('503')) {
    return 'Service temporarily unavailable. Please try again in a few moments.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Retry mechanism for network operations
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = { maxAttempts: 3, delay: 1000 }
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === options.maxAttempts) {
        throw lastError;
      }
      
      const delay = options.backoff 
        ? options.delay * Math.pow(2, attempt - 1)
        : options.delay;
        
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
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
  };
  
  console.error('[Error Log]', errorLog);
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorService(errorLog);
  }
};