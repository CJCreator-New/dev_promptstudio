import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { skipAuthForTest, waitForAppReady } from '../helpers/auth';

test.describe('WCAG 2.1 AA Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await skipAuthForTest(page);
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('homepage should not have accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('[data-testid="auth-dialog"]') // Skip auth dialog
      .analyze();
    
    if (results.violations.length > 0) {
      console.log('Accessibility violations:', results.violations);
    }
    expect(results.violations).toEqual([]);
  });

  test('prompt input area should be accessible', async ({ page }) => {
    const inputExists = await page.locator('textarea, input[type="text"]').count() > 0;
    if (!inputExists) {
      test.skip('No input area found');
    }
    
    const results = await new AxeBuilder({ page })
      .include('textarea, input[type="text"], [data-testid="prompt-input"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('modals should be accessible', async ({ page }) => {
    // Try to find and open a modal
    const modalTriggers = page.locator('button:has-text("Settings"), button:has-text("API"), button:has-text("Help")');
    const triggerCount = await modalTriggers.count();
    
    if (triggerCount === 0) {
      test.skip('No modal triggers found');
    }
    
    await modalTriggers.first().click();
    
    const dialog = page.locator('[role="dialog"]');
    const dialogExists = await dialog.count() > 0;
    
    if (dialogExists) {
      const results = await new AxeBuilder({ page })
        .include('[role="dialog"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
    } else {
      test.skip('No modal opened');
    }
  });

  test('keyboard navigation should work', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    const activeElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? { tagName: el.tagName, type: el.type || null } : null;
    });
    
    if (activeElement) {
      const validElements = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'];
      expect(validElements).toContain(activeElement.tagName);
    }
    
    // Check focus indicators
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast']) // Test separately
      .exclude('[data-testid="auth-dialog"]')
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('color contrast should meet WCAG AA', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .exclude('[data-testid="auth-dialog"]')
      .analyze();
    
    if (results.violations.length > 0) {
      console.log('Color contrast violations:', results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.length
      })));
    }
    
    expect(results.violations).toEqual([]);
  });

  test('images should have alt text', async ({ page }) => {
    const imageCount = await page.locator('img').count();
    if (imageCount === 0) {
      test.skip('No images found');
    }
    
    const results = await new AxeBuilder({ page })
      .withRules(['image-alt'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('form labels should be associated', async ({ page }) => {
    const formCount = await page.locator('input, textarea, select').count();
    if (formCount === 0) {
      test.skip('No form elements found');
    }
    
    const results = await new AxeBuilder({ page })
      .withRules(['label', 'label-title-only'])
      .exclude('[data-testid="auth-dialog"]')
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('headings should be in order', async ({ page }) => {
    const headingCount = await page.locator('h1, h2, h3, h4, h5, h6').count();
    if (headingCount === 0) {
      test.skip('No headings found');
    }
    
    const results = await new AxeBuilder({ page })
      .withRules(['heading-order'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('ARIA attributes should be valid', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withRules(['aria-valid-attr', 'aria-valid-attr-value'])
      .exclude('[data-testid="auth-dialog"]')
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('page should have lang attribute', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withRules(['html-has-lang', 'html-lang-valid'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
});
