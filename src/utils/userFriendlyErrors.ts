/**
 * User-friendly error messages and recovery guidance
 */

export interface UserFriendlyError {
  title: string;
  message: string;
  action: string;
  recoverySteps?: string[];
  canRetry: boolean;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export const getErrorDetails = (error: Error | string): UserFriendlyError => {
  const errorMsg = typeof error === 'string' ? error : error.message.toLowerCase();

  // Network errors
  if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('offline')) {
    return {
      title: 'Connection Issue',
      message: "We're having trouble connecting. Your work is saved locally.",
      action: 'Check your internet connection and try again',
      recoverySteps: [
        'Check your internet connection',
        'Try refreshing the page',
        'Your work is automatically saved and will sync when you\'re back online'
      ],
      canRetry: true,
      severity: 'warning'
    };
  }

  // Rate limiting
  if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
    return {
      title: 'Taking a Quick Break',
      message: "You're working fast! Let's pause for a moment.",
      action: 'Wait 30 seconds and try again',
      recoverySteps: [
        'Wait about 30 seconds',
        'We\'ll automatically retry for you',
        'Consider upgrading for higher limits'
      ],
      canRetry: true,
      severity: 'info'
    };
  }

  // API key issues
  if (errorMsg.includes('api key') || errorMsg.includes('unauthorized') || errorMsg.includes('401')) {
    return {
      title: 'API Key Needed',
      message: 'To use AI features, please add your API key.',
      action: 'Add your API key in Settings',
      recoverySteps: [
        'Click the Settings icon',
        'Add your Gemini, OpenAI, or Anthropic API key',
        'Save and try again'
      ],
      canRetry: false,
      severity: 'warning'
    };
  }

  // Server errors
  if (errorMsg.includes('500') || errorMsg.includes('503') || errorMsg.includes('server')) {
    return {
      title: 'Service Temporarily Unavailable',
      message: "The AI service is taking a short break. We'll retry automatically.",
      action: 'Please wait a moment',
      recoverySteps: [
        'We\'re automatically retrying',
        'This usually resolves in a few seconds',
        'Your work is saved'
      ],
      canRetry: true,
      severity: 'warning'
    };
  }

  // Validation errors
  if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
    return {
      title: 'Input Needs Adjustment',
      message: 'Please check your input and try again.',
      action: 'Review the highlighted fields',
      recoverySteps: [
        'Check for any highlighted fields',
        'Make sure all required fields are filled',
        'Follow the format examples shown'
      ],
      canRetry: false,
      severity: 'info'
    };
  }

  // Storage errors
  if (errorMsg.includes('storage') || errorMsg.includes('quota')) {
    return {
      title: 'Storage Space Low',
      message: 'Your browser storage is almost full.',
      action: 'Clear some old data',
      recoverySteps: [
        'Delete old prompts you no longer need',
        'Clear browser cache',
        'Export important data as backup'
      ],
      canRetry: false,
      severity: 'warning'
    };
  }

  // Default error
  return {
    title: 'Something Unexpected Happened',
    message: "Don't worry - your work is safe and we're here to help.",
    action: 'Try again or refresh the page',
    recoverySteps: [
      'Click "Try Again" below',
      'If that doesn\'t work, refresh the page',
      'Your work is automatically saved'
    ],
    canRetry: true,
    severity: 'error'
  };
};

export const shouldAutoRetry = (error: Error | string): boolean => {
  const errorMsg = typeof error === 'string' ? error : error.message.toLowerCase();
  return (
    errorMsg.includes('network') ||
    errorMsg.includes('timeout') ||
    errorMsg.includes('429') ||
    errorMsg.includes('500') ||
    errorMsg.includes('503')
  );
};
