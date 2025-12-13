import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('skipAuth', 'true'));
  });

  test('homepage matches snapshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('prompt input area matches snapshot', async ({ page }) => {
    const input = page.locator('[data-testid="prompt-input"]');
    await expect(input).toHaveScreenshot('prompt-input.png');
  });

  test('modal dialog matches snapshot', async ({ page }) => {
    await page.click('button:has-text("Settings")');
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toHaveScreenshot('settings-modal.png');
  });

  test('dark theme matches snapshot', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page).toHaveScreenshot('dark-theme.png');
  });

  test('mobile viewport matches snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('mobile-view.png');
  });
});
