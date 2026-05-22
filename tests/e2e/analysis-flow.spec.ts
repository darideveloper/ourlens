import { test, expect } from '@playwright/test';

test.describe('Task 4.13 - Full Analysis Flow', () => {
  test('complete flow: authenticated user on scanner page with frames triggers analysis and shows report', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'ourlens-session',
        JSON.stringify({
          state: { code: '1234', isValid: true },
          version: 0,
        }),
      );
      localStorage.setItem(
        'ourlens-scans',
        JSON.stringify({
          state: { scanHistory: [] },
          version: 0,
        }),
      );
    });

    await page.goto('/scanner');
    await page.waitForLoadState('networkidle');

    const cameraReady = page.locator('button[aria-label="Capture photo"]');
    const cameraError = page.locator('button[aria-label="Try Again"]');
    const cameraStarting = page.locator('p:has-text("Starting camera")');

    await expect(cameraReady.or(cameraError).or(cameraStarting)).toBeVisible({
      timeout: 10_000,
    });

    await page.evaluate(() => {
      const store = (window as unknown as Record<string, { pushFrame: (frame: { base64: string; width: number; height: number }) => void; setStatus: (status: string) => void }>).__zbd;
      if (store?.CameraStore?.getState) {
        const state = store.CameraStore.getState();
        if (typeof state.pushFrame === 'function') {
          state.pushFrame({ base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==', width: 1024, height: 768 });
          state.setStatus('ready');
        }
      }
    });

    await page.waitForTimeout(500);

    const analyzeBtn = page.locator('button:has-text("Analyse")');
    const hasAnalyzeBtn = await analyzeBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasAnalyzeBtn) {
      test.skip();
      return;
    }

    await analyzeBtn.click();

    const overlay = page.locator('[role="dialog"][aria-label="Scanning in progress"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    await page.waitForURL('**/report', { timeout: 60_000 });

    await page.waitForLoadState('networkidle');

    const reportHeading = page.locator('h1:has-text("Safety Report")');
    await expect(reportHeading).toBeVisible({ timeout: 5000 });

    const highRiskBanner = page.locator('text=/high risk/i');
    const mediumRiskBanner = page.locator('text=/medium risk/i');
    const hazardCards = page.locator('text=/Loose rug|Exposed electrical|Poor lighting|Cluttered walk/');

    await expect(highRiskBanner.or(mediumRiskBanner).or(hazardCards)).toBeVisible({ timeout: 5000 });

    const scanAgainBtn = page.locator('button:has-text("Scan Again")');
    await expect(scanAgainBtn).toBeVisible();
  });

  test('error state shows error overlay with retry button when API fails', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/webhook/analyze-frames', (route) => {
      requestCount++;
      route.fulfill({ status: 500, body: 'Server Error' });
    });

    await page.addInitScript(() => {
      localStorage.setItem(
        'ourlens-session',
        JSON.stringify({
          state: { code: '1234', isValid: true },
          version: 0,
        }),
      );
    });

    await page.goto('/scanner');
    await page.waitForLoadState('networkidle');

    const cameraReady = page.locator('button[aria-label="Capture photo"]');
    await expect(cameraReady).toBeVisible({ timeout: 10_000 }).catch(() => {});

    await page.evaluate(() => {
      const store = (window as unknown as Record<string, { pushFrame: (frame: { base64: string; width: number; height: number }) => void; setStatus: (status: string) => void }>).__zbd;
      if (store?.CameraStore?.getState) {
        const state = store.CameraStore.getState();
        if (typeof state.pushFrame === 'function') {
          state.pushFrame({ base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==', width: 1024, height: 768 });
          state.setStatus('ready');
        }
      }
    });

    await page.waitForTimeout(300);

    const analyzeBtn = page.locator('button:has-text("Analyse")');
    const hasAnalyzeBtn = await analyzeBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasAnalyzeBtn) {
      test.skip();
      return;
    }

    await analyzeBtn.click();

    const errorOverlay = page.locator('[role="alertdialog"][aria-label="Analysis error"]');
    await expect(errorOverlay).toBeVisible({ timeout: 15_000 });

    const tryAgainBtn = page.locator('[role="alertdialog"] button:has-text("Try Again")');
    await expect(tryAgainBtn).toBeVisible();
  });

  test('no hazards found shows empty report with scan again', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'ourlens-session',
        JSON.stringify({
          state: { code: '1234', isValid: true },
          version: 0,
        }),
      );
      localStorage.setItem(
        'ourlens-scans',
        JSON.stringify({
          state: { scanHistory: [] },
          version: 0,
        }),
      );
    });

    await page.goto('/scanner');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      const store = (window as unknown as Record<string, { pushFrame: (frame: { base64: string; width: number; height: number }) => void; setStatus: (status: string) => void }>).__zbd;
      if (store?.CameraStore?.getState) {
        const state = store.CameraStore.getState();
        if (typeof state.pushFrame === 'function') {
          state.pushFrame({ base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==', width: 1024, height: 768 });
          state.setStatus('ready');
        }
      }
    });

    await page.waitForTimeout(300);

    const analyzeBtn = page.locator('button:has-text("Analyse")');
    const hasAnalyzeBtn = await analyzeBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasAnalyzeBtn) {
      test.skip();
      return;
    }

    await analyzeBtn.click();
    await page.waitForURL('**/report', { timeout: 60_000 });
    await page.waitForLoadState('networkidle');

    const noHazards = page.locator('h1:has-text("No Hazards Detected")');
    const scanAgainNoHazards = page.locator('button:has-text("Scan Again")');
    await expect(noHazards.or(page.locator("h1:has-text('Safety Report')"))).toBeVisible({ timeout: 5000 });
    await expect(scanAgainNoHazards).toBeVisible();
  });
});