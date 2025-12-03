# Theme System Migration Guide

## ✅ Completed: Core Foundation

### Phase 1: Semantic Color Tokens
- [x] Created `theme-variables.css` with RGB color tokens
- [x] Enhanced light mode palette (vibrant blue #5B5FFF, better neutrals)
- [x] Updated dark mode tokens for consistency
- [x] Added CSS variables for all semantic colors

### Phase 2: Global Styles
- [x] Created `globals.css` with component utilities
- [x] Added button variants (primary, secondary, ghost)
- [x] Added card variants (default, elevated)
- [x] Added input field styling
- [x] Added tag/badge variants
- [x] Added navigation item styles
- [x] Enhanced typography (font smoothing, hierarchy)

### Phase 3: Tailwind Configuration
- [x] Updated `darkMode` to use both class and data-theme
- [x] Mapped all colors to CSS variables
- [x] Added shadow tokens
- [x] Added animation keyframes

### Phase 4: Theme Store
- [x] Updated to set `data-theme` attribute
- [x] Zero-flicker initialization in index.html
- [x] System preference detection

### Phase 5: Core Components
- [x] Updated App.tsx with semantic tokens
- [x] Updated Header with modern styling
- [x] Updated ThemeToggle with semantic tokens

## 🚧 Next Steps: Component Migration

### Priority 1: Input Components (High Impact)

#### Textarea Component
**File**: `src/components/atomic/Textarea.tsx`

**Before**:
```tsx
className="bg-white dark:bg-slate-900 border-slate-300 dark:border-blue-500/20"
```

**After**:
```tsx
className="input-field" // Uses semantic tokens
```

#### FormInput Component (Create New)
**File**: `src/components/atomic/FormInput.tsx`

```tsx
export const FormInput: React.FC<InputProps> = ({ error, ...props }) => (
  <input
    className={`input-field ${error ? 'border-accent-error focus:ring-accent-error/10' : ''}`}
    {...props}
  />
);
```

### Priority 2: Button Components

#### Update Existing Buttons
Replace scattered button styles with utility classes:

**Before**:
```tsx
className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
```

**After**:
```tsx
className="btn-primary"
```

**Variants**:
- `btn-primary` - Main actions (gradient, shadow, hover lift)
- `btn-secondary` - Secondary actions (outlined)
- `btn-ghost` - Tertiary actions (transparent)

### Priority 3: Card Components

#### PromptInput Card
**File**: `src/components/PromptInput/index.tsx`

**Before**:
```tsx
className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
```

**After**:
```tsx
className="card"
```

#### PromptOutput Card
**File**: `src/components/PromptOutput.tsx`

**Before**:
```tsx
className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
```

**After**:
```tsx
className="card-elevated"
```

### Priority 4: Navigation & Sidebar

#### HistorySidebar
**File**: `src/components/HistorySidebar.tsx`

Update navigation items:
```tsx
// Active item
className="nav-item nav-item-active"

// Inactive item
className="nav-item"
```

### Priority 5: Tags & Badges

#### Configuration Tags
**File**: `src/components/PromptInput/ConfigurationPanel.tsx`

**Before**:
```tsx
className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
```

**After**:
```tsx
className="tag"
// or
className="tag-primary" // for highlighted tags
```

## Component Migration Checklist

### Input Components
- [ ] Migrate Textarea to use `input-field` class
- [ ] Create FormInput component
- [ ] Create FormSelect component
- [ ] Update all input fields in PromptInput
- [ ] Update all input fields in Settings

### Button Components
- [ ] Replace primary buttons with `btn-primary`
- [ ] Replace secondary buttons with `btn-secondary`
- [ ] Replace ghost buttons with `btn-ghost`
- [ ] Update Header buttons
- [ ] Update PromptInput action buttons
- [ ] Update PromptOutput action buttons

### Card Components
- [ ] Update PromptInput container
- [ ] Update PromptOutput container
- [ ] Update HistorySidebar container
- [ ] Update Modal containers
- [ ] Update Settings panels

### Navigation
- [ ] Update HistorySidebar nav items
- [ ] Update RecentPromptsRail items
- [ ] Update any dropdown menus

### Tags & Badges
- [ ] Update configuration tags
- [ ] Update status badges
- [ ] Update filter chips

## Color Token Reference

### Light Mode
```css
/* Backgrounds */
--bg-base: #FFFFFF
--bg-elevated: #F8F9FB (warmer neutral)
--bg-overlay: #EEF1F7 (subtle accent)
--bg-subtle: #F0F2FF (light primary tint)

/* Text */
--text-primary: #1A1D29 (darker for contrast)
--text-secondary: #6B7280
--text-tertiary: #9CA3AF

/* Primary Accent */
--accent-primary: #5B5FFF (vibrant blue)
--accent-primary-hover: #4F52E8
--accent-primary-subtle: #F0F2FF
```

### Usage Examples

#### Backgrounds
```tsx
bg-background      // Main background
bg-elevated        // Cards, panels
bg-overlay         // Modals, dropdowns
bg-subtle          // Hover states
```

#### Text
```tsx
text-foreground    // Primary text
text-muted         // Secondary text
text-subtle        // Tertiary text
```

#### Borders
```tsx
border-border      // Default borders
border-border-subtle  // Subtle dividers
border-border-strong  // Emphasized borders
```

#### Accents
```tsx
bg-accent-primary           // Primary buttons
text-accent-primary         // Links, active states
bg-accent-primary-subtle    // Hover backgrounds
```

## Testing Checklist

### Visual Testing
- [ ] All text meets WCAG AA contrast (4.5:1)
- [ ] Interactive elements have visible hover states
- [ ] Focus rings are visible in both themes
- [ ] Shadows provide appropriate depth
- [ ] Transitions are smooth (200-300ms)

### Functional Testing
- [ ] Theme toggle works (light/auto/dark)
- [ ] Theme persists on reload
- [ ] System preference detection works
- [ ] No flicker on page load
- [ ] All components render in both themes

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader compatible
- [ ] Color is not the only indicator

## Quick Reference: Before → After

### Buttons
```tsx
// Before
className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md"

// After
className="btn-primary"
```

### Cards
```tsx
// Before
className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"

// After
className="card"
```

### Inputs
```tsx
// Before
className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2"

// After
className="input-field"
```

### Tags
```tsx
// Before
className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md"

// After
className="tag"
```

## Performance Notes

- CSS variables enable instant theme switching
- Transitions disabled during theme change (`.theme-transitioning`)
- All colors use RGB format for alpha channel support
- Minimal specificity for easy overrides

## Next Actions

1. **Immediate**: Migrate PromptInput and PromptOutput (highest visibility)
2. **Short-term**: Migrate all buttons and inputs
3. **Medium-term**: Migrate cards and navigation
4. **Long-term**: Create comprehensive component library
