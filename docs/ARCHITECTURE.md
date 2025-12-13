# Architecture Guide

## Overview

DevPrompt Studio follows a modern React architecture with clear separation of concerns, leveraging Context API, custom hooks, and component composition patterns.

## Architecture Principles

### 1. Separation of Concerns
- **Presentational Components**: Pure UI components in `components/presentational/`
- **Container Components**: Logic-heavy components in `components/containers/`
- **Compound Components**: Related UI elements in `components/compound/`
- **Atomic Components**: Reusable primitives in `components/atomic/`

### 2. State Management Strategy

#### Zustand Stores (Global State)
- `appStore`: Application-level state (input, options, prompts)
- `uiStore`: UI state (modals, sidebars, loading states)
- `dataStore`: Persisted data (history, projects, templates)
- `apiKeyStore`: API key management
- `themeStore`: Theme preferences

#### Context API (Scoped State)
- `AuthContext`: Authentication state and user info
- `FeatureFlagsContext`: Feature toggles
- `ModalContext`: Modal management (compound pattern)

**When to use what:**
- Use Zustand for global app state that needs persistence
- Use Context for scoped state that doesn't need persistence
- Use local state (useState) for component-specific UI state

### 3. Custom Hooks Pattern

#### Logic Extraction Hooks
- `usePromptEnhancement`: Enhancement logic
- `useCloudSync`: Cloud sync management
- `useHistoryActions`: History operations
- `useProjectActions`: Project CRUD operations
- `useTemplateActions`: Template management

#### Utility Hooks
- `useAutoSave`: Debounced auto-save
- `useValidation`: Input validation
- `usePromptSuggestions`: Contextual suggestions
- `useKeyboardShortcuts`: Keyboard navigation

**Hook Naming Convention:**
- `use[Feature]`: Feature-specific logic
- `use[Feature]Actions`: CRUD operations
- `use[Feature]State`: State management

### 4. Component Composition

#### Compound Components
Components that work together as a unit:
```tsx
<ModalManager>
  <Modal id="template">
    <Modal.Header />
    <Modal.Body />
    <Modal.Footer />
  </Modal>
</ModalManager>
```

#### Render Props Pattern
For flexible component composition:
```tsx
<DataFetcher
  render={(data, loading) => (
    loading ? <Spinner /> : <DataView data={data} />
  )}
/>
```

### 5. Performance Optimization

#### Memoization Strategy
- `React.memo`: Presentational components
- `useMemo`: Expensive computations
- `useCallback`: Event handlers passed as props

**Memoization Rules:**
- Memoize presentational components that receive complex props
- Memoize callbacks passed to child components
- Don't over-memoize - measure first

#### Code Splitting
```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>
```

**Split Points:**
- Modals and dialogs
- Route-level components
- Heavy third-party libraries
- Feature modules

### 6. Error Boundaries

```tsx
<ErrorBoundary
  fallback={(error, reset) => <ErrorView error={error} onReset={reset} />}
  onError={(error, errorInfo) => logError(error, errorInfo)}
>
  <App />
</ErrorBoundary>
```

**Boundary Placement:**
- Root level: Catch all errors
- Feature level: Isolate feature failures
- Component level: Protect critical UI sections

### 7. Type Safety

#### Interface Naming Convention
- `[Component]Props`: Component props
- `[Feature]State`: State shape
- `[Feature]Actions`: Action creators
- `[Feature]Config`: Configuration objects

#### Type Organization
```
types/
├── index.ts          # Core types
├── apiKeys.ts        # API-related types
├── components.ts     # Component prop types
└── store.ts          # Store types
```

## Folder Structure

```
src/
├── components/
│   ├── atomic/           # Reusable primitives (Button, Input)
│   ├── compound/         # Compound components (ModalManager)
│   ├── containers/       # Logic containers
│   ├── presentational/   # Pure UI components
│   ├── PromptInput/      # Feature modules
│   └── [Feature].tsx     # Feature components
├── contexts/             # Context providers
├── hooks/                # Custom hooks
├── services/             # API services
├── store/                # Zustand stores
├── types/                # TypeScript types
└── utils/                # Utility functions
```

## Best Practices

### Component Creation Guidelines

**When to create a new component:**
- Component exceeds 200 lines
- Logic is reused in 2+ places
- Component has multiple responsibilities
- Testing becomes difficult

**When to extend existing component:**
- Adding a variant or theme
- Small behavioral change
- Maintaining consistency

### State Management Guidelines

**Lift state up when:**
- Multiple siblings need the same state
- Parent needs to coordinate children
- State needs to be persisted

**Keep state local when:**
- Only one component needs it
- State is UI-specific (hover, focus)
- State doesn't affect other components

### Performance Guidelines

**Optimize when:**
- Component renders frequently (>10/sec)
- Expensive computations in render
- Large lists or data sets
- Profiler shows bottlenecks

**Don't optimize:**
- Premature optimization
- Components that rarely render
- Simple computations
- Without measuring first

## Migration Guide

### From Old to New Architecture

1. **Extract Context Providers**
   - Move auth logic to `AuthContext`
   - Move feature flags to `FeatureFlagsContext`

2. **Split Large Components**
   - Extract presentational parts
   - Move logic to custom hooks
   - Create container components

3. **Add Memoization**
   - Wrap presentational components with `memo`
   - Memoize callbacks with `useCallback`
   - Memoize computations with `useMemo`

4. **Implement Error Boundaries**
   - Add root-level boundary
   - Add feature-level boundaries
   - Add error logging

## Testing Strategy

### Unit Tests
- Test custom hooks in isolation
- Test utility functions
- Test store actions

### Integration Tests
- Test component + hook integration
- Test context providers
- Test error boundaries

### E2E Tests
- Test critical user flows
- Test cross-browser compatibility
- Test accessibility

## Resources

- [React Patterns](https://reactpatterns.com/)
- [Kent C. Dodds Blog](https://kentcdodds.com/blog)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
