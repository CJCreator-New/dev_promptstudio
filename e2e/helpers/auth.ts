import { Page, expect } from '@playwright/test';

export async function loginUser(page: Page, email?: string, password?: string) {
  await page.goto('/');
  
  // Wait for app to be ready
  await page.waitForSelector('#root', { timeout: 10000 });
  
  // Check if already logged in
  const isLoggedIn = await page.locator('[data-testid="user-profile"], [data-testid="logout-button"]').count() > 0;
  if (isLoggedIn) {
    console.log('✅ User already logged in');
    return { email: 'existing-user@example.com', password: 'existing' };
  }
  
  const testEmail = email || `test-${Date.now()}@example.com`;
  const testPassword = password || 'TestPassword123!';
  
  try {
    // Wait for auth dialog with better timeout and error message
    const authDialog = page.locator('[data-testid="auth-dialog"], [role="dialog"]');
    await authDialog.waitFor({ timeout: 10000 });
    
    // Fill form using more robust selectors
    const emailInput = page.locator('[data-testid="email-input"], input[type="email"], [placeholder*="email" i]');
    const passwordInput = page.locator('[data-testid="password-input"], input[type="password"], [placeholder*="password" i]');
    const submitButton = page.locator('[data-testid="login-submit"], button[type="submit"], button:has-text("Sign In")');
    
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await submitButton.click();
    
    // Wait for login to complete
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    console.log('✅ Login completed');
    return { email: testEmail, password: testPassword };
    
  } catch (error) {
    console.error('❌ Login failed:', error);
    
    // Take screenshot for debugging
    await page.screenshot({ path: `test-results/login-failure-${Date.now()}.png` });
    
    throw new Error(`Login failed: Auth dialog not found or login process failed. ${error}`);
  }
}

export async function setupApiKey(page: Page, provider: 'gemini' | 'openai' | 'claude' = 'gemini') {
  const apiButton = page.locator('[data-testid="api-keys-button"], button:has-text("API Keys")');
  await apiButton.click();
  
  const testKey = `test-key-${Date.now()}`;
  const keyInput = page.locator(`[data-testid="${provider}-key-input"], input[placeholder*="${provider}" i]`);
  await keyInput.fill(testKey);
  
  const saveButton = page.locator('[data-testid="save-api-key"], button:has-text("Save"), button:has-text("Verify")');
  await saveButton.click();
  await page.waitForTimeout(1000);
  
  return testKey;
}

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    // Clear IndexedDB if available
    if ('indexedDB' in window) {
      indexedDB.deleteDatabase('devprompt-studio');
    }
  });
}

export async function waitForApiResponse(page: Page, timeout = 30000) {
  return page.waitForResponse(
    response => response.url().includes('/api/') && response.status() === 200,
    { timeout }
  );
}

export async function skipAuthForTest(page: Page) {
  // Set auth bypass in localStorage
  await page.addInitScript(() => {
    localStorage.setItem('skipAuth', 'true');
    localStorage.setItem('testMode', 'true');
  });
}

export async function waitForAppReady(page: Page) {
  // Wait for React app to mount and be interactive
  await page.waitForSelector('#root', { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  
  // Wait for main app elements
  await page.waitForSelector('[data-testid="app-shell"], main, .app-container', { 
    timeout: 5000,
    state: 'attached'
  });
}
