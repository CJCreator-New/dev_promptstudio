import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('modal dialogs are accessible', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Settings")');
    
    const results = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();
    
    const labelViolations = results.violations.filter(v => v.id === 'label');
    expect(labelViolations).toEqual([]);
  });

  test('color contrast meets WCAG AA', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');
    expect(contrastViolations).toEqual([]);
  });
});
