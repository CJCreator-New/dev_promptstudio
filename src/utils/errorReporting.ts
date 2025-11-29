import { isProduction } from './environment';

export const reportError = (error: Error, context?: Record<string, any>) => {
  if (isProduction) {
    console.error('[Production Error]', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
  } else {
    console.error('[Dev Error]', error, context);
  }
};

export const getUserFriendlyMessage = (error: any): string => {
  if (error.message?.includes('API key')) {
    return 'Please check your API key configuration';
  }
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return 'Network error. Please check your connection';
  }
  if (error.message?.includes('429') || error.message?.includes('quota')) {
    return 'Rate limit exceeded. Please try again later';
  }
  return 'An unexpected error occurred. Please try again';
};
