import { test, expect } from '@playwright/test';

// Requires test credentials set via environment variables:
//   E2E_CUSTOMER_EMAIL, E2E_CUSTOMER_PASSWORD
// These are seeded test accounts — see packages/database/src/seed.ts

const CUSTOMER_EMAIL = process.env.E2E_CUSTOMER_EMAIL ?? 'test-customer-1@fixit247.dev';
const CUSTOMER_PASSWORD = process.env.E2E_CUSTOMER_PASSWORD ?? '';

test.describe('Customer job flow (requires test account)', () => {
  test.skip(!CUSTOMER_PASSWORD, 'E2E_CUSTOMER_PASSWORD not set');

  test('customer can sign in and view dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: /email/i }).fill(CUSTOMER_EMAIL);
    await page.getByRole('textbox', { name: /password/i }).fill(CUSTOMER_PASSWORD);
    await page.getByRole('button', { name: /sign in|log in/i }).click();

    // Should land on customer dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 });
    await expect(page.getByText(/dashboard/i).first()).toBeVisible();
  });

  test('customer can navigate to new job form', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: /email/i }).fill(CUSTOMER_EMAIL);
    await page.getByRole('textbox', { name: /password/i }).fill(CUSTOMER_PASSWORD);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForURL(/dashboard/, { timeout: 10_000 });

    await page.goto('/jobs/new');
    await expect(page.getByRole('heading', { name: /post|new job|describe/i }).first()).toBeVisible();
  });
});
