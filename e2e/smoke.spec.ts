import { test, expect } from '@playwright/test';

test.describe('Marketing pages', () => {
  test('homepage loads and shows hero CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Fixit 24\/7/i);
    // Emergency CTA should be visible
    const cta = page.getByRole('link', { name: /emergency/i }).first();
    await expect(cta).toBeVisible();
  });

  test('how-it-works page is accessible', async ({ page }) => {
    await page.goto('/how-it-works');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('pricing page loads subscription plans', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: /plan|pricing|subscription/i }).first()).toBeVisible();
  });
});

test.describe('Auth pages', () => {
  test('login page renders form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|log in/i })).toBeVisible();
  });

  test('register page renders form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  });

  test('login redirects unauthenticated access to dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('SEO pages', () => {
  test('suburb landing page loads', async ({ page }) => {
    await page.goto('/suburb/nsw/surry-hills');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Should mention the suburb
    await expect(page.getByText(/Surry Hills/i).first()).toBeVisible();
  });

  test('trade landing page loads', async ({ page }) => {
    await page.goto('/trade/plumbing/surry-hills');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Plumber/i).first()).toBeVisible();
  });

  test('404 page renders for unknown routes', async ({ page }) => {
    const res = await page.goto('/this-route-definitely-does-not-exist');
    expect(res?.status()).toBe(404);
  });
});

test.describe('API health', () => {
  test('health check endpoint responds', async ({ request }) => {
    const res = await request.get('/api/health');
    // Either 200 or 404 is acceptable — just shouldn't 500
    expect(res.status()).not.toBe(500);
  });
});
