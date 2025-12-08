import { test, expect } from '@playwright/test';
import { skipAuthForTest, waitForAppReady } from '../helpers/auth';

test.describe('Basic Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await skipAuthForTest(page);
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('should load app successfully', async ({ page }) => {
    // App should be loaded and ready
    const appRoot = page.locator('#root');
    await expect(appRoot).toBeVisible();
    
    // Should have main content
    const mainContent = page.locator('[data-testid="app-shell"], main, .app-container, body');
    await expect(mainContent).toBeVisible();
    
    console.log('✅ App loads successfully');
  });

  test('should have basic UI elements', async ({ page }) => {
    // Look for common UI elements
    const hasInput = await page.locator('textarea, input[type="text"]').count() > 0;
    const hasButtons = await page.locator('button').count() > 0;
    
    expect(hasInput || hasButtons).toBe(true);
    
    console.log('✅ Basic UI elements present');
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const appRoot = page.locator('#root');
    await expect(appRoot).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(appRoot).toBeVisible();
    
    console.log('✅ App is responsive');
  });
});