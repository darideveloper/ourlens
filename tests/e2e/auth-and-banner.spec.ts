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
  test('enter valid code with consent, navigate to /instructions, see protected content', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto('/');
    await page.waitForSelector('#invite-code');
    await page.fill('#invite-code', 'OURLENS');
    await page.click('input[type="checkbox"]');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/instructions', { timeout: 10_000 });
    await expect(
      page.getByRole('heading', { name: 'How to scan your home' }),
    ).toBeVisible();
  });
});

test.describe('Consent checkbox behavior', () => {
  test('Verify Code button is disabled when checkbox is unchecked', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto('/');
    await page.waitForSelector('#invite-code');
    await page.fill('#invite-code', 'OURLENS');

    const button = page.getByRole('button', { name: 'Verify Code' });
    await expect(button).toBeDisabled();
  });

  test('Verify Code button is enabled when code entered and checkbox checked', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto('/');
    await page.waitForSelector('#invite-code');
    await page.fill('#invite-code', 'OURLENS');
    await page.click('input[type="checkbox"]');

    const button = page.getByRole('button', { name: 'Verify Code' });
    await expect(button).toBeEnabled();
  });

  test('protected route redirects to / when terms not accepted', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('ourlens-session', JSON.stringify({
        state: { code: 'OURLENS', isValid: true, termsAccepted: false },
        version: 0,
      }));
    });

    await page.goto('/instructions');
    await expect(page).toHaveURL('/', { timeout: 10_000 });
    await expect(
      page.getByRole('heading', { name: 'Welcome to Ourlens' }),
    ).toBeVisible();
  });
});
