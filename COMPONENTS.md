# Component Documentation

## Atomic Components

### Button

Reusable button component with multiple variants and sizes.

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

**Accessibility:**
- Keyboard: Enter/Space to activate
- ARIA: Proper button role
- Focus: Visible focus indicator

---

### Input

Text input with validation states and error display.

**Props:**
```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password';
}
```

**Usage:**
```tsx
<Input
  value={email}
  onChange={setEmail}
  placeholder="Enter email"
  error={errors.email}
  type="email"
/>
```

---

### Modal

Accessible modal dialog with focus management.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

**Usage:**
```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action">
  <p>Are you sure?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

**Features:**
- Focus trap: Tab cycles within modal
- Escape key: Closes modal
- Focus restoration: Returns focus on close
- Backdrop click: Closes modal

---

### Tooltip

Wrapper for Radix UI tooltip with consistent styling.

**Props:**
```typescript
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}
```

**Usage:**
```tsx
<Tooltip content="Click to save" side="top">
  <Button>Save</Button>
</Tooltip>
```

---

### Checkbox

Checkbox input with label and icon support.

**Props:**
```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}
```

**Usage:**
```tsx
<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  label="Accept terms"
/>
```

---

### Textarea

Multi-line text input with character count.

**Props:**
```typescript
interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  error?: string;
}
```

**Usage:**
```tsx
<Textarea
  value={text}
  onChange={setText}
  placeholder="Enter description"
  maxLength={500}
  rows={4}
/>
```

---

### Dropdown

Dropdown menu with keyboard navigation.

**Props:**
```typescript
interface DropdownProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}
```

**Usage:**
```tsx
<Dropdown
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' }
  ]}
  value={framework}
  onChange={setFramework}
  label="Select Framework"
/>
```

---

### Skeleton

Loading placeholder with multiple variants.

**Props:**
```typescript
interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  className?: string;
}
```

**Usage:**
```tsx
<Skeleton variant="text" width="100%" height={20} />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width="100%" height={200} />
```

---

## Feature Components

### PromptInput

Main prompt input interface with mode selection and configuration.

**Props:**
```typescript
interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}
```

**Sub-components:**
- **ConfigLabel**: Configuration label with tooltip
- **ModeSelector**: Mode selection (Basic, Prompt, Outline)
- **ConfigurationPanel**: Configuration options panel
- **SuggestionChips**: Contextual prompt suggestions

**Usage:**
```tsx
<PromptInput
  value={prompt}
  onChange={setPrompt}
  onSubmit={handleSubmit}
  isLoading={isLoading}
/>
```

---

### ErrorBoundary

Catches React errors and displays fallback UI.

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  preserveUserData?: boolean;
}
```

**Usage:**
```tsx
<ErrorBoundary
  fallback={<FullPageError />}
  onError={(error, info) => logger.error(error, info)}
  preserveUserData={true}
>
  <App />
</ErrorBoundary>
```

---

### DraftRecoveryModal

Modal for recovering unsaved drafts on app load.

**Props:**
```typescript
interface DraftRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: Draft[];
  onRecover: (draft: Draft) => void;
}
```

**Usage:**
```tsx
<DraftRecoveryModal
  isOpen={showRecovery}
  onClose={() => setShowRecovery(false)}
  drafts={recentDrafts}
  onRecover={handleRecover}
/>
```

---

### SaveStatus

Visual indicator for auto-save status.

**Props:**
```typescript
interface SaveStatusProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: number | null;
  retryCount?: number;
}
```

**Usage:**
```tsx
<SaveStatus
  status={saveStatus}
  lastSaved={lastSavedTime}
  retryCount={retryCount}
/>
```

**Display:**
- `idle`: No indicator
- `saving`: "Saving..." with spinner
- `saved`: "Saved Xm ago" with checkmark
- `error`: "Save failed (retry X/3)" with error icon

---

## Custom Hooks

### useAutoSave

Auto-saves input with debouncing and retry logic.

**Signature:**
```typescript
function useAutoSave(
  input: string,
  options: EnhancementOptions
): {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: number | null;
  retryCount: number;
}
```

**Usage:**
```tsx
const { status, lastSaved } = useAutoSave(promptText, options);
```

---

### useLocalStorage

Type-safe localStorage with error handling.

**Signature:**
```typescript
function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void]
```

**Usage:**
```tsx
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
```

---

### useValidation

Zod-based input validation.

**Signature:**
```typescript
function useValidation<T>(
  schema: z.ZodSchema<T>
): {
  errors: Record<string, string>;
  validate: (data: unknown) => boolean;
}
```

**Usage:**
```tsx
const { errors, validate } = useValidation(promptInputSchema);
```

---

### usePromptSuggestions

Contextual prompt suggestions based on input.

**Signature:**
```typescript
function usePromptSuggestions(
  input: string
): string[]
```

**Usage:**
```tsx
const suggestions = usePromptSuggestions(promptText);
```

---

### useClickOutside

Detects clicks outside a ref element.

**Signature:**
```typescript
function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void
): void
```

**Usage:**
```tsx
const ref = useRef<HTMLDivElement>(null);
useClickOutside(ref, () => setIsOpen(false));
```

---

### useDraftRecovery

Loads recent drafts on app mount.

**Signature:**
```typescript
function useDraftRecovery(): {
  drafts: Draft[];
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
```

**Usage:**
```tsx
const { drafts, showModal, setShowModal } = useDraftRecovery();
```

---

### useReducedMotion

Detects user's motion preference.

**Signature:**
```typescript
function useReducedMotion(): boolean
```

**Usage:**
```tsx
const prefersReducedMotion = useReducedMotion();
const animationDuration = prefersReducedMotion ? 0 : 300;
```

---

## Styling Guidelines

### Tailwind Classes

**Colors:**
- Primary: `bg-blue-600 hover:bg-blue-700`
- Secondary: `bg-gray-600 hover:bg-gray-700`
- Success: `bg-green-600`
- Error: `bg-red-600`
- Text: `text-gray-900` (primary), `text-gray-600` (secondary)

**Spacing:**
- Consistent scale: `p-2`, `p-4`, `p-6`, `p-8`
- Gap: `gap-2`, `gap-4`, `gap-6`

**Focus:**
- All interactive elements: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`

**Animations:**
- Fade in: `animate-fade-in`
- Slide up: `animate-slide-up`
- Scale in: `animate-scale-in`

### Custom Utilities

```css
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2;
  }
  
  .input-base {
    @apply border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:border-blue-500;
  }
}
```

---

## Testing Components

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Accessibility Tests

```typescript
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```
