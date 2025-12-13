import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('Lighthouse Performance', () => {
  test('meets performance thresholds', async ({ page }) => {
    await page.goto('/');

    await playAudit({
      page,
      thresholds: {
        performance: 90,
        accessibility: 100,
        'best-practices': 95,
        seo: 90,
      },
      port: 9222,
    });
  });

  test('Core Web Vitals are within limits', async ({ page }) => {
    await page.goto('/');

    const metrics = await page.evaluate(() => ({
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
    }));

    expect(metrics.fcp).toBeLessThan(1800); // FCP < 1.8s
    expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
  });
});
