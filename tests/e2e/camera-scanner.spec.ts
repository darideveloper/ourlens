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

    // Check that if the video element is visible, it has non-zero rendered dimensions
    // (regression guard against camera height collapse — the container must fill the viewport)
    const videoBox = await page.locator('video').boundingBox();
    if (videoBox) {
      expect(videoBox.height).toBeGreaterThan(0);
    }
  });
});
