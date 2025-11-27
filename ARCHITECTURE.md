# Architecture Documentation

## Overview

DevPrompt Studio is a React-based web application that enhances user prompts using Google's Gemini AI. The architecture follows modern React patterns with TypeScript, emphasizing component composition, custom hooks, and centralized state management.

## Core Principles

1. **Single Responsibility**: Each component/hook has one clear purpose
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Type Safety**: Comprehensive TypeScript coverage
4. **Accessibility First**: WCAG AA compliance throughout
5. **Performance**: Hardware-accelerated animations, lazy loading, efficient re-renders

## Technology Stack

### Frontend
- **React 18**: UI library with concurrent features
- **TypeScript 5.8**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool and dev server

### State Management
- **Zustand**: Lightweight state management
- **React Hooks**: Local component state

### Data Persistence
- **Dexie**: IndexedDB wrapper for client-side storage
- **LocalStorage**: Simple key-value persistence

### API Integration
- **Google Gemini AI**: Prompt enhancement
- **Streaming**: Real-time response chunks

### Testing
- **Vitest**: Fast unit test runner
- **Testing Library**: Component testing
- **jest-axe**: Accessibility testing
- **fast-check**: Property-based testing

## Project Structure

```
src/
├── components/
│   ├── atomic/              # Reusable UI primitives
│   │   ├── Button.tsx       # Button with variants
│   │   ├── Input.tsx        # Input with validation
│   │   ├── Modal.tsx        # Modal with focus trap
│   │   ├── Tooltip.tsx      # Radix UI tooltip wrapper
│   │   ├── Checkbox.tsx     # Checkbox component
│   │   ├── Textarea.tsx     # Textarea with char count
│   │   ├── Dropdown.tsx     # Dropdown menu
│   │   ├── Skeleton.tsx     # Loading placeholder
│   │   └── README.md        # Component documentation
│   ├── PromptInput/         # Prompt input feature
│   │   ├── index.tsx        # Main component
│   │   ├── ConfigLabel.tsx  # Configuration label
│   │   ├── ModeSelector.tsx # Mode selection
│   │   ├── ConfigurationPanel.tsx
│   │   └── SuggestionChips.tsx
│   ├── ErrorBoundary.tsx    # Error catching
│   ├── ErrorComponents.tsx  # Error UI
│   ├── DraftRecoveryModal.tsx
│   └── SaveStatus.tsx       # Save indicator
├── hooks/
│   ├── useAutoSave.ts       # Auto-save with retry
│   ├── useLocalStorage.ts   # Type-safe localStorage
│   ├── usePromptSuggestions.ts
│   ├── useClickOutside.ts   # Click outside detection
│   ├── useValidation.ts     # Zod validation
│   ├── useDraftRecovery.ts  # Draft recovery
│   └── useReducedMotion.ts  # Motion preference
├── services/
│   └── geminiService.ts     # API layer
├── store/
│   └── useStore.ts          # Zustand store
├── utils/
│   ├── db.ts                # Dexie database
│   ├── errorLogging.ts      # Error logger
│   └── validation.ts        # Zod schemas
├── types/
│   └── index.ts             # TypeScript types
└── test/                    # Test files
```

## Component Architecture

### Atomic Components

Small, reusable UI primitives with consistent API:

```typescript
// Example: Button component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Design Principles:**
- Single responsibility
- Composable
- Accessible (ARIA, keyboard nav)
- Consistent styling via Tailwind

### Feature Components

Complex components built from atomic components:

**PromptInput**: Main input interface
- Composed of: ConfigLabel, ModeSelector, ConfigurationPanel, SuggestionChips
- Uses hooks: useAutoSave, useValidation, usePromptSuggestions
- Manages: Input state, validation, suggestions, auto-save

### Error Boundaries

Catch React errors and provide fallback UI:

```typescript
<ErrorBoundary
  fallback={<FullPageError />}
  onError={(error, errorInfo) => logger.error(error, errorInfo)}
  preserveUserData={true}
>
  <App />
</ErrorBoundary>
```

**Features:**
- State preservation (localStorage backup)
- Stack trace logging
- User-friendly error messages
- Reset functionality

## Custom Hooks

### useAutoSave

Auto-saves user input with debouncing and retry logic:

```typescript
const { status, lastSaved, retryCount } = useAutoSave(input, options);
```

**Features:**
- 2-second debounce
- Exponential backoff retry (3 attempts)
- Maintains 10 most recent drafts
- Status tracking (idle, saving, saved, error)

### useLocalStorage

Type-safe localStorage with error handling:

```typescript
const [value, setValue] = useLocalStorage<T>('key', defaultValue);
```

### useValidation

Zod-based input validation:

```typescript
const { errors, validate } = useValidation(schema);
```

## API Service Layer

### geminiService.ts

Centralized API communication with interceptors:

```typescript
// Add interceptors
addRequestInterceptor((config) => ({ ...config, timestamp: Date.now() }));
addResponseInterceptor((response) => ({ ...response, processed: true }));
addErrorInterceptor((error) => ({ ...error, logged: true }));

// Stream enhanced prompt
for await (const chunk of enhancePromptStream(input, options)) {
  console.log(chunk);
}
```

**Features:**
- Request/response/error interceptors
- Exponential backoff retry (1s → 2s → 4s)
- Structured error handling (APIError, RateLimitError)
- Streaming support
- Comprehensive logging

## State Management

### Zustand Store

Lightweight global state:

```typescript
interface StoreState {
  history: HistoryItem[];
  templates: Template[];
  addToHistory: (item: HistoryItem) => void;
  // ...
}

const useStore = create<StoreState>((set) => ({
  history: [],
  addToHistory: (item) => set((state) => ({
    history: [item, ...state.history]
  }))
}));
```

### Local State

Component-specific state with useState/useReducer.

## Data Persistence

### IndexedDB (Dexie)

Client-side database for drafts and history:

```typescript
export const db = new Dexie('DevPromptStudio');
db.version(1).stores({
  drafts: '++id, timestamp',
  history: '++id, timestamp'
});
```

**Features:**
- Offline-first
- Fast queries
- Automatic cleanup (10 most recent drafts)

### LocalStorage

Simple key-value storage for preferences:
- Theme settings
- UI state
- User preferences

## Performance Optimizations

### Animations

All animations use hardware-accelerated properties:

```css
/* GPU-accelerated */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
  will-change: transform, opacity;
}

@keyframes fadeIn {
  from { transform: translate3d(0, 10px, 0); opacity: 0; }
  to { transform: translate3d(0, 0, 0); opacity: 1; }
}
```

### Code Splitting

Lazy load non-critical components:

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Memoization

Prevent unnecessary re-renders:

```typescript
const MemoizedComponent = memo(Component);
const memoizedValue = useMemo(() => expensiveCalc(), [deps]);
const memoizedCallback = useCallback(() => {}, [deps]);
```

## Error Handling

### Layers

1. **Component Level**: Try-catch in event handlers
2. **Error Boundary**: Catch React errors
3. **API Level**: Structured errors with retry
4. **Global**: Window error handlers

### Error Types

```typescript
class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

class RateLimitError extends APIError {
  constructor(message: string) {
    super(message, 429);
  }
}
```

### Logging

Centralized error logger:

```typescript
logger.error(error, {
  context: 'Component Name',
  userId: 'user-id',
  timestamp: Date.now()
});
```

## Accessibility

### WCAG AA Compliance

- Color contrast: 4.5:1 (normal text), 3:1 (large text)
- Keyboard navigation: All interactive elements
- Screen reader support: ARIA labels, live regions
- Focus management: Visible indicators, logical order

### Implementation

```typescript
// Focus trap in Modal
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Modal Title</h2>
  {/* Focus cycles within modal */}
</div>

// Loading announcement
<div aria-live="polite" aria-atomic="true">
  {isLoading ? 'Loading...' : 'Content loaded'}
</div>
```

## Testing Strategy

### Test Pyramid

1. **Unit Tests**: Individual functions/hooks
2. **Component Tests**: UI behavior
3. **Integration Tests**: Feature flows
4. **Property Tests**: Requirement validation
5. **Accessibility Tests**: axe-core automation

### Example

```typescript
// Property test
describe('Property 27: Draft Save Timing', () => {
  it('should save draft exactly 2 seconds after last input', async () => {
    // Test implementation
  });
});

// Unit test
describe('useAutoSave', () => {
  it('should retry failed saves with exponential backoff', async () => {
    // Test implementation
  });
});
```

## Build & Deployment

### Development

```bash
npm run dev  # Vite dev server with HMR
```

### Production

```bash
npm run build   # TypeScript check + Vite build
npm run preview # Preview production build
```

### Environment Variables

```
API_KEY=your_gemini_api_key
```

## Future Enhancements

- [ ] Offline mode with service worker
- [ ] Real-time collaboration
- [ ] Plugin system for custom enhancements
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
