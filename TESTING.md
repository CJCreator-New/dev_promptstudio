# Testing Guide

## Test Strategy

### Test Pyramid
1. **Integration Tests** (E2E flows)
2. **Component Tests** (UI behavior)
3. **Unit Tests** (Functions/hooks)
4. **Property Tests** (Requirements)

## Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test:coverage

# Specific test
npm test -- integration-flows.test.tsx

# UI mode
npm test:ui
```

## Integration Tests

### Critical User Flows

**Prompt Enhancement Flow:**
```typescript
// 1. User enters prompt
// 2. Auto-save triggers (2s)
// 3. User submits
// 4. Loading state shows
// 5. Enhanced prompt displays
// 6. Saved to history
```

**Draft Recovery Flow:**
```typescript
// 1. User enters text
// 2. Auto-save triggers
// 3. User closes app
// 4. User reopens app
// 5. Recovery modal shows
// 6. User recovers draft
```

**Error Recovery Flow:**
```typescript
// 1. API call fails
// 2. Error message displays
// 3. Retry button available
// 4. User clicks retry
// 5. Request succeeds
```

### Test Scenarios

#### Online/Offline
- [ ] App loads offline
- [ ] Operations queue when offline
- [ ] Sync when back online
- [ ] Offline indicator visible

#### Error Handling
- [ ] API errors show user-friendly messages
- [ ] Network errors trigger retry
- [ ] Component errors caught by boundary
- [ ] Data preserved on error

#### Data Persistence
- [ ] Drafts save to IndexedDB
- [ ] History persists across sessions
- [ ] Templates stored correctly
- [ ] Cleanup maintains 10 drafts

## Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome 90+ (Windows/Mac/Linux)
- [ ] Firefox 88+ (Windows/Mac/Linux)
- [ ] Safari 14+ (Mac)
- [ ] Edge 90+ (Windows)

### Mobile Browsers
- [ ] iOS Safari 14+
- [ ] Chrome Android
- [ ] Samsung Internet

### Test Checklist
- [ ] Layout renders correctly
- [ ] Interactions work (click, type, scroll)
- [ ] Animations perform smoothly
- [ ] IndexedDB/localStorage work
- [ ] API calls succeed
- [ ] Error handling works

## Mobile Responsiveness

### Viewports to Test
- **Mobile**: 375x667 (iPhone SE)
- **Tablet**: 768x1024 (iPad)
- **Desktop**: 1920x1080

### Test Cases
- [ ] Touch interactions work
- [ ] Swipe gestures supported
- [ ] Virtual keyboard doesn't break layout
- [ ] Text is readable (min 16px)
- [ ] Tap targets ≥ 44x44px
- [ ] Horizontal scroll prevented

### Testing Tools
```bash
# Chrome DevTools
# 1. Open DevTools (F12)
# 2. Toggle device toolbar (Ctrl+Shift+M)
# 3. Select device preset
# 4. Test interactions

# Real Device Testing
# 1. Run: npm run dev -- --host
# 2. Access from mobile: http://[your-ip]:5173
# 3. Test all flows
```

## Performance Testing

### Metrics to Verify
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Interaction responsiveness < 100ms
- [ ] No long tasks > 50ms
- [ ] Bundle size < 500KB

### Lighthouse Audit
```bash
# 1. Build production
npm run build

# 2. Preview
npm run preview

# 3. Run Lighthouse
# Chrome DevTools > Lighthouse > Generate Report

# 4. Check scores
# Performance: > 90
# Accessibility: 100
# Best Practices: > 90
# SEO: > 90
```

## Accessibility Testing

### Automated
```bash
npm test -- accessibility-audit.test.tsx
```

### Manual Checklist
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader announcements
- [ ] Focus indicators visible
- [ ] Color contrast ≥ 4.5:1
- [ ] ARIA labels present
- [ ] No keyboard traps

### Screen Readers
**NVDA (Windows):**
```
1. Install NVDA
2. Start: Ctrl+Alt+N
3. Navigate: Tab, Arrow keys
4. Read: Insert+Down Arrow
```

**JAWS (Windows):**
```
1. Start JAWS
2. Navigate: Tab, H (headings), B (buttons)
3. Forms mode: Enter/Space on input
```

**VoiceOver (Mac):**
```
1. Enable: Cmd+F5
2. Navigate: VO+Right Arrow
3. Interact: VO+Space
4. Rotor: VO+U
```

## Error Scenarios

### API Errors
- [ ] 400 Bad Request
- [ ] 401 Unauthorized
- [ ] 403 Forbidden
- [ ] 404 Not Found
- [ ] 429 Rate Limit
- [ ] 500 Server Error
- [ ] 503 Service Unavailable
- [ ] Network timeout
- [ ] Network offline

### Component Errors
- [ ] Render error
- [ ] Event handler error
- [ ] Async operation error
- [ ] State update error

### Data Errors
- [ ] IndexedDB quota exceeded
- [ ] localStorage full
- [ ] Invalid data format
- [ ] Corrupted data

## Test Data

### Sample Prompts
```typescript
const testPrompts = [
  'Build a todo app',
  'Create a React component',
  'Design a landing page',
  'Implement authentication',
  'Add dark mode'
];
```

### Mock Responses
```typescript
const mockEnhancedPrompt = `
Act as a Senior React Engineer...
[Enhanced prompt content]
`;
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- --run
      - run: npm run build
```

## Debugging Tests

### Common Issues

**Test timeout:**
```typescript
// Increase timeout
await waitFor(() => {
  expect(element).toBeInTheDocument();
}, { timeout: 5000 });
```

**Async state updates:**
```typescript
// Wrap in act()
await act(async () => {
  await user.click(button);
});
```

**Mock not working:**
```typescript
// Reset mocks
beforeEach(() => {
  vi.clearAllMocks();
});
```

## Test Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Continuous Testing

### Pre-commit
```bash
# Run tests before commit
npm test -- --run
```

### Pre-push
```bash
# Run full test suite
npm test:coverage
```

### CI Pipeline
```bash
# Automated on every push
- Lint
- Type check
- Unit tests
- Integration tests
- Build verification
```

## Resources

- [Vitest Docs](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
