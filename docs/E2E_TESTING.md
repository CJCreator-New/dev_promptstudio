# End-to-End Testing Guide

Comprehensive E2E testing using Playwright for DevPrompt Studio.

## 🚀 Quick Start

### Installation

```bash
npm install -D @playwright/test
npx playwright install
```

### Run Tests

```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test e2e/auth.spec.ts

# Run in headed mode
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📁 Test Structure

```
e2e/
├── auth.spec.ts              # Authentication flows
├── prompt-enhancement.spec.ts # Core feature workflows
├── navigation.spec.ts         # Navigation and transitions
├── form-validation.spec.ts    # Form validation and errors
├── cross-browser.spec.ts      # Cross-browser compatibility
└── helpers/
    └── auth.ts               # Reusable test helpers
```

## 🧪 Test Categories

### 1. Authentication Tests (`auth.spec.ts`)

**Coverage:**
- Login with email/password
- Email validation
- Password validation
- Logout flow
- Session persistence

**Example:**
```typescript
test('should login successfully', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel(/email/i).fill('test@example.com');
  await page.getByLabel(/password/i).fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  
  await expect(page.getByText('test@example.com')).toBeVisible();
});
```

### 2. Prompt Enhancement Tests (`prompt-enhancement.spec.ts`)

**Coverage:**
- Prompt enhancement workflow
- Domain selection
- API integration
- Error handling
- Chaining prompts
- Saving projects

**Async Handling:**
```typescript
test('should enhance prompt', async ({ page }) => {
  await page.getByLabel(/prompt/i).fill('Create a button');
  await page.getByRole('button', { name: /enhance/i }).click();
  
  // Wait for async operation
  await expect(page.getByTestId('output')).toBeVisible({ 
    timeout: 30000 
  });
});
```

### 3. Navigation Tests (`navigation.spec.ts`)

**Coverage:**
- Tab navigation
- Modal open/close
- Mobile menu
- State preservation
- Keyboard shortcuts

**Example:**
```typescript
test('should navigate tabs', async ({ page }) => {
  await page.getByRole('tab', { name: /history/i }).click();
  await expect(page.getByText(/recent/i)).toBeVisible();
});
```

### 4. Form Validation Tests (`form-validation.spec.ts`)

**Coverage:**
- Required field validation
- Format validation
- Character limits
- Network error handling
- Duplicate submission prevention

**Example:**
```typescript
test('should validate required fields', async ({ page }) => {
  await page.getByRole('button', { name: /save/i }).click();
  await expect(page.getByText(/required/i)).toBeVisible();
});
```

### 5. Cross-Browser Tests (`cross-browser.spec.ts`)

**Coverage:**
- Chrome/Chromium
- Firefox
- Safari/WebKit
- Mobile Chrome
- Mobile Safari

**Example:**
```typescript
test('should work on all browsers', async ({ page, browserName }) => {
  await page.goto('/');
  console.log(`Testing on ${browserName}`);
  await expect(page.getByRole('main')).toBeVisible();
});
```

## 🛠️ Helper Functions

### Authentication Helper

```typescript
import { loginUser } from './helpers/auth';

test('my test', async ({ page }) => {
  await loginUser(page);
  // Test authenticated features
});
```

### API Key Setup

```typescript
import { setupApiKey } from './helpers/auth';

test('test with API key', async ({ page }) => {
  await loginUser(page);
  await setupApiKey(page, 'gemini');
  // Test API-dependent features
});
```

### Wait for API Response

```typescript
import { waitForApiResponse } from './helpers/auth';

test('test API call', async ({ page }) => {
  const responsePromise = waitForApiResponse(page);
  await page.getByRole('button', { name: /enhance/i }).click();
  await responsePromise;
});
```

## 🎯 Best Practices

### 1. Use Semantic Selectors

```typescript
// ✅ Good - semantic and resilient
await page.getByRole('button', { name: /submit/i });
await page.getByLabel(/email/i);
await page.getByText(/welcome/i);

// ❌ Bad - brittle
await page.locator('.btn-submit');
await page.locator('#email-input');
```

### 2. Handle Async Operations

```typescript
// ✅ Good - explicit timeout
await expect(page.getByText(/success/i)).toBeVisible({ 
  timeout: 10000 
});

// ✅ Good - wait for network
await page.waitForResponse(response => 
  response.url().includes('/api/enhance')
);

// ❌ Bad - arbitrary wait
await page.waitForTimeout(5000);
```

### 3. Clean Up After Tests

```typescript
test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});
```

### 4. Handle Dialogs

```typescript
page.on('dialog', dialog => dialog.accept());
await page.getByRole('button', { name: /delete/i }).click();
```

### 5. Mock API Responses

```typescript
await page.route('**/api/enhance', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ result: 'mocked response' })
  });
});
```

## 🐛 Debugging

### Visual Debugging

```bash
# Run with headed browser
npx playwright test --headed

# Run with slow motion
npx playwright test --headed --slow-mo=1000

# Debug specific test
npx playwright test --debug auth.spec.ts
```

### Screenshots and Videos

```typescript
// Take screenshot
await page.screenshot({ path: 'screenshot.png' });

// Videos are automatically recorded on failure
// Check test-results/ directory
```

### Trace Viewer

```bash
# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

## 📊 CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 🔍 Test Reports

### HTML Report

```bash
# Generate and open report
npx playwright show-report
```

### JSON Report

```bash
# Results in test-results/results.json
cat test-results/results.json | jq
```

## 📈 Coverage

### What's Tested

- ✅ Authentication (login, logout, validation)
- ✅ Prompt enhancement (core workflow)
- ✅ Navigation (tabs, modals, mobile)
- ✅ Form validation (required fields, formats)
- ✅ Error handling (network, API, validation)
- ✅ Cross-browser (Chrome, Firefox, Safari)
- ✅ Mobile (responsive, touch events)
- ✅ Keyboard shortcuts
- ✅ State persistence

### What's Not Tested

- ❌ Visual regression (use Percy/Chromatic)
- ❌ Performance (use Lighthouse)
- ❌ Accessibility (use axe-core)

## 🚨 Common Issues

### Issue: Tests timeout

**Solution:**
```typescript
// Increase timeout for slow operations
test.setTimeout(60000);

// Or per assertion
await expect(element).toBeVisible({ timeout: 30000 });
```

### Issue: Flaky tests

**Solution:**
```typescript
// Use auto-waiting
await page.getByRole('button').click();

// Wait for network idle
await page.waitForLoadState('networkidle');

// Retry failed tests
test.describe.configure({ retries: 2 });
```

### Issue: Element not found

**Solution:**
```typescript
// Wait for element
await page.waitForSelector('[data-testid="output"]');

// Check visibility
await expect(element).toBeVisible();

// Use more specific selectors
await page.getByRole('button', { name: /exact text/i });
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Selectors Guide](https://playwright.dev/docs/selectors)

## 🎓 Writing New Tests

### Template

```typescript
import { test, expect } from '@playwright/test';
import { loginUser } from './helpers/auth';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/feature');
    
    // Act
    await page.getByRole('button').click();
    
    // Assert
    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
```

## 🔄 Maintenance

### Update Selectors

When UI changes, update selectors in tests:

```typescript
// Before
await page.locator('.old-class').click();

// After
await page.getByRole('button', { name: /new text/i }).click();
```

### Update Helpers

Keep helper functions in sync with app changes:

```typescript
// helpers/auth.ts
export async function loginUser(page: Page) {
  // Update if login flow changes
}
```

## 📝 Checklist for New Features

- [ ] Write E2E test for happy path
- [ ] Test error scenarios
- [ ] Test validation
- [ ] Test on mobile
- [ ] Test keyboard navigation
- [ ] Add to CI/CD pipeline
- [ ] Document in this guide
