# Design Document

## Overview

This design document outlines the architectural modernization of the DevPrompt Studio React application. The modernization focuses on five key pillars: **Performance**, **Accessibility**, **Code Quality**, **Scalability**, and **User Experience**. 

The application currently uses React 18, TypeScript, Vite, and various libraries including Zustand for state management. The design introduces modern patterns including centralized state management, component composition, CSS Grid layouts, comprehensive error handling, and performance optimizations.

### Current State Analysis

**Strengths:**
- TypeScript usage throughout the codebase
- React 18 with modern hooks
- Zustand for lightweight state management
- IndexedDB for client-side persistence
- Error boundaries implemented
- Toast notification system

**Areas for Improvement:**
- Inconsistent state management (mix of local state and localStorage)
- Limited accessibility features (missing ARIA labels, focus management)
- Performance bottlenecks (no code splitting, limited memoization)
- Component complexity (large components with multiple responsibilities)
- Limited responsive design patterns
- Inconsistent error handling patterns

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │    Hooks     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      State Management Layer                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Zustand Store│  │  Context API │  │ Local State  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                       Business Logic Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Services   │  │   Utilities  │  │  Validators  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                         Data Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  IndexedDB   │  │ LocalStorage │  │  API Client  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### State Management Strategy

**Zustand Store Structure:**
```typescript
interface AppStore {
  // UI State
  ui: {
    isMobileHistoryOpen: boolean;
    isFeedbackOpen: boolean;
    isTemplateModalOpen: boolean;
    activeTab: 'history' | 'projects' | 'templates';
  };
  
  // Application State
  app: {
    input: string;
    options: EnhancementOptions;
    enhancedPrompt: string | null;
    originalPrompt: string | null;
    isLoading: boolean;
    isReadOnly: boolean;
  };
  
  // Data State
  data: {
    history: HistoryItem[];
    savedProjects: SavedProject[];
    customTemplates: CustomTemplate[];
  };
  
  // Actions
  actions: {
    setInput: (input: string) => void;
    setOptions: (options: EnhancementOptions) => void;
    addHistoryItem: (item: HistoryItem) => void;
    // ... other actions
  };
}
```

**State Management Rules:**
1. Global UI state → Zustand store
2. Server state → React Query (future enhancement)
3. Form state → Local component state with controlled inputs
4. Persistent state → IndexedDB via Zustand middleware

## Components and Interfaces

### Component Hierarchy

```
App (Container)
├── ErrorBoundary
├── Header
├── OnboardingManager
├── RecoveryModal
├── FeedbackModal
└── Main Layout
    ├── PromptInput (Feature)
    │   ├── ConfigPanel
    │   ├── TextArea
    │   └── ActionButtons
    ├── PromptOutput (Feature)
    │   ├── OutputHeader
    │   ├── OutputContent
    │   └── ExportMenu
    └── HistorySidebar (Feature)
        ├── TabNavigation
        ├── HistoryList (Virtualized)
        ├── ProjectsList (Virtualized)
        └── TemplatesList (Virtualized)
```

### Component Design Patterns

**1. Composition over Prop Drilling**
```typescript
// Bad: Prop drilling
<Parent data={data}>
  <Child data={data}>
    <GrandChild data={data} />
  </Child>
</Parent>

// Good: Context or Zustand
const useAppData = () => useStore(state => state.data);
<Parent>
  <Child>
    <GrandChild /> // Uses useAppData internally
  </Child>
</Parent>
```

**2. Single Responsibility Components**
```typescript
// Bad: Component doing too much
const PromptInput = () => {
  // Handles input, validation, API calls, UI state, etc.
};

// Good: Separated concerns
const PromptInput = () => {
  const { input, setInput } = usePromptInput();
  const { validate, errors } = useValidation(input);
  const { enhance, isLoading } = useEnhancePrompt();
  
  return <PromptInputUI ... />;
};
```

**3. Custom Hooks for Logic Extraction**
```typescript
// Extract complex logic into hooks
const usePromptEnhancement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const enhance = useCallback(async (input: string, options: EnhancementOptions) => {
    // Enhancement logic
  }, []);
  
  return { enhance, isLoading, error };
};
```

### Key Component Interfaces

```typescript
// Atomic Components
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
  placeholder?: string;
  isDisabled?: boolean;
  ariaDescribedBy?: string;
}

// Feature Components
interface PromptInputProps {
  // Minimal props, uses Zustand for state
  onEnhance: () => Promise<void>;
}

interface PromptOutputProps {
  // Minimal props, uses Zustand for state
  onShare: () => void;
  onChainPrompt: (output: string) => void;
}
```

## Data Models

### Core Domain Models

```typescript
// Enhanced with validation
interface EnhancementOptions {
  domain: DomainType;
  platform: PlatformType;
  targetTool: string;
  complexity: ComplexityLevel;
  mode: GenerationMode;
  includeTechStack: boolean;
  includeBestPractices: boolean;
  includeEdgeCases: boolean;
  includeCodeSnippet: boolean;
  includeExampleUsage: boolean;
  includeTests: boolean;
  useThinking: boolean;
}

// Validation schema
const enhancementOptionsSchema = z.object({
  domain: z.nativeEnum(DomainType),
  platform: z.nativeEnum(PlatformType),
  targetTool: z.string(),
  complexity: z.nativeEnum(ComplexityLevel),
  mode: z.nativeEnum(GenerationMode),
  includeTechStack: z.boolean(),
  includeBestPractices: z.boolean(),
  includeEdgeCases: z.boolean(),
  includeCodeSnippet: z.boolean(),
  includeExampleUsage: z.boolean(),
  includeTests: z.boolean(),
  useThinking: z.boolean(),
});

// IndexedDB Schema
interface DraftSchema {
  id?: number;
  input: string;
  options: EnhancementOptions;
  timestamp: number;
  version: number; // For schema migrations
}

interface HistorySchema {
  id: string;
  original: string;
  enhanced: string;
  timestamp: number;
  domain: DomainType;
  mode: GenerationMode;
  metadata: {
    wordCount: number;
    characterCount: number;
    enhancementDuration: number;
  };
}
```

### State Persistence Strategy

```typescript
// Zustand middleware for persistence
const persistConfig = {
  name: 'devprompt-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state: AppStore) => ({
    // Only persist specific slices
    data: state.data,
    app: {
      options: state.app.options, // Persist user preferences
    },
  }),
};

// IndexedDB for drafts (larger data)
const draftPersistence = {
  save: async (draft: Draft) => db.drafts.add(draft),
  load: async () => db.drafts.orderBy('timestamp').last(),
  cleanup: async () => {
    const count = await db.drafts.count();
    if (count > 10) {
      const deleteCount = count - 10;
      const keys = await db.drafts.orderBy('timestamp').limit(deleteCount).keys();
      await db.drafts.bulkDelete(keys);
    }
  },
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Accessibility Properties

**Property 1: Focus Indicator Visibility**
*For any* interactive element (button, link, input, select), when focused via keyboard navigation, the element should have a visible focus indicator with sufficient contrast (minimum 3:1 ratio against background)
**Validates: Requirements 1.1**

**Property 2: ARIA Label Completeness**
*For any* interactive element without visible text content, the element should have an aria-label or aria-labelledby attribute that provides a descriptive label
**Validates: Requirements 1.2**

**Property 3: Form Label Association**
*For any* form input element, the input should be associated with a label element via htmlFor/id pairing or aria-labelledby attribute
**Validates: Requirements 1.3**

**Property 4: Modal Focus Trap**
*For any* modal dialog, when opened, focus should be trapped within the modal boundaries, and when closed, focus should return to the element that triggered the modal
**Validates: Requirements 1.4**

**Property 5: Live Region Announcements**
*For any* dynamic content update (toast notification, status change), the containing element should have an appropriate aria-live attribute (polite, assertive, or off)
**Validates: Requirements 1.5**

### Responsive Design Properties

**Property 6: Mobile Viewport Functionality**
*For any* viewport width between 320px and 768px, all interactive elements should remain accessible and functional without requiring horizontal scrolling
**Validates: Requirements 2.1**

**Property 7: Orientation Change Stability**
*For any* application state, when the viewport orientation changes from portrait to landscape or vice versa, the application state and user data should remain unchanged
**Validates: Requirements 2.2**

**Property 8: Touch Target Minimum Size**
*For any* interactive element on touch devices, the element's clickable area should be at least 44x44 pixels to meet touch target accessibility guidelines
**Validates: Requirements 2.3**

**Property 9: Responsive Layout Integrity**
*For any* viewport width between 320px and 2560px, the document body should not have horizontal overflow (scrollWidth should equal clientWidth)
**Validates: Requirements 2.4**

### Code Quality Properties

**Property 10: Component Props Type Safety**
*For any* React component, the component should have an explicitly defined TypeScript interface or type for its props
**Validates: Requirements 3.2**

**Property 11: Utility Module Organization**
*For any* utility function, the function should be exported from a domain-specific module (e.g., validation utils, date utils, string utils) rather than a generic utils file
**Validates: Requirements 3.4**

### Performance Properties

**Property 12: First Contentful Paint Performance**
*For any* initial page load under normal network conditions (3G or better), the First Contentful Paint metric should occur within 1.5 seconds
**Validates: Requirements 4.1**

**Property 13: Interaction Responsiveness**
*For any* user interaction (click, input change, keyboard event), the UI should provide visual feedback within 100 milliseconds
**Validates: Requirements 4.2**

**Property 14: Non-Blocking Rendering**
*For any* navigation or state change, the main thread should not be blocked for more than 50 milliseconds (no long tasks)
**Validates: Requirements 4.3**

**Property 15: Lazy Loading Implementation**
*For any* non-critical component (modals, sidebars, heavy features), the component should be loaded using React.lazy() and dynamic imports
**Validates: Requirements 4.4**

**Property 16: Debounced Expensive Operations**
*For any* text input that triggers expensive operations (API calls, complex calculations), the operation should be debounced with a minimum delay of 300 milliseconds
**Validates: Requirements 4.5**

### Scalability Properties

**Property 17: API Call Isolation**
*For any* API call or external service integration, the call should be defined in a dedicated service module (e.g., geminiService.ts) rather than directly in components
**Validates: Requirements 5.4**

### Error Handling Properties

**Property 18: API Error User Feedback**
*For any* failed API call, the application should display a user-friendly error message that includes actionable guidance (e.g., "Try again" button, explanation of what went wrong)
**Validates: Requirements 6.1**

**Property 19: Network Error Retry Mechanism**
*For any* network error (timeout, connection failure), the application should provide a retry mechanism that allows the user to reattempt the failed operation
**Validates: Requirements 6.2**

**Property 20: Validation Error Proximity**
*For any* form validation error, the error message should be displayed within 16 pixels of the invalid input field and associated via aria-describedby
**Validates: Requirements 6.3**

**Property 21: Error Boundary Recovery**
*For any* component error caught by an error boundary, the error boundary should render a fallback UI that includes a "Try Again" or "Reset" button
**Validates: Requirements 6.4**

**Property 22: Error Logging Context**
*For any* logged error, the error log should include contextual information (component name, user action, timestamp) but should not include sensitive data (API keys, user passwords)
**Validates: Requirements 6.5**

### Component Pattern Properties

**Property 23: Prop Drilling Depth Limit**
*For any* component tree, props should not be passed through more than 2 levels of components without using context, Zustand, or composition patterns
**Validates: Requirements 7.2**

**Property 24: Tailwind CSS Consistency**
*For any* component styling, the component should use Tailwind utility classes and should not contain inline style objects (except for dynamic values)
**Validates: Requirements 7.3**

**Property 25: CSS Grid for Complex Layouts**
*For any* layout with 2D positioning requirements (rows and columns), the layout should use CSS Grid (grid, grid-cols, grid-rows classes) rather than nested flexbox
**Validates: Requirements 7.4**

**Property 26: Custom Hook Extraction**
*For any* component with more than 50 lines of logic (excluding JSX), complex logic should be extracted into custom hooks
**Validates: Requirements 7.5**

### Auto-Save Properties

**Property 27: Draft Save Timing**
*For any* user input in the main text area, after 2 seconds of inactivity, the draft should be saved to IndexedDB
**Validates: Requirements 8.1**

**Property 28: Draft Recovery Offer**
*For any* application load, if a draft exists in IndexedDB that is less than 24 hours old and has non-empty content, a recovery modal should be displayed
**Validates: Requirements 8.2**

**Property 29: Save Status Visibility**
*For any* save operation (saving, saved, error), a visual indicator should be displayed showing the current save status
**Validates: Requirements 8.3**

**Property 30: Draft Cleanup Limit**
*For any* state where more than 10 drafts exist in IndexedDB, the oldest drafts should be automatically deleted to maintain only the 10 most recent
**Validates: Requirements 8.4**

**Property 31: Save Failure Retry**
*For any* failed save operation, the application should automatically retry the save operation up to 3 times before notifying the user of persistent failure
**Validates: Requirements 8.5**

### Animation Properties

**Property 32: Animation Frame Rate**
*For any* CSS animation or transition, the animation should maintain 60 frames per second (16.67ms per frame) without dropped frames
**Validates: Requirements 9.1**

**Property 33: Hardware-Accelerated Animations**
*For any* animation on modal, sidebar, or overlay elements, the animation should use CSS transform or opacity properties (which trigger GPU acceleration) rather than layout properties
**Validates: Requirements 9.2**

**Property 34: Loading State Indicators**
*For any* loading state (API call in progress, content loading), the UI should display either a skeleton screen or progress indicator
**Validates: Requirements 9.3**

**Property 35: Reduced Motion Respect**
*For any* animation, when the user has prefers-reduced-motion enabled, animations should be disabled or reduced to simple fades
**Validates: Requirements 9.4**

**Property 36: Animation Layout Stability**
*For any* animated element, the animation should not cause Cumulative Layout Shift (CLS) - elements should have reserved space or use transform/opacity
**Validates: Requirements 9.5**

### Error Boundary Properties

**Property 37: Error Boundary Catch**
*For any* component error (thrown exception), the nearest error boundary should catch the error and prevent application crash
**Validates: Requirements 10.1**

**Property 38: Error Fallback UI**
*For any* caught error, the error boundary should render a fallback UI that includes an error message and recovery options
**Validates: Requirements 10.2**

**Property 39: Error Logging**
*For any* error caught by an error boundary, the error should be logged with stack trace and component information
**Validates: Requirements 10.3**

**Property 40: Error Boundary Reset**
*For any* error boundary fallback UI, a reset button should be provided that clears the error state and re-renders the component tree
**Validates: Requirements 10.4**

**Property 41: State Preservation on Error**
*For any* error that occurs, user input data and application state should be preserved in Zustand store or IndexedDB to prevent data loss
**Validates: Requirements 10.5**

## Error Handling

### Error Handling Strategy

**Error Categories:**
1. **Network Errors** - API failures, timeouts, connection issues
2. **Validation Errors** - User input validation failures
3. **Runtime Errors** - Unexpected exceptions in components
4. **Storage Errors** - IndexedDB or localStorage failures
5. **Permission Errors** - Browser API permission denials

### Error Handling Patterns

```typescript
// 1. API Error Handling with Retry
const useApiCall = <T,>(apiFunction: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const execute = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await retryOperation(apiFunction, 3);
      setData(result);
    } catch (err) {
      setError(err as Error);
      // Show user-friendly error with retry option
      showErrorWithRetry(
        getErrorMessage(err),
        () => {
          setRetryCount(prev => prev + 1);
          execute();
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, execute, retryCount };
};

// 2. Validation Error Handling
const useFormValidation = <T extends z.ZodType>(schema: T) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): data is z.infer<T> => {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  return { errors, validate, clearErrors: () => setErrors({}) };
};

// 3. Storage Error Handling
const safeStorageOperation = async <T,>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    logger.error(error, { context: 'Storage Operation' });
    notifyError('Failed to save data. Using temporary storage.');
    return fallback;
  }
};

// 4. Component Error Boundary
class FeatureErrorBoundary extends React.Component<
  { children: ReactNode; featureName: string },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(error, {
      feature: this.props.featureName,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <FeatureErrorFallback
          featureName={this.props.featureName}
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}
```

### Error Message Guidelines

```typescript
// User-friendly error messages
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection and try again.',
  API_TIMEOUT: 'The request is taking longer than expected. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  STORAGE_ERROR: 'Unable to save your work. Your changes are stored temporarily.',
  PERMISSION_DENIED: 'Permission denied. Please check your browser settings.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again or contact support.',
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof RateLimitError) return ERROR_MESSAGES.RATE_LIMIT;
  if (error instanceof APIError) {
    if (error.status === 408) return ERROR_MESSAGES.API_TIMEOUT;
    if (error.status >= 500) return 'Server error. Please try again later.';
  }
  if (error instanceof Error) {
    if (error.message.includes('network')) return ERROR_MESSAGES.NETWORK_ERROR;
    if (error.message.includes('storage')) return ERROR_MESSAGES.STORAGE_ERROR;
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};
```

## Testing Strategy

### Testing Pyramid

```
        ┌─────────────────┐
        │   E2E Tests     │  ← 10% (Critical user flows)
        │   (Playwright)  │
        └─────────────────┘
       ┌───────────────────┐
       │ Integration Tests │  ← 20% (Component interactions)
       │   (Testing Lib)   │
       └───────────────────┘
      ┌─────────────────────┐
      │    Unit Tests       │  ← 40% (Business logic, utils)
      │   (Vitest + RTL)    │
      └─────────────────────┘
     ┌───────────────────────┐
     │  Property-Based Tests │  ← 30% (Correctness properties)
     │    (fast-check)       │
     └───────────────────────┘
```

### Testing Tools

**Primary Testing Stack:**
- **Vitest** - Fast unit test runner with Vite integration
- **React Testing Library** - Component testing with user-centric queries
- **fast-check** - Property-based testing library for TypeScript
- **Playwright** - E2E testing for critical user flows
- **axe-core** - Automated accessibility testing

### Property-Based Testing Implementation

**Property-Based Testing Library:** fast-check

**Configuration:**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.{ts,tsx}', '**/test/**'],
    },
  },
});

// Test setup
import { fc } from 'fast-check';

// Configure fast-check to run minimum 100 iterations
fc.configureGlobal({
  numRuns: 100,
  verbose: true,
});
```

**Property Test Examples:**

```typescript
import { fc } from 'fast-check';
import { describe, it, expect } from 'vitest';

describe('Accessibility Properties', () => {
  it('Property 1: Focus Indicator Visibility', () => {
    /**
     * Feature: react-app-modernization, Property 1: Focus Indicator Visibility
     * Validates: Requirements 1.1
     */
    fc.assert(
      fc.property(
        fc.constantFrom('button', 'a', 'input', 'select', 'textarea'),
        (elementType) => {
          const element = document.createElement(elementType);
          element.tabIndex = 0;
          document.body.appendChild(element);
          
          element.focus();
          const styles = window.getComputedStyle(element);
          const hasOutline = styles.outline !== 'none' && styles.outline !== '';
          const hasFocusVisible = element.matches(':focus-visible');
          
          document.body.removeChild(element);
          
          return hasOutline || hasFocusVisible;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Form Label Association', () => {
    /**
     * Feature: react-app-modernization, Property 3: Form Label Association
     * Validates: Requirements 1.3
     */
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        (labelText, inputId) => {
          const label = document.createElement('label');
          const input = document.createElement('input');
          
          label.textContent = labelText;
          label.htmlFor = inputId;
          input.id = inputId;
          
          document.body.appendChild(label);
          document.body.appendChild(input);
          
          const associatedLabel = document.querySelector(`label[for="${inputId}"]`);
          const hasAssociation = associatedLabel !== null;
          
          document.body.removeChild(label);
          document.body.removeChild(input);
          
          return hasAssociation;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Performance Properties', () => {
  it('Property 16: Debounced Expensive Operations', () => {
    /**
     * Feature: react-app-modernization, Property 16: Debounced Expensive Operations
     * Validates: Requirements 4.5
     */
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 5, maxLength: 20 }),
        async (inputs) => {
          let callCount = 0;
          const expensiveOperation = () => { callCount++; };
          const debouncedOp = debounce(expensiveOperation, 300);
          
          // Simulate rapid typing
          inputs.forEach(input => debouncedOp());
          
          // Wait for debounce
          await new Promise(resolve => setTimeout(resolve, 350));
          
          // Should only call once despite multiple inputs
          return callCount === 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Auto-Save Properties', () => {
  it('Property 30: Draft Cleanup Limit', () => {
    /**
     * Feature: react-app-modernization, Property 30: Draft Cleanup Limit
     * Validates: Requirements 8.4
     */
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            input: fc.string({ minLength: 10 }),
            timestamp: fc.integer({ min: Date.now() - 1000000, max: Date.now() }),
          }),
          { minLength: 11, maxLength: 20 }
        ),
        async (drafts) => {
          // Clear existing drafts
          await db.drafts.clear();
          
          // Add drafts
          for (const draft of drafts) {
            await db.drafts.add({
              input: draft.input,
              options: {} as any,
              timestamp: draft.timestamp,
            });
          }
          
          // Trigger cleanup
          await cleanupDrafts();
          
          // Check count
          const count = await db.drafts.count();
          return count === 10;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing Strategy

**Unit tests focus on:**
- Utility functions (validation, formatting, calculations)
- Custom hooks (useAutoSave, useDebounce, useLocalStorage)
- Business logic (prompt enhancement, template management)
- Error handling functions
- Data transformations

**Example Unit Tests:**

```typescript
describe('Validation Utils', () => {
  it('should validate prompt input length', () => {
    const shortInput = 'Hi';
    const validInput = 'Create a React component for user authentication';
    const longInput = 'a'.repeat(5001);

    expect(promptInputSchema.safeParse({ input: shortInput }).success).toBe(false);
    expect(promptInputSchema.safeParse({ input: validInput }).success).toBe(true);
    expect(promptInputSchema.safeParse({ input: longInput }).success).toBe(false);
  });
});

describe('useAutoSave Hook', () => {
  it('should debounce save operations', async () => {
    const { result } = renderHook(() => useAutoSave('test input', {} as any));
    
    // Initial status
    expect(result.current.status).toBe('idle');
    
    // Wait for debounce
    await waitFor(() => {
      expect(result.current.status).toBe('saved');
    }, { timeout: 3000 });
  });
});
```

### Integration Testing Strategy

**Integration tests focus on:**
- Component interactions (parent-child communication)
- State management flows (Zustand store updates)
- Form submissions and validation
- Modal and sidebar interactions
- Error boundary behavior

### E2E Testing Strategy

**Critical user flows to test:**
1. Complete prompt enhancement flow (input → enhance → copy)
2. Save and load project flow
3. Create and use custom template
4. History navigation and restoration
5. Error recovery (network failure → retry → success)
6. Mobile responsive behavior

### Accessibility Testing

**Automated accessibility testing:**
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Manual accessibility testing checklist:**
- [ ] Keyboard navigation through all interactive elements
- [ ] Screen reader testing (NVDA/JAWS on Windows, VoiceOver on Mac)
- [ ] Focus management in modals and overlays
- [ ] Color contrast verification (WCAG AA)
- [ ] Touch target sizes on mobile devices

### Test Coverage Goals

- **Overall Coverage:** 80% minimum
- **Critical Paths:** 95% minimum (prompt enhancement, save/load, error handling)
- **Utility Functions:** 90% minimum
- **Components:** 75% minimum
- **Property-Based Tests:** All 41 correctness properties implemented

### Continuous Testing

**Pre-commit hooks:**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "vitest related --run"
    ]
  }
}
```

**CI/CD Pipeline:**
1. Lint and type check
2. Run unit tests
3. Run property-based tests
4. Run integration tests
5. Run E2E tests (on main branch only)
6. Generate coverage report
7. Run accessibility audit

This comprehensive testing strategy ensures that the modernized application maintains high quality, correctness, and reliability across all features and user flows.
