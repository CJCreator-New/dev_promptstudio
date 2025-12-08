# Error Handling System

A comprehensive, user-friendly error handling system with automatic retry, offline support, and graceful degradation.

## Features

### 🎯 User-Friendly Error Messages
- Clear, jargon-free language
- Specific guidance on how to fix issues
- Empathetic tone that doesn't blame users
- Context-aware error details

### 🔄 Automatic Retry Mechanisms
- Smart exponential backoff
- Configurable retry attempts
- Auto-retry for transient errors (network, rate limits, server errors)
- Manual retry option for users

### 📡 Offline Support
- Offline detection and notification
- Local data preservation
- Background sync when reconnected
- Error queuing for later reporting

### 🛡️ Error Prevention
- Inline form validation
- Format guidance and masking
- Validation rules shown upfront
- Real-time feedback

### 🎨 Components

#### ErrorBoundary
Catches React errors and preserves user state.

```tsx
import { ErrorBoundary } from './components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Features:**
- Preserves localStorage data
- User-friendly error display
- Recovery steps
- State export for backup

#### ErrorToast
Runtime error notifications with auto-retry.

```tsx
import { useErrorToast } from './components/ErrorToast';

const { showError, ErrorToastComponent } = useErrorToast();

// Show error with retry callback
showError(error, () => retryOperation());

// Render toast
{ErrorToastComponent}
```

**Features:**
- Auto-retry for transient errors (3 attempts)
- Manual retry button
- Recovery steps
- Dismissible
- Severity-based styling

#### OfflineIndicator
Shows connection status to users.

```tsx
import { OfflineIndicator } from './components/OfflineIndicator';

<OfflineIndicator />
```

**Features:**
- Automatic online/offline detection
- Graceful messaging
- Auto-hide when online
- Reconnection notification

#### FormField
Form input with inline validation.

```tsx
import { FormField, validationRules, formatMasks } from './components/FormField';

<FormField
  label="Email"
  name="email"
  value={email}
  onChange={setEmail}
  required
  validationRules={[validationRules.email]}
  helpText="We'll never share your email"
/>
```

**Features:**
- Real-time validation
- Format masking (phone, credit card)
- Helpful error messages
- Accessibility support
- Character counter

#### NotFoundPage
Friendly 404 page with recovery options.

```tsx
import { NotFoundPage } from './components/NotFoundPage';

<Route path="*" element={<NotFoundPage />} />
```

**Features:**
- Clear messaging
- Navigation options
- Quick links
- Go back functionality

### 🔧 Utilities

#### withRetry
Automatic retry for async operations.

```tsx
import { withRetry, isRetryableError } from './utils/errorHandling';

await withRetry(
  async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  {
    maxAttempts: 3,
    delay: 1000,
    backoff: true,
    shouldRetry: isRetryableError,
    onRetry: (attempt) => console.log(`Retry ${attempt}`)
  }
);
```

#### getErrorDetails
Get user-friendly error information.

```tsx
import { getErrorDetails } from './utils/userFriendlyErrors';

const errorDetails = getErrorDetails(error);
// Returns: { title, message, action, recoverySteps, canRetry, severity }
```

#### Error Logging
Automatic error logging with offline queuing.

```tsx
import { logError, createErrorContext } from './utils/errorHandling';

logError(error, createErrorContext('ComponentName', 'actionName'));
```

## Error Types & Messages

| Error Type | User Message | Auto-Retry | Recovery Steps |
|------------|--------------|------------|----------------|
| Network | "We're having trouble connecting. Your work is saved locally." | ✅ Yes | Check connection, refresh |
| Rate Limit | "You're working fast! Let's pause for a moment (30 seconds)." | ✅ Yes | Wait 30s, auto-retry |
| API Key | "Please add your API key in Settings to use AI features." | ❌ No | Go to Settings, add key |
| Server Error | "The service is taking a short break. We'll retry automatically." | ✅ Yes | Auto-retry, wait |
| Validation | "Please check your input and try again." | ❌ No | Fix highlighted fields |
| Storage | "Browser storage is almost full." | ❌ No | Clear old data |

## Best Practices

### 1. Always Use Error Boundaries
```tsx
// Root level
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Feature level
<ErrorBoundary fallback={(error, reset) => <CustomError />}>
  <FeatureComponent />
</ErrorBoundary>
```

### 2. Show Errors with Context
```tsx
try {
  await savePrompt(data);
} catch (error) {
  showError(error, () => savePrompt(data)); // Include retry callback
}
```

### 3. Use Validation Upfront
```tsx
<FormField
  validationRules={[
    validationRules.email,
    validationRules.minLength(5)
  ]}
  helpText="Format: user@example.com"
/>
```

### 4. Handle Offline Gracefully
```tsx
import { isOnline, waitForOnline } from './utils/errorHandling';

if (!isOnline()) {
  // Queue for later
  queueForSync(data);
  return;
}

// Or wait for connection
await waitForOnline();
await syncData();
```

### 5. Provide Multiple Recovery Paths
```tsx
<FullPageError>
  <button onClick={reset}>Continue Working</button>
  <button onClick={reload}>Reload Page</button>
  <button onClick={exportBackup}>Export Backup</button>
</FullPageError>
```

## Testing

### Test Error Scenarios
```tsx
// Network error
showError(new Error('Network error'));

// Rate limit
showError(new Error('429 Rate limit exceeded'));

// API key
showError(new Error('401 Unauthorized'));

// Server error
showError(new Error('500 Internal server error'));
```

### Test Offline Mode
```tsx
// Simulate offline
window.dispatchEvent(new Event('offline'));

// Simulate online
window.dispatchEvent(new Event('online'));
```

## Accessibility

All error components include:
- ARIA labels and roles
- Live regions for dynamic updates
- Keyboard navigation
- Screen reader support
- Focus management

## Analytics

Errors are automatically tracked with:
- Error type and message
- Component context
- User action
- Timestamp
- Online/offline status
- Retry attempts

## Migration Guide

### From Old Error Handling
```tsx
// Before
try {
  await apiCall();
} catch (error) {
  alert(error.message); // ❌ Bad UX
}

// After
try {
  await withRetry(apiCall, { maxAttempts: 3 });
} catch (error) {
  showError(error, apiCall); // ✅ User-friendly with retry
}
```

### From Generic Messages
```tsx
// Before
"An error occurred" // ❌ Not helpful

// After
getErrorDetails(error) // ✅ Specific, actionable guidance
```

## Support

For issues or questions:
1. Check error ID in console
2. Review recovery steps
3. Export state backup
4. Report with error ID

## Future Enhancements

- [ ] Error analytics dashboard
- [ ] Custom error templates
- [ ] Multi-language support
- [ ] Error prediction
- [ ] Smart error grouping
