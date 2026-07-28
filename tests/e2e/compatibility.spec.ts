import { test, expect } from '@playwright/test';

test.describe('Browser compatibility', () => {
  test('safeFetch does not call AbortSignal.any or AbortSignal.timeout', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.addInitScript(() => {
      localStorage.setItem(
        'ourlens-session',
        JSON.stringify({ state: { code: '1234', isValid: true }, version: 0 }),
      );
    });

    await page.goto('/scanner');
    await page.waitForLoadState('networkidle');

    const abortSignalErrors = errors.filter(
      (e) => e.includes('AbortSignal.any') || e.includes('AbortSignal.timeout'),
    );
    expect(abortSignalErrors).toEqual([]);
  });
});
