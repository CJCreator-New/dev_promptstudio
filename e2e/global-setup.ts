import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking if app is ready...');
    
    // Wait for app to be available
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for React app to mount
    await page.waitForSelector('#root', { timeout: 30000 });
    
    // Wait for main app content (not auth modal)
    await page.waitForSelector('[data-testid="app-shell"], main, .app-container', { 
      timeout: 10000,
      state: 'attached'
    });
    
    console.log('✅ App is ready for testing');
    
  } catch (error) {
    console.error('❌ App health check failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;