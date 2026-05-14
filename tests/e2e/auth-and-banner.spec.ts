import { test, expect } from '@playwright/test';

test.describe('Task 1.2 - IosInstallBanner does not crash', () => {
  test('no ReferenceError for isiOSPwa on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/instructions');

    const refError = errors.find(
      (e) => e.includes('isiOSPwa') || e.includes('ReferenceError'),
    );
    expect(refError).toBeUndefined();
  });
});

test.describe('Task 2.3 & 2.4 - AuthGuard redirects unauthenticated users', () => {
  for (const route of ['/instructions', '/scanner']) {
    test(`clear localStorage, navigate to ${route}, redirect to /`, async ({
      page,
    }) => {
      await page.addInitScript(() => {
        localStorage.clear();
      });

      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto(route);

      await expect(page).toHaveURL('/', { timeout: 10_000 });
      await expect(
        page.getByRole('heading', { name: 'Welcome to Ourlens' }),
      ).toBeVisible();
    });
  }
});

test.describe('Task 2.5 - Authenticated user accesses protected content', () => {
  test('enter valid code, navigate to /instructions, see protected content', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto('/');
    await page.waitForSelector('#invite-code');
    await page.fill('#invite-code', '1234');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/instructions', { timeout: 10_000 });
    await expect(
      page.getByRole('heading', { name: 'How to scan your home' }),
    ).toBeVisible();
  });
});
