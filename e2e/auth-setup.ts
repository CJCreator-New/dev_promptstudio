import { chromium, FullConfig } from '@playwright/test';
import { loginUser } from './helpers/auth';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔐 Setting up authenticated state...');
    
    // Perform login
    await loginUser(page, 'test-user@example.com', 'TestPassword123!');
    
    // Save authenticated state
    await context.storageState({ path: 'e2e/auth.json' });
    
    console.log('✅ Authenticated state saved');
    
  } catch (error) {
    console.error('❌ Auth setup failed:', error);
    // Don't throw - let tests handle auth individually
  } finally {
    await browser.close();
  }
}

export default globalSetup;