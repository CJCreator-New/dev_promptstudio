import { test, expect } from '@playwright/test';

test.describe('Critical Smoke Tests', () => {
  test('app loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(/DevPrompt Studio/i);
  });

  test('main input is accessible', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('#main-input, textarea[placeholder*="prompt"]').first();
    await expect(input).toBeVisible();
    await input.fill('Test prompt');
    await expect(input).toHaveValue('Test prompt');
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(errors.filter(e => !e.includes('Firebase'))).toHaveLength(0);
  });

  test('responsive layout works', async ({ page, viewport }) => {
    await page.goto('/');
    
    if (viewport && viewport.width < 768) {
      // Mobile: sidebar should be hidden
      const sidebar = page.locator('[role="dialog"][aria-label*="History"]');
      await expect(sidebar).not.toBeVisible();
    } else {
      // Desktop: main content visible
      const main = page.locator('main');
      await expect(main).toBeVisible();
    }
  });
});
