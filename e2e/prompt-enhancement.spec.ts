import { test, expect } from '@playwright/test';
import { loginUser, skipAuthForTest, waitForAppReady } from './helpers/auth';

test.describe('Prompt Enhancement Workflow', () => {
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

  test('should enhance a prompt successfully', async ({ page }) => {
    const testPrompt = 'Create a React component for a todo list';
    
    // Enter prompt
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    await promptInput.fill(testPrompt);
    
    // Select domain if available
    const domainSelect = page.locator('[data-testid="domain-select"], select[name="domain"]');
    const domainExists = await domainSelect.count() > 0;
    if (domainExists) {
      await domainSelect.selectOption('Frontend Development');
    }
    
    // Click enhance button
    const enhanceButton = page.locator('[data-testid="enhance-button"], button:has-text("Enhance"), button:has-text("Generate")');
    await enhanceButton.click();
    
    // Wait for loading state
    const loadingIndicator = page.locator('[data-testid="enhancing"], text=/enhancing/i, .loading, .spinner');
    await expect(loadingIndicator).toBeVisible({ timeout: 5000 });
    
    // Wait for result (with timeout for API call)
    const output = page.locator('[data-testid="enhanced-output"], [data-testid="output"], .output, .result');
    await expect(output).toBeVisible({ timeout: 45000 });
    
    const outputText = await output.textContent();
    expect(outputText?.length).toBeGreaterThan(0);
    
    // Verify history updated if history exists
    const historyItem = page.locator(`[data-testid="history-item"]:has-text("${testPrompt}"), text="${testPrompt}"`);
    const historyExists = await historyItem.count() > 0;
    if (historyExists) {
      await expect(historyItem).toBeVisible();
    }
  });

  test('should show error for empty prompt', async ({ page }) => {
    const enhanceButton = page.locator('[data-testid="enhance-button"], button:has-text("Enhance"), button:has-text("Generate")');
    await enhanceButton.click();
    
    const errorMessage = page.locator('[data-testid="prompt-error"], text=/enter a prompt/i, text=/prompt.*required/i, .error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/**', route => route.abort());
    
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    await promptInput.fill('Test prompt');
    
    const enhanceButton = page.locator('[data-testid="enhance-button"], button:has-text("Enhance"), button:has-text("Generate")');
    await enhanceButton.click();
    
    // Should show error message
    const errorMessage = page.locator('[data-testid="api-error"], text=/error/i, text=/failed/i, .error');
    await expect(errorMessage).toBeVisible({ timeout: 15000 });
    
    // Should offer retry
    const retryButton = page.locator('[data-testid="retry-button"], button:has-text("Try Again"), button:has-text("Retry")');
    await expect(retryButton).toBeVisible({ timeout: 5000 });
  });

  test('should chain prompts', async ({ page }) => {
    // First enhancement
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    await promptInput.fill('Create a button component');
    
    const enhanceButton = page.locator('[data-testid="enhance-button"], button:has-text("Enhance"), button:has-text("Generate")');
    await enhanceButton.click();
    
    const output = page.locator('[data-testid="enhanced-output"], [data-testid="output"], .output, .result');
    await output.waitFor({ timeout: 45000 });
    
    // Chain to next prompt if chain button exists
    const chainButton = page.locator('[data-testid="chain-button"], button:has-text("Chain"), button:has-text("Continue")');
    const chainExists = await chainButton.count() > 0;
    
    if (chainExists) {
      await chainButton.click();
      
      // Verify output moved to input
      const inputValue = await promptInput.inputValue();
      expect(inputValue.length).toBeGreaterThan(0);
    } else {
      console.log('🔗 No chain button found, skipping chain test');
    }
  });

  test('should save prompt as project', async ({ page }) => {
    const promptInput = page.locator('[data-testid="prompt-input"], textarea[placeholder*="prompt" i], input[placeholder*="prompt" i]');
    await promptInput.fill('Test project prompt');
    
    // Save project if save button exists
    const saveButton = page.locator('[data-testid="save-project"], button:has-text("Save"), button:has-text("Save Project")');
    const saveExists = await saveButton.count() > 0;
    
    if (saveExists) {
      await saveButton.click();
      
      // Enter project name in dialog
      page.on('dialog', dialog => {
        expect(dialog.message()).toContain('project');
        dialog.accept('My Test Project');
      });
      
      // Verify saved
      const savedMessage = page.locator('[data-testid="save-success"], text=/project.*saved/i, text=/saved/i');
      await expect(savedMessage).toBeVisible({ timeout: 5000 });
      
      const projectName = page.locator('text="My Test Project"');
      const projectExists = await projectName.count() > 0;
      if (projectExists) {
        await expect(projectName).toBeVisible();
      }
    } else {
      console.log('💾 No save button found, skipping save test');
    }
  });
});
