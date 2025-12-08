import { test, expect } from '@playwright/test';
import { loginUser, waitForAppReady, skipAuthForTest } from './helpers/auth';

test.describe('Cross-Browser Compatibility', () => {
  test('should authenticate successfully on all browsers', async ({ page, browserName }) => {
    console.log(`🧪 Testing auth on ${browserName}`);
    
    try {
      await loginUser(page);
      
      // Verify we're past the auth screen
      const mainContent = page.locator('[data-testid="app-shell"], main, .app-container');
      await expect(mainContent).toBeVisible({ timeout: 10000 });
      
      console.log(`✅ Auth works on ${browserName}`);
    } catch (error) {
      console.error(`❌ Auth failed on ${browserName}:`, error);
      await page.screenshot({ path: `test-results/auth-failure-${browserName}-${Date.now()}.png` });
      throw error;
    }
  });
  
  test('should display basic UI elements after auth', async ({ page, browserName }) => {
    await loginUser(page);
    
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    const enhanceButton = page.locator('[data-testid="enhance-button"], button:has-text("Enhance"), button:has-text("Generate")');
    
    await expect(promptInput).toBeVisible({ timeout: 10000 });
    await expect(enhanceButton).toBeVisible({ timeout: 10000 });
    
    console.log(`✅ Basic UI works on ${browserName}`);
  });

  test('should handle localStorage across browsers', async ({ page }) => {
    await loginUser(page);
    
    const testData = 'Test prompt data';
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    
    await promptInput.fill(testData);
    await page.waitForTimeout(1000); // Allow auto-save
    
    await page.reload();
    await waitForAppReady(page);
    
    // May need to login again after reload
    const authDialog = page.locator('[data-testid="auth-dialog"], [role="dialog"]');
    const isAuthVisible = await authDialog.isVisible();
    if (isAuthVisible) {
      await loginUser(page);
    }
    
    const value = await promptInput.inputValue();
    expect(value).toBe(testData);
  });

  test('should render CSS correctly', async ({ page }) => {
    await loginUser(page);
    
    const button = page.locator('[data-testid="enhance-button"], button:has-text("Enhance"), button:has-text("Generate")');
    await expect(button).toBeVisible();
    
    const bgColor = await button.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(bgColor).toBeTruthy();
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
  });

  test('should handle touch events on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }
    
    await loginUser(page);
    
    const menuButton = page.locator('[data-testid="mobile-menu"], button:has-text("Menu"), .hamburger-menu');
    const menuExists = await menuButton.count() > 0;
    
    if (menuExists) {
      await menuButton.tap();
      const navigation = page.locator('[data-testid="navigation"], nav, .mobile-nav');
      await expect(navigation).toBeVisible({ timeout: 5000 });
    } else {
      console.log('📱 No mobile menu found, skipping touch test');
    }
  });
});
