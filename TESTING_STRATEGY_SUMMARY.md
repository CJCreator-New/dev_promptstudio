# Testing Strategy Summary

## Testing Pyramid (70/20/10 Rule)

- **70% Unit Tests** - Fast, isolated, high coverage
- **20% Integration Tests** - Component interactions, workflows
- **10% E2E Tests** - Critical user journeys only

## Files Created

### Test Suites
1. **unit/IAPatterns.test.tsx** - Component unit tests
2. **integration/PromptWorkflow.test.tsx** - Full workflow integration
3. **e2e/critical-flows.spec.ts** - End-to-end user journeys
4. **visual/ui-snapshots.spec.ts** - Visual regression tests
5. **accessibility/a11y.spec.ts** - WCAG compliance tests
6. **performance/benchmarks.test.ts** - Performance benchmarks
7. **performance/lighthouse.spec.ts** - Core Web Vitals

### Utilities
8. **mocks/apiMocks.ts** - API mocking utilities
9. **utils/testHelpers.tsx** - Custom render, generators, helpers

### Configuration
10. **vitest.config.ts** - Unit/integration test config with coverage
11. **playwright-visual.config.ts** - Visual regression config
12. **.github/workflows/test.yml** - CI/CD pipeline

### Documentation
13. **docs/TESTING_STRATEGY.md** - Complete testing guide

## Quick Start

### Run Tests
```bash
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:e2e          # E2E tests
npm run test:visual       # Visual regression
npm run test:perf         # Performance
npm run a11y:test         # Accessibility
npm run test:coverage     # Coverage report
```

### Write Tests

**Unit Test:**
```tsx
import { render, screen } from '@testing-library/react';

it('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

**Integration Test:**
```tsx
import { renderWithProviders } from '../utils/testHelpers';
import userEvent from '@testing-library/user-event';

it('completes workflow', async () => {
  const user = userEvent.setup();
  renderWithProviders(<App />);
  await user.type(input, 'text');
  await user.click(button);
  expect(screen.getByText('result')).toBeInTheDocument();
});
```

**E2E Test:**
```ts
test('user journey', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="input"]', 'text');
  await page.click('button:has-text("Submit")');
  await expect(page.locator('[data-testid="result"]')).toBeVisible();
});
```

## Mocking Strategy

### API Mocks
```ts
import { mockEnhancePrompt } from '../mocks/apiMocks';

mockEnhancePrompt.mockResolvedValue('result');
```

### Storage Mocks
```ts
import { mockLocalStorage } from '../mocks/apiMocks';

const storage = mockLocalStorage();
storage.setItem('key', 'value');
```

### Streaming Mocks
```ts
import { mockStreamingResponse } from '../mocks/apiMocks';

for await (const chunk of mockStreamingResponse('text')) {
  console.log(chunk);
}
```

## Coverage Thresholds

```ts
thresholds: {
  lines: 80,
  functions: 80,
  branches: 75,
  statements: 80,
}
```

## CI/CD Pipeline

```
┌─────────────┐
│ Unit Tests  │ → Fast, parallel
├─────────────┤
│ Integration │ → Medium speed
├─────────────┤
│ E2E Tests   │ → Critical paths
├─────────────┤
│ A11y Tests  │ → WCAG compliance
├─────────────┤
│ Quality Gate│ → All must pass
└─────────────┘
```

## Test Selection Guide

| What to Test | Test Type | Example |
|--------------|-----------|---------|
| Pure function | Unit | `formatDate(date)` |
| Component render | Unit | `<Button />` renders |
| User interaction | Integration | Click → state update |
| Full workflow | E2E | Login → dashboard |
| UI consistency | Visual | Snapshot comparison |
| Accessibility | A11y | WCAG violations |
| Performance | Perf | Render < 100ms |

## Best Practices

### DO ✅
- Test user behavior
- Use semantic queries (`getByRole`, `getByLabelText`)
- Mock external APIs
- Keep tests simple
- Run locally before push

### DON'T ❌
- Test implementation details
- Over-mock internal code
- Use brittle selectors (`.class-name-123`)
- Test third-party libraries
- Skip accessibility tests

## Debugging

```bash
# Debug E2E
npm run test:e2e:debug

# UI mode
npm run test:ui

# Headed browser
npm run test:e2e:headed

# Update snapshots
npm test -- -u
```

## Key Features

### 1. Balanced Coverage
- Focus on critical paths
- Avoid over-testing
- Maintainable test suite

### 2. Fast Feedback
- Unit tests run in < 1s
- Integration tests < 10s
- E2E tests only for critical flows

### 3. Comprehensive Mocking
- API responses
- Storage (localStorage, IndexedDB)
- Streaming data
- User authentication

### 4. Accessibility First
- Automated WCAG checks
- axe-core integration
- Every PR tested

### 5. Performance Monitoring
- Render benchmarks
- Core Web Vitals
- Lighthouse scores

### 6. CI/CD Integration
- Automated on every push
- Quality gates enforce standards
- Coverage reports to Codecov

## Directory Structure

```
src/test-strategy/
├── unit/              # Component & function tests
├── integration/       # Workflow tests
├── e2e/              # Critical user journeys
├── visual/           # UI snapshots
├── accessibility/    # WCAG compliance
├── performance/      # Benchmarks
├── mocks/            # API & storage mocks
└── utils/            # Test helpers
```

## Next Steps

1. **Run existing tests:** `npm test`
2. **Add data-testid to components** for stable selectors
3. **Write tests for new features** before implementation (TDD)
4. **Review coverage:** `npm run test:coverage`
5. **Check CI pipeline** passes on every PR

## Resources

- Testing guide: `docs/TESTING_STRATEGY.md`
- Test examples: `src/test-strategy/`
- CI config: `.github/workflows/test.yml`
- Coverage config: `vitest.config.ts`
