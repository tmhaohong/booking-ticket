import { expect, test } from '@playwright/test';

test.describe('Sign Up View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up');
  });

  test('should display all standard sign-up fields', async ({ page }) => {
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phoneNumber"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('input[name="agreement"]')).toBeAttached();

    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display validation errors when submitting an empty form', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    await submitButton.click();

    await expect(page.locator('span.text-red-600').first()).toBeVisible({ timeout: 5000 });

    const errorMessages = await page.locator('span.text-red-600').count();
    expect(errorMessages).toBe(5);
  });

  test('should show password matching validation error', async ({ page }) => {
    await page.locator('input[name="password"]').fill('ValidPass123');
    await page.locator('input[name="confirmPassword"]').fill('InvalidMismatch321');

    await page.locator('button[type="submit"]').click();

    const errors = page.locator('span.text-red-600');
    await expect(errors.filter({ hasText: /không khớp|match/i })).toBeVisible();
  });
});
