import { test, expect } from '@playwright/test';
import { waitForAppReady } from '../helpers/auth';

test.describe('Auth Stability Tests', () => {
  test('should load app and show auth dialog reliably', async ({ page, browserName }) => {
    console.log(`🧪 Testing auth dialog on ${browserName}`);
    
    // Clear any existing auth state
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await page.goto('/');
    await waitForAppReady(page);
    
    // Should show auth dialog within reasonable time
    const authDialog = page.locator('[data-testid="auth-dialog"], [role="dialog"]');
    await expect(authDialog).toBeVisible({ timeout: 15000 });
    
    // Should have email and password inputs
    const emailInput = page.locator('[data-testid="email-input"], input[type="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('[data-testid="password-input"], input[type="password"], input[placeholder*="password" i]');
    const submitButton = page.locator('[data-testid="login-submit"], button[type="submit"], button:has-text("Sign In")');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    console.log(`✅ Auth dialog works on ${browserName}`);
  });
  
  test('should complete login flow', async ({ page, browserName }) => {
    console.log(`🔐 Testing login flow on ${browserName}`);
    
    await page.goto('/');
    await waitForAppReady(page);
    
    const authDialog = page.locator('[data-testid="auth-dialog"], [role="dialog"]');
    await expect(authDialog).toBeVisible({ timeout: 15000 });
    
    // Fill login form
    const email = `test-${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    
    const emailInput = page.locator('[data-testid="email-input"], input[type="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('[data-testid="password-input"], input[type="password"], input[placeholder*="password" i]');
    const submitButton = page.locator('[data-testid="login-submit"], button[type="submit"], button:has-text("Sign In")');
    
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await submitButton.click();
    
    // Wait for login to complete
    await page.waitForLoadState('networkidle', { timeout: 20000 });
    
    // Should be past auth screen
    const mainContent = page.locator('[data-testid="app-shell"], main, .app-container');
    await expect(mainContent).toBeVisible({ timeout: 10000 });
    
    console.log(`✅ Login flow works on ${browserName}`);
  });
  
  test('should handle auth bypass for testing', async ({ page }) => {
    // Set auth bypass
    await page.addInitScript(() => {
      localStorage.setItem('skipAuth', 'true');
      localStorage.setItem('testMode', 'true');
    });
    
    await page.goto('/');
    await waitForAppReady(page);
    
    // Should skip auth and go straight to main app
    const mainContent = page.locator('[data-testid="app-shell"], main, .app-container');
    await expect(mainContent).toBeVisible({ timeout: 10000 });
    
    // Auth dialog should not be visible
    const authDialog = page.locator('[data-testid="auth-dialog"], [role="dialog"]');
    await expect(authDialog).not.toBeVisible();
    
    console.log('✅ Auth bypass works for testing');
  });
});