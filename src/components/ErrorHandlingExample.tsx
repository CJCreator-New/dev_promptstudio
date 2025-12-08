/**
 * Example usage of the error handling system
 * This file demonstrates how to integrate all error handling components
 */

import React, { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { useErrorToast } from './ErrorToast';
import { OfflineIndicator } from './OfflineIndicator';
import { FormField, validationRules, formatMasks } from './FormField';
import { withRetry, isRetryableError } from '../utils/errorHandling';

export const ErrorHandlingExample: React.FC = () => {
  const { showError, ErrorToastComponent } = useErrorToast();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Example: API call with automatic retry
  const handleSubmit = async () => {
    try {
      await withRetry(
        async () => {
          const response = await fetch('/api/submit', {
            method: 'POST',
            body: JSON.stringify({ email, phone })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          return response.json();
        },
        {
          maxAttempts: 3,
          delay: 1000,
          backoff: true,
          shouldRetry: isRetryableError,
          onRetry: (attempt) => {
            console.log(`Retrying... Attempt ${attempt}`);
          }
        }
      );
      
      // Success handling
      console.log('Submitted successfully!');
      
    } catch (error) {
      // Show user-friendly error toast with retry option
      showError(error as Error, handleSubmit);
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">
          Error Handling Demo
        </h1>

        {/* Offline Indicator */}
        <OfflineIndicator />

        {/* Form with inline validation */}
        <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
            validationRules={[validationRules.email]}
            helpText="We'll never share your email with anyone"
            autoComplete="email"
          />

          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="(555) 123-4567"
            formatMask={formatMasks.phone}
            helpText="Format: (555) 123-4567"
            maxLength={14}
          />

          <button
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium"
          >
            Submit
          </button>
        </div>

        {/* Error Toast (shown when errors occur) */}
        {ErrorToastComponent}

        {/* Example error triggers for testing */}
        <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            Test Error Scenarios:
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => showError(new Error('Network error'), handleSubmit)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
            >
              Network Error
            </button>
            <button
              onClick={() => showError(new Error('429 Rate limit exceeded'))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
            >
              Rate Limit
            </button>
            <button
              onClick={() => showError(new Error('401 Unauthorized - API key missing'))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
            >
              API Key Error
            </button>
            <button
              onClick={() => showError(new Error('500 Internal server error'))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
            >
              Server Error
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

/**
 * Usage in your app:
 * 
 * 1. Wrap your app with ErrorBoundary:
 *    <ErrorBoundary>
 *      <App />
 *    </ErrorBoundary>
 * 
 * 2. Add OfflineIndicator at the root level:
 *    <OfflineIndicator />
 * 
 * 3. Use useErrorToast hook for runtime errors:
 *    const { showError, ErrorToastComponent } = useErrorToast();
 *    // Show error: showError(error, retryCallback)
 *    // Render: {ErrorToastComponent}
 * 
 * 4. Use FormField for forms with validation:
 *    <FormField
 *      label="Email"
 *      value={email}
 *      onChange={setEmail}
 *      validationRules={[validationRules.email]}
 *    />
 * 
 * 5. Use withRetry for API calls:
 *    await withRetry(apiCall, { maxAttempts: 3, backoff: true })
 */
