# Accessibility Testing Guide

## Automated Testing

### axe-core Integration
Run automated accessibility tests:
```bash
npm test -- accessibility-audit.test.tsx
```

Tests cover:
- WCAG 2.1 Level AA compliance
- Color contrast ratios
- ARIA attributes
- Semantic HTML
- Keyboard navigation

## Manual Testing Checklist

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Shift+Tab navigates backwards
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals and dropdowns
- [ ] Arrow keys navigate within components
- [ ] Focus indicators are visible
- [ ] No keyboard traps (except modals)
- [ ] Skip to main content link works

### Screen Reader Testing

#### NVDA (Windows)
1. Install NVDA from https://www.nvaccess.org/
2. Start NVDA (Ctrl+Alt+N)
3. Navigate with:
   - Tab: Next interactive element
   - H: Next heading
   - B: Next button
   - F: Next form field
4. Verify announcements for:
   - Page title and landmarks
   - Button labels and states
   - Form labels and errors
   - Loading states
   - Modal dialogs

#### JAWS (Windows)
1. Start JAWS
2. Use Insert+F7 for elements list
3. Verify proper reading order
4. Check form field labels
5. Test table navigation (if applicable)

#### VoiceOver (macOS)
1. Enable: Cmd+F5
2. Navigate with:
   - VO+Right Arrow: Next item
   - VO+Cmd+H: Next heading
   - VO+Space: Activate
3. Use rotor (VO+U) to navigate by:
   - Headings
   - Links
   - Form controls
   - Landmarks

### Color Contrast (WCAG AA)
Minimum contrast ratios:
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

Tools:
- Chrome DevTools: Inspect > Accessibility
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- axe DevTools browser extension

### Focus Management
- [ ] Focus visible on all interactive elements
- [ ] Focus order follows visual order
- [ ] Modal traps focus correctly
- [ ] Focus restored after modal close
- [ ] No focus on hidden elements
- [ ] Custom focus styles meet contrast requirements

### ARIA Implementation
- [ ] Landmarks: main, nav, complementary, contentinfo
- [ ] Live regions for dynamic content
- [ ] aria-label for icon buttons
- [ ] aria-expanded for expandable elements
- [ ] aria-modal="true" for dialogs
- [ ] aria-live for status messages
- [ ] aria-describedby for help text

## Component-Specific Tests

### PromptInput
- [ ] Label associated with textarea
- [ ] Character count announced
- [ ] Error messages linked with aria-describedby
- [ ] Loading state announced
- [ ] Suggestions keyboard navigable

### Modal
- [ ] Focus trapped within modal
- [ ] Escape key closes modal
- [ ] Focus restored on close
- [ ] aria-modal="true" present
- [ ] Title linked with aria-labelledby

### Buttons
- [ ] All buttons have accessible names
- [ ] Disabled state announced
- [ ] Loading state indicated
- [ ] Icon-only buttons have aria-label

### Forms
- [ ] All inputs have labels
- [ ] Required fields marked
- [ ] Error messages associated
- [ ] Validation errors announced
- [ ] Success messages announced

## Testing Tools

### Browser Extensions
- axe DevTools (Chrome/Firefox)
- WAVE (Chrome/Firefox)
- Lighthouse (Chrome DevTools)

### Command Line
```bash
# Run all accessibility tests
npm test -- accessibility

# Run with coverage
npm test -- --coverage accessibility

# Run specific test
npm test -- keyboard-navigation.test.tsx
```

## Common Issues and Fixes

### Missing Focus Indicators
```css
/* Add visible focus styles */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}
```

### Missing ARIA Labels
```tsx
{/* Icon button needs label */}
<button aria-label="Close dialog">
  <XIcon />
</button>
```

### Keyboard Trap
```tsx
{/* Ensure modal has focus trap */}
<Modal isOpen={isOpen} onClose={onClose}>
  {/* Focus cycles within modal */}
</Modal>
```

### Color Contrast
```css
/* Ensure sufficient contrast */
.text-primary {
  @apply text-gray-900; /* 15.3:1 on white */
}
.text-secondary {
  @apply text-gray-600; /* 7.2:1 on white */
}
```

## Continuous Integration

Add to CI pipeline:
```yaml
- name: Accessibility Tests
  run: npm test -- accessibility-audit.test.tsx --run
```

## Resources
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- WebAIM: https://webaim.org/
- Deque University: https://dequeuniversity.com/
