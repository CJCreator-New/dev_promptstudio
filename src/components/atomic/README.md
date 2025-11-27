# Atomic Component Library

A collection of reusable, accessible, and consistent UI components.

## Components

### Button
Versatile button component with multiple variants and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `loading`: boolean (default: false)
- `disabled`: boolean

**Example:**
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

### Input
Text input with validation states and helper text.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- All standard HTML input attributes

**Example:**
```tsx
<Input 
  label="Email" 
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### Select
Dropdown select with consistent styling.

**Props:**
- `label`: string
- `options`: Array<{ value: string, label: string }>
- `error`: string
- `helperText`: string

**Example:**
```tsx
<Select 
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
/>
```

### Checkbox
Checkbox input with icon support.

**Props:**
- `label`: string
- `icon`: ReactNode
- All standard HTML checkbox attributes

**Example:**
```tsx
<Checkbox 
  label="Accept terms"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>
```

### Textarea
Multi-line text input with character count.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `characterCount`: boolean

**Example:**
```tsx
<Textarea 
  label="Description"
  characterCount
  maxLength={500}
/>
```

### Modal
Accessible modal with focus management.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'sm' | 'md' | 'lg'
- `closeOnOutsideClick`: boolean (default: true)
- `closeOnEscape`: boolean (default: true)

**Features:**
- Focus trap
- Focus restoration
- Keyboard navigation
- Escape key support

**Example:**
```tsx
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

### Tooltip
Tooltip wrapper using Radix UI.

**Props:**
- `content`: string
- `side`: 'top' | 'right' | 'bottom' | 'left'
- `delayDuration`: number (default: 300)

**Example:**
```tsx
<Tooltip content="Click to save">
  <Button>Save</Button>
</Tooltip>
```

### Skeleton
Loading placeholder component.

**Props:**
- `variant`: 'text' | 'rectangular' | 'circular'
- `width`: string | number
- `height`: string | number

**Example:**
```tsx
<Skeleton variant="rectangular" width={200} height={100} />
```

### Dropdown
Dropdown menu with click-outside handling.

**Props:**
- `trigger`: ReactNode
- `items`: Array<{ label: string, description?: string, onClick: () => void }>

**Example:**
```tsx
<Dropdown
  trigger={<Button>Menu</Button>}
  items={[
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: handleDelete }
  ]}
/>
```

## Design Principles

1. **Accessibility First**: All components follow WCAG 2.1 AA standards
2. **Consistent Styling**: Uses Tailwind CSS utilities and custom classes
3. **Type Safety**: Full TypeScript support with proper prop types
4. **Composability**: Components can be easily composed together
5. **Performance**: Optimized with React.memo where appropriate

## Styling

Components use a combination of:
- Tailwind CSS utility classes
- Custom component classes (`.btn-primary`, `.input-base`, etc.)
- Semantic color utilities (`.text-primary`, `.bg-secondary`, etc.)

## Accessibility Features

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Color contrast compliance