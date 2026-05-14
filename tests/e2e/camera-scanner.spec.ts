import { test, expect } from '@playwright/test';

test.describe('Task 3.12 - Camera Scanner UI', () => {
  test('scanner page loads and shows camera UI or error state', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'ourlens-session',
        JSON.stringify({ state: { code: '1234', isValid: true }, version: 0 }),
      );
    });

    await page.goto('/scanner');
    await page.waitForLoadState('networkidle');

    const pageText = await page.locator('main').textContent();

    expect(pageText).toMatch(
      /Starting camera|Camera Not Available|Camera Error|Capture photo/,
    );

    await expect(page.locator('video, button[aria-label="Try Again"], p:has-text("Starting camera")').first()).toBeAttached({ timeout: 10_000 });
  });
});
