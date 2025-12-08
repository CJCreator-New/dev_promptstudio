import { test, expect } from '@playwright/test';
import { waitForAppReady, clearLocalStorage } from './helpers/auth';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear auth bypass for auth tests
    await context.clearCookies();
    await clearLocalStorage(page);
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('should display auth modal on first visit', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('skipAuth');
      localStorage.removeItem('testMode');
    });
    await page.reload();
    await waitForAppReady(page);
    
    const authDialog = page.locator('[data-testid="auth-dialog"], [role="dialog"]');
    await expect(authDialog).toBeVisible({ timeout: 15000 });
    
    const signInText = page.locator('text=/sign in/i, [data-testid="sign-in-button"]');
    await expect(signInText).toBeVisible();
  });

  test('should login with email and password', async ({ page }) => {
    const email = `test-${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    // Wait for auth dialog
    const authDialog = page.locator('[data-testid="auth-dialog"], [role="dialog"]');
    await expect(authDialog).toBeVisible({ timeout: 15000 });

    // Fill login form with robust selectors
    const emailInput = page.locator('[data-testid="email-input"], input[type="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('[data-testid="password-input"], input[type="password"], input[placeholder*="password" i]');
    const submitButton = page.locator('[data-testid="login-submit"], button[type="submit"], button:has-text("Sign In")');
    
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await submitButton.click();
    
    // Wait for auth to complete
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Verify logged in - check for user profile or logout button
    const userIndicator = page.locator(`[data-testid="user-profile"]:has-text("${email}"), [data-testid="logout-button"], text="${email}"`);
    await expect(userIndicator).toBeVisible({ timeout: 10000 });
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    // Wait for auth dialog
    const authDialog = page.locator('[data-testid="auth-dialog"], [role="dialog"]');
    await expect(authDialog).toBeVisible({ timeout: 15000 });
    
    const emailInput = page.locator('[data-testid="email-input"], input[type="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('[data-testid="password-input"], input[type="password"], input[placeholder*="password" i]');
    const submitButton = page.locator('[data-testid="login-submit"], button[type="submit"], button:has-text("Sign In")');
    
    await emailInput.fill('invalid-email');
    await passwordInput.fill('password');
    await submitButton.click();
    
    const errorMessage = page.locator('[data-testid="email-error"], text=/valid email/i, .error:has-text("email")');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page, context }) => {
    // Login first
    const authDialog = page.locator('[data-testid="auth-dialog"], [role="dialog"]');
    await expect(authDialog).toBeVisible({ timeout: 15000 });
    
    const emailInput = page.locator('[data-testid="email-input"], input[type="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('[data-testid="password-input"], input[type="password"], input[placeholder*="password" i]');
    const submitButton = page.locator('[data-testid="login-submit"], button[type="submit"], button:has-text("Sign In")');
    
    await emailInput.fill('test@example.com');
    await passwordInput.fill('TestPassword123!');
    await submitButton.click();
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Logout
    const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Sign Out")');
    await logoutButton.click();
    
    // Handle confirmation dialog if it appears
    page.on('dialog', dialog => dialog.accept());
    
    // Verify redirected to auth
    await expect(authDialog).toBeVisible({ timeout: 10000 });
  });
});
