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
    
    // Wait for any content to load (more flexible)
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    }, { timeout: 15000 });
    
    console.log('✅ App is ready for testing');
    
  } catch (error) {
    console.error('❌ App health check failed:', error);
    // Don't throw - let individual tests handle their own setup
    console.log('⚠️ Continuing with tests despite health check failure');
  } finally {
    await browser.close();
  }
}

export default globalSetup;