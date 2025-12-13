# Testing Strategy

## Overview

Balanced testing approach ensuring quality without excessive maintenance. Focus on critical paths and user-facing functionality.

## Testing Pyramid

```
        /\
       /E2E\      10% - Critical user flows
      /------\
     /  INT   \   20% - Component interactions
    /----------\
   /    UNIT    \ 70% - Functions & components
  /--------------\
```

## Test Types

### 1. Unit Tests (70%)

**What to test:**
- Pure functions
- Component rendering
- State management logic
- Utility functions

**Example:**
```tsx
// src/test-strategy/unit/IAPatterns.test.tsx
it('renders hub and spokes', () => {
  render(<HubAndSpoke hub={<div>Hub</div>} spokes={[<div>Spoke</div>]} />);
  expect(screen.getByText('Hub')).toBeInTheDocument();
});
```

**Run:** `npm run test:unit`

**When to use:**
- Testing isolated logic
- Fast feedback during development
- High coverage with low maintenance

### 2. Integration Tests (20%)

**What to test:**
- Component interactions
- State updates across components
- API integration with mocks
- User workflows (multi-step)

**Example:**
```tsx
// src/test-strategy/integration/PromptWorkflow.test.tsx
it('completes full enhancement workflow', async () => {
  render(<App />);
  await user.type(input, 'Create component');
  await user.click(enhanceBtn);
  await waitFor(() => expect(screen.getByText(/enhanced/i)).toBeInTheDocument());
});
```

**Run:** `npm run test:integration`

**When to use:**
- Testing feature workflows
- Verifying component communication
- API integration points

### 3. E2E Tests (10%)

**What to test:**
- Critical user journeys
- Authentication flows
- Payment/checkout (if applicable)
- Data persistence

**Example:**
```ts
// src/test-strategy/e2e/critical-flows.spec.ts
test('user can enhance a prompt end-to-end', async ({ page }) => {
  await page.fill('[data-testid="prompt-input"]', 'Build login form');
  await page.click('button:has-text("Enhance")');
  await expect(page.locator('[data-testid="enhanced-output"]')).toBeVisible();
});
```

**Run:** `npm run test:e2e`

**When to use:**
- Testing complete user flows
- Cross-browser compatibility
- Production-like scenarios

### 4. Visual Regression Tests

**What to test:**
- UI component snapshots
- Layout consistency
- Theme variations
- Responsive breakpoints

**Example:**
```ts
// src/test-strategy/visual/ui-snapshots.spec.ts
test('homepage matches snapshot', async ({ page }) => {
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100,
  });
});
```

**Run:** `npm run test:visual`

**When to use:**
- Preventing unintended UI changes
- Design system consistency
- After CSS/theme updates

### 5. Accessibility Tests

**What to test:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast

**Example:**
```ts
// src/test-strategy/accessibility/a11y.spec.ts
test('homepage has no violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

**Run:** `npm run a11y:test`

**When to use:**
- Every PR (automated)
- After UI changes
- New component creation

### 6. Performance Tests

**What to test:**
- Render performance
- Bundle size
- Core Web Vitals
- Memory leaks

**Example:**
```ts
// src/test-strategy/performance/benchmarks.test.ts
it('renders large list under 100ms', () => {
  const renderTime = measureRenderTime(() => {
    render(<LargeList items={1000} />);
  });
  expect(renderTime).toBeLessThan(100);
});
```

**Run:** `npm run test:perf`

**When to use:**
- Performance-critical features
- Before major releases
- After optimization work

## Mocking Strategy

### API Mocks

```ts
// src/test-strategy/mocks/apiMocks.ts
export const mockEnhancePrompt = vi.fn();
export const mockStreamingResponse = async function* (text: string) {
  for (const chunk of text.split(' ')) {
    yield chunk + ' ';
  }
};
```

**When to mock:**
- External API calls
- Slow operations
- Non-deterministic behavior
- Third-party services

**When NOT to mock:**
- Internal utilities
- Simple functions
- E2E tests (use real APIs)

### Storage Mocks

```ts
export const mockLocalStorage = () => ({
  getItem: vi.fn((key) => store[key] || null),
  setItem: vi.fn((key, value) => { store[key] = value; }),
});
```

## Testing Utilities

### Custom Render

```tsx
// src/test-strategy/utils/testHelpers.tsx
export const renderWithProviders = (ui: ReactElement) => {
  return render(ui, { wrapper: ThemeProvider });
};
```

### Test Data Generators

```ts
export const generatePromptHistory = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `history-${i}`,
    original: `Prompt ${i}`,
    enhanced: `Enhanced ${i}`,
  }));
```

### Accessibility Helpers

```ts
export const checkA11y = async (container: HTMLElement) => {
  const { axe } = await import('axe-core');
  return await axe.run(container);
};
```

## Coverage Requirements

```ts
// vitest.config.ts
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 75,
    statements: 80,
  },
}
```

**Quality Gates:**
- Unit tests: 80% coverage
- Integration tests: No specific coverage (focus on workflows)
- E2E tests: Critical paths only
- All tests must pass before merge

## CI/CD Integration

```yaml
# .github/workflows/test.yml
jobs:
  unit-tests:
    - run: npm run test:unit
    - run: npm run test:coverage
  
  integration-tests:
    - run: npm run test:integration
  
  e2e-tests:
    - run: npx playwright install
    - run: npm run test:e2e
  
  accessibility-tests:
    - run: npm run test:a11y
```

**Pipeline stages:**
1. Unit tests (fast, parallel)
2. Integration tests (medium speed)
3. E2E tests (slow, critical only)
4. Accessibility tests (automated)
5. Quality gate (all must pass)

## When to Use Each Test Type

| Scenario | Test Type | Reason |
|----------|-----------|--------|
| Pure function | Unit | Fast, isolated |
| Component render | Unit | Quick feedback |
| User workflow | Integration | Real interactions |
| Critical path | E2E | End-to-end confidence |
| UI changes | Visual | Prevent regressions |
| New component | Accessibility | WCAG compliance |
| Performance issue | Performance | Benchmark |

## Best Practices

### DO:
- Test user behavior, not implementation
- Use data-testid for stable selectors
- Mock external dependencies
- Keep tests simple and readable
- Run tests locally before push

### DON'T:
- Test implementation details
- Over-mock (test real code)
- Write brittle selectors
- Test third-party libraries
- Skip accessibility tests

## Quick Commands

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Visual regression
npm run test:visual

# Accessibility
npm run a11y:test

# Performance
npm run test:perf

# Coverage report
npm run test:coverage

# Watch mode
npm test -- --watch

# Specific file
npm test IAPatterns.test.tsx
```

## Debugging Tests

```bash
# Debug E2E tests
npm run test:e2e:debug

# UI mode for unit tests
npm run test:ui

# Headed browser
npm run test:e2e:headed

# Specific browser
npm run test:e2e:chromium
```

## Maintenance Guidelines

### Adding New Tests

1. Identify test type needed
2. Use existing patterns from examples
3. Add to appropriate directory
4. Update CI if needed

### Updating Tests

1. Run tests locally first
2. Update snapshots if intentional: `npm test -- -u`
3. Verify coverage doesn't drop
4. Check CI passes

### Removing Tests

1. Ensure functionality still covered
2. Update coverage thresholds if needed
3. Document reason in PR

## Resources

- Unit tests: `src/test-strategy/unit/`
- Integration: `src/test-strategy/integration/`
- E2E: `src/test-strategy/e2e/`
- Mocks: `src/test-strategy/mocks/`
- Utils: `src/test-strategy/utils/`
- CI: `.github/workflows/test.yml`
