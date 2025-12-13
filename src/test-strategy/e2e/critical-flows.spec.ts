import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('skipAuth', 'true'));
  });

  test('user can enhance a prompt end-to-end', async ({ page }) => {
    // Navigate and enter prompt
    await page.fill('[data-testid="prompt-input"]', 'Build a login form');
    
    // Select options
    await page.selectOption('[data-testid="domain-select"]', 'Frontend');
    await page.selectOption('[data-testid="mode-select"]', 'Detailed');
    
    // Enhance
    await page.click('button:has-text("Enhance")');
    
    // Wait for result
    await expect(page.locator('[data-testid="enhanced-output"]')).toBeVisible({ timeout: 10000 });
    
    // Verify history
    await expect(page.locator('[data-testid="history-item"]').first()).toBeVisible();
  });

  test('user can save and load project', async ({ page }) => {
    await page.fill('[data-testid="prompt-input"]', 'Test project');
    
    // Save project
    await page.click('button:has-text("Save")');
    await page.fill('[data-testid="project-name-input"]', 'My Project');
    await page.click('button:has-text("Confirm")');
    
    // Clear input
    await page.fill('[data-testid="prompt-input"]', '');
    
    // Load project
    await page.click('[data-testid="history-sidebar"]');
    await page.click('text=My Project');
    
    // Verify loaded
    await expect(page.locator('[data-testid="prompt-input"]')).toHaveValue('Test project');
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'prompt-input');
    
    await page.keyboard.press('Control+K');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'prompt-input');
  });
});
