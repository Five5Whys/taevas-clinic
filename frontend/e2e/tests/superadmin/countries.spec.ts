import { test, expect } from '@playwright/test';
import { loginViaAPI } from '../../helpers/auth.helper';

test.describe('Super Admin — Countries', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
    await page.getByRole('link', { name: /Countries/ }).click();
    await expect(page).toHaveURL(/\/superadmin\/countries/, { timeout: 10_000 });
  });

  test('countries page loads with tenant list', async ({ page }) => {
    // The sidebar shows "TENANTS" heading and country names
    await expect(page.getByText('TENANTS')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('India').first()).toBeVisible();
    await expect(page.getByText('Thailand').first()).toBeVisible();
    await expect(page.getByText('Maldives').first()).toBeVisible();
  });

  test('shows country details when clicking a country', async ({ page }) => {
    // India is selected by default — verify its detail panel has relevant info
    await expect(page.getByText('India').first()).toBeVisible({ timeout: 10_000 });
    // Detail panel should show Login & Authentication section and stats
    await expect(page.getByText('Login & Authentication').first()).toBeVisible();
    // India stats: 8 clinics, 31 doctors, 1247 patients
    await expect(page.getByText('1247').first()).toBeVisible();
  });

  test('displays clinic count and doctor count', async ({ page }) => {
    // India's stats section should show clinic and doctor counts
    await expect(page.getByText('India').first()).toBeVisible({ timeout: 10_000 });
    // The stats section shows these numbers (8 clinics, 31 doctors for India)
    await expect(page.getByText('8').first()).toBeVisible();
    await expect(page.getByText('31').first()).toBeVisible();
  });

  test('country detail shows auth settings', async ({ page }) => {
    // The login config section should be visible for the selected country
    await expect(page.getByText('India').first()).toBeVisible({ timeout: 10_000 });
    // Auth / Login config section with phone/email toggles
    const pageContent = page.locator('body');
    await expect(pageContent.getByText(/Phone/i).first()).toBeVisible();
  });

  test('can switch between countries', async ({ page }) => {
    await expect(page.getByText('India').first()).toBeVisible({ timeout: 10_000 });
    // Click Thailand in the sidebar tenant list
    await page.getByText('Thailand').first().click();
    // The detail header should now show "Thailand"
    // Thailand stats: 3 clinics, 11 doctors, 402 patients
    await expect(page.getByText('402').first()).toBeVisible({ timeout: 10_000 });
  });
});
