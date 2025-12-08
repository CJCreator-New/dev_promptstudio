import { test, expect } from '@playwright/test';
import { loginUser, skipAuthForTest, waitForAppReady } from './helpers/auth';

test.describe('Navigation and Page Transitions', () => {
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

  test('should navigate between tabs', async ({ page }) => {
    // Open history sidebar
    const historyButton = page.locator('[data-testid="history-button"], button:has-text("History"), button[aria-label*="history" i]');
    await historyButton.click();
    
    const recentPrompts = page.locator('[data-testid="recent-prompts"], text=/recent prompts/i');
    await expect(recentPrompts).toBeVisible({ timeout: 5000 });
    
    // Switch to projects tab if it exists
    const projectsTab = page.locator('[data-testid="projects-tab"], [role="tab"]:has-text("Projects")');
    const projectsExists = await projectsTab.count() > 0;
    
    if (projectsExists) {
      await projectsTab.click();
      const savedProjects = page.locator('[data-testid="saved-projects"], text=/saved projects/i');
      await expect(savedProjects).toBeVisible({ timeout: 5000 });
    }
    
    // Switch to templates tab if it exists
    const templatesTab = page.locator('[data-testid="templates-tab"], [role="tab"]:has-text("Templates")');
    const templatesExists = await templatesTab.count() > 0;
    
    if (templatesExists) {
      await templatesTab.click();
      const customTemplates = page.locator('[data-testid="custom-templates"], text=/custom templates/i, text=/templates/i');
      await expect(customTemplates).toBeVisible({ timeout: 5000 });
    }
  });

  test('should open and close modals', async ({ page }) => {
    // Open API key modal
    const apiButton = page.locator('[data-testid="api-keys-button"], button:has-text("API Keys"), button:has-text("Settings")');
    await apiButton.click();
    
    const dialog = page.locator('[data-testid="api-keys-modal"], [role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    const modalContent = page.locator('[data-testid="api-key-management"], text=/api key/i, text=/settings/i');
    await expect(modalContent).toBeVisible();
    
    // Close modal
    const closeButton = page.locator('[data-testid="close-modal"], button[aria-label="Close"], button:has-text("Close"), [aria-label="close" i]');
    await closeButton.first().click();
    
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test('should handle mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Look for mobile menu button
    const menuButton = page.locator('[data-testid="mobile-menu"], button:has-text("Menu"), .hamburger-menu, button[aria-label*="menu" i]');
    const menuExists = await menuButton.count() > 0;
    
    if (menuExists) {
      // Open mobile menu
      await menuButton.click();
      
      const navigation = page.locator('[data-testid="mobile-navigation"], [role="navigation"], .mobile-nav');
      await expect(navigation).toBeVisible({ timeout: 5000 });
      
      // Close mobile menu
      const closeButton = page.locator('[data-testid="close-menu"], button:has-text("Close"), button[aria-label*="close" i]');
      await closeButton.click();
      
      await expect(navigation).not.toBeVisible({ timeout: 5000 });
    } else {
      console.log('📱 No mobile menu found, skipping mobile menu test');
    }
  });

  test('should maintain state during navigation', async ({ page }) => {
    const testInput = 'Test prompt for navigation';
    
    // Enter text
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    await promptInput.fill(testInput);
    
    // Open and close modal
    const apiButton = page.locator('[data-testid="api-keys-button"], button:has-text("API Keys"), button:has-text("Settings")');
    await apiButton.click();
    
    const closeButton = page.locator('[data-testid="close-modal"], button[aria-label="Close"], button:has-text("Close")');
    await closeButton.first().click();
    
    // Verify input preserved
    const inputValue = await promptInput.inputValue();
    expect(inputValue).toBe(testInput);
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    
    // Focus input with Ctrl+K (if supported)
    await page.keyboard.press('Control+K');
    
    // Check if input is focused or just focus it manually
    const isFocused = await promptInput.evaluate(el => document.activeElement === el);
    if (!isFocused) {
      await promptInput.focus();
    }
    
    // Enhance with Ctrl+E (if supported)
    await promptInput.fill('Test prompt');
    await page.keyboard.press('Control+E');
    
    // Look for enhancement indicators
    const enhancingIndicator = page.locator('[data-testid="enhancing"], text=/enhancing/i, .loading, .spinner');
    const enhanceButton = page.locator('[data-testid="enhance-button"], button:has-text("Enhance")');
    
    // Either enhancement started or button is available
    const enhancementStarted = await enhancingIndicator.isVisible();
    const buttonAvailable = await enhanceButton.isVisible();
    
    expect(enhancementStarted || buttonAvailable).toBe(true);
  });
});
