import { test, expect } from '@playwright/test';
import { loginUser, skipAuthForTest, waitForAppReady } from './helpers/auth';

test.describe('Form Validation and Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await skipAuthForTest(page);
    await page.goto('/');
    await waitForAppReady(page);
    
    // Only login if auth dialog is visible
    const authDialog = page.locator('[data-testid="auth-dialog"], [role="dialog"]');
    const isAuthVisible = await authDialog.isVisible();
    if (isAuthVisible) {
      await loginUser(page);
    }
  });

  test('should validate template creation form', async ({ page }) => {
    // Open create template modal
    const createButton = page.locator('[data-testid="create-template"], button:has-text("Create Template"), button:has-text("New Template")');
    await createButton.click();
    
    // Try to save without filling required fields
    const saveButton = page.locator('[data-testid="save-template"], button[type="submit"], button:has-text("Save"), button:has-text("Create")');
    await saveButton.click();
    
    // Should show validation errors
    const errorMessage = page.locator('[data-testid="validation-error"], .error, text=/required/i');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should validate template name length', async ({ page }) => {
    const createButton = page.locator('[data-testid="create-template"], button:has-text("Create Template"), button:has-text("New Template")');
    await createButton.click();
    
    // Enter very long name
    const longName = 'a'.repeat(200);
    const nameInput = page.locator('[data-testid="template-name"], input[placeholder*="name" i], input[name="name"]');
    await nameInput.fill(longName);
    
    // Should show error or truncate
    const inputValue = await nameInput.inputValue();
    expect(inputValue.length).toBeLessThanOrEqual(100);
  });

  test('should validate API key format', async ({ page }) => {
    const apiButton = page.locator('[data-testid="api-keys-button"], button:has-text("API Keys"), button:has-text("Settings")');
    await apiButton.click();
    
    // Enter invalid API key
    const keyInput = page.locator('[data-testid="gemini-key-input"], input[placeholder*="gemini" i], input[name*="gemini" i]');
    await keyInput.fill('invalid-key');
    
    const verifyButton = page.locator('[data-testid="verify-key"], button:has-text("Verify"), button:has-text("Save")');
    await verifyButton.click();
    
    // Should show error
    const errorMessage = page.locator('[data-testid="api-key-error"], .error, text=/invalid/i, text=/error/i');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('should handle network errors', async ({ page }) => {
    // Simulate offline
    await page.context().setOffline(true);
    
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    await promptInput.fill('Test prompt');
    
    const enhanceButton = page.locator('[data-testid="enhance-button"], button:has-text("Enhance"), button:has-text("Generate")');
    await enhanceButton.click();
    
    // Should show offline indicator
    const offlineIndicator = page.locator('[data-testid="offline-indicator"], text=/offline/i, text=/connection/i, .offline');
    await expect(offlineIndicator).toBeVisible({ timeout: 10000 });
    
    // Restore online
    await page.context().setOffline(false);
  });

  test('should prevent duplicate submissions', async ({ page }) => {
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    await promptInput.fill('Test prompt');
    
    // Click enhance multiple times rapidly
    const enhanceButton = page.locator('[data-testid="enhance-button"], button:has-text("Enhance"), button:has-text("Generate")');
    await enhanceButton.click();
    await enhanceButton.click();
    await enhanceButton.click();
    
    // Should only process once (button disabled or loading state)
    const isDisabled = await enhanceButton.isDisabled();
    const hasLoadingState = await page.locator('[data-testid="loading"], .loading, .spinner').isVisible();
    
    expect(isDisabled || hasLoadingState).toBe(true);
  });

  test('should show character count for inputs', async ({ page }) => {
    const testText = 'a'.repeat(50);
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    await promptInput.fill(testText);
    
    // Should show character count
    const charCount = page.locator('[data-testid="char-count"], text=/50.*character/i, text=/character.*50/i');
    await expect(charCount).toBeVisible({ timeout: 5000 });
  });

  test('should validate domain selection', async ({ page }) => {
    // Domain should have default value
    const domainSelect = page.locator('[data-testid="domain-select"], select[name="domain"], select:has(option)');
    const value = await domainSelect.inputValue();
    expect(value).toBeTruthy();
  });
});
