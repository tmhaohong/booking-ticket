import { expect, test } from '@playwright/test';

test.describe('UI Components Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up');
  });

  test('Input component focus state styling applies properly', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');

    await emailInput.click();

    await expect(emailInput).toBeFocused();
  });

  test('Checkbox toggle state toggles visual icons', async ({ page }) => {
    const checkboxLabel = page.locator('label').filter({ hasText: /(Terms of Service|Privacy)/i });

    const uncheckedIcon = checkboxLabel
      .locator('.material-symbols-rounded')
      .filter({ hasText: 'check_box_outline_blank' });
    const checkedIcon = checkboxLabel
      .locator('.material-symbols-rounded')
      .filter({ hasText: 'select_check_box' });

    await expect(uncheckedIcon).toBeVisible();
    await expect(checkedIcon).toBeHidden();

    await checkboxLabel.click();

    await expect(checkedIcon).toBeVisible();
    await expect(uncheckedIcon).toBeHidden();
  });
});
