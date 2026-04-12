import { expect, test } from '@playwright/test';

test.describe('Sign In View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
  });

  test('should display all standard sign-in fields', async ({ page }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display validation errors when submitting an empty form', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    await submitButton.click();

    // Check for validation errors on both fields
    await expect(page.locator('span.text-red-600').first()).toBeVisible({ timeout: 5000 });

    const errorMessages = await page.locator('span.text-red-600').count();
    expect(errorMessages).toBe(2);
  });

  test('should show validation error for invalid email or phone number format', async ({ page }) => {
    await page.locator('input[name="email"]').fill('invalid-format');
    await page.locator('input[name="password"]').fill('ValidPass123');

    await page.locator('button[type="submit"]').click();

    // The validation error for invalid email/phone should be visible
    const errors = page.locator('span.text-red-600');
    // Using a generic check since the exact text "Please enter a valid email or phone number" can vary by language
    await expect(errors).toHaveCount(1);
  });

  test('should clear validation error if valid email or phone number is provided', async ({ page }) => {
    // Fill invalid data
    await page.locator('input[name="email"]').fill('invalid-format');
    await page.locator('input[name="password"]').fill('ValidPass123');
    await page.locator('button[type="submit"]').click();

    // Ensure error is shown
    await expect(page.locator('span.text-red-600')).toBeVisible();

    // Fix it using an email
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('button[type="submit"]').click();

    // We shouldn't see that specific error anymore (either we see a toast or it tries to submit)
    // We just check that the error message span count drops down
    await expect(page.locator('span.text-red-600')).toBeHidden();
  });
});
