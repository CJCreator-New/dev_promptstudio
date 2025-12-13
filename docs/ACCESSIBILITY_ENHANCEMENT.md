# Accessibility Enhancement Guide

## Overview

DevPrompt Studio is WCAG 2.1 Level AA compliant. This guide covers implemented accessibility features and maintenance guidelines.

## Implemented Features

### 1. Semantic HTML Structure

**What was done:**
- Replaced generic `<div>` elements with semantic HTML (`<nav>`, `<main>`, `<aside>`, `<section>`, `<article>`)
- Added proper heading hierarchy (h1 → h2 → h3)
- Used `<button>` for actions, `<a>` for navigation
- Added `<label>` elements for all form inputs

**Files modified:**
- `src/ia/templates/IAPatterns.tsx` - Added semantic structure to all patterns
- `src/App.tsx` - Already uses semantic HTML

### 2. ARIA Attributes

**What was done:**
- Added `aria-label` for regions without visible labels
- Added `aria-labelledby` to connect headings with sections
- Added `aria-live` regions for dynamic content
- Added `aria-current` for current step indicators
- Added `role` attributes where semantic HTML isn't sufficient

**Examples:**
```tsx
// Sequential pattern with ARIA
<nav aria-label="Progress steps">
  <ol>
    <li aria-current={isActive ? 'step' : undefined}>
      Step 1
    </li>
  </ol>
</nav>

// Matrix with table semantics
<table>
  <caption className="sr-only">Data matrix</caption>
  <th scope="col">Column</th>
  <th scope="row">Row</th>
</table>
```

### 3. Keyboard Navigation

**What was done:**
- Skip links to main content, navigation, search
- Focus trap in modals (useFocusTrap hook)
- Keyboard shortcuts (Ctrl+E, Ctrl+S, Ctrl+K)
- Logical tab order maintained
- All interactive elements keyboard accessible

**Components:**
- `src/components/accessibility/SkipLinks.tsx`
- `src/components/accessibility/FocusManager.tsx`

### 4. Screen Reader Support

**What was done:**
- `.sr-only` class for screen reader only content
- Alternative text patterns for icons
- Live regions for status updates
- Proper form labels and error associations

**Usage:**
```tsx
<caption className="sr-only">Table description</caption>
<AlertCircle aria-hidden="true" />
<span className="sr-only">Error:</span>
```

### 5. Color Contrast

**What was done:**
- All text meets WCAG AA contrast ratio (4.5:1 minimum)
- Focus indicators use high contrast colors
- Error states use sufficient contrast
- CSS variables for consistent colors

**File:** `src/styles/accessibility.css`

### 6. Focus States

**What was done:**
- Visible focus indicators on all interactive elements
- 2px solid outline with 2px offset
- High contrast mode support
- Focus-visible for keyboard-only focus

**CSS:**
```css
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### 7. Form Error Messaging

**What was done:**
- Error messages with `role="alert"`
- `aria-live="assertive"` for immediate announcement
- Visual error indicators (icon + text)
- Error IDs linked to inputs via `aria-describedby`

**Component:** `src/components/accessibility/FormErrorMessage.tsx`

**Usage:**
```tsx
<input aria-describedby="error-email" />
<FormErrorMessage id="error-email" error="Invalid email" />
```

### 8. Reduced Motion

**What was done:**
- Respects `prefers-reduced-motion` media query
- Disables animations for users with vestibular disorders
- Maintains functionality without animations

**CSS:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Maintenance Guidelines

### Adding New Components

1. **Use semantic HTML first**
   ```tsx
   // Good
   <button onClick={handleClick}>Submit</button>
   
   // Bad
   <div onClick={handleClick}>Submit</div>
   ```

2. **Add ARIA when needed**
   ```tsx
   <button aria-label="Close dialog">
     <X aria-hidden="true" />
   </button>
   ```

3. **Ensure keyboard accessibility**
   ```tsx
   <div 
     role="button" 
     tabIndex={0}
     onKeyDown={(e) => e.key === 'Enter' && handleClick()}
   >
   ```

4. **Test with keyboard only**
   - Tab through all interactive elements
   - Verify focus indicators are visible
   - Test all functionality without mouse

5. **Test with screen reader**
   - NVDA (Windows), VoiceOver (Mac), JAWS
   - Verify all content is announced
   - Check reading order is logical

### Form Accessibility Checklist

- [ ] All inputs have associated `<label>` elements
- [ ] Required fields marked with `aria-required="true"`
- [ ] Error messages use `FormErrorMessage` component
- [ ] Error IDs linked via `aria-describedby`
- [ ] Submit button has descriptive text
- [ ] Form has clear heading

### Modal Accessibility Checklist

- [ ] Uses `useFocusTrap` hook
- [ ] Has `role="dialog"` and `aria-modal="true"`
- [ ] Has `aria-labelledby` pointing to title
- [ ] Escape key closes modal
- [ ] Focus returns to trigger element on close
- [ ] Background content is inert

### Testing Tools

**Automated:**
```bash
npm run a11y:test      # Playwright + axe-core
npm run a11y:audit     # Pa11y CI
npm run lint:a11y      # ESLint jsx-a11y
```

**Manual:**
- Chrome DevTools Lighthouse
- axe DevTools browser extension
- WAVE browser extension
- Keyboard navigation testing
- Screen reader testing

## Common Patterns

### Accessible Button
```tsx
<button
  type="button"
  aria-label="Descriptive action"
  className="min-w-[44px] min-h-[44px]"
>
  <Icon aria-hidden="true" />
</button>
```

### Accessible Link
```tsx
<a 
  href="/path"
  aria-label="Navigate to page name"
>
  Link text
</a>
```

### Accessible Form Field
```tsx
<div>
  <label htmlFor="field-id">Field Label</label>
  <input
    id="field-id"
    type="text"
    aria-required="true"
    aria-describedby="error-field-id"
  />
  <FormErrorMessage id="error-field-id" error={error} />
</div>
```

### Accessible Modal
```tsx
const Modal = ({ isOpen, onClose, title, children }) => {
  const ref = useFocusTrap(isOpen);
  
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={ref}>
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose} aria-label="Close dialog">
        <X aria-hidden="true" />
      </button>
    </div>
  );
};
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Inclusive Components](https://inclusive-components.design/)

## Accessibility Statement

View the full accessibility statement at `/accessibility-statement.html`

## Contact

Report accessibility issues:
- GitHub: https://github.com/CJCreator-New/dev_promptstudio/issues
- Label: `accessibility`
