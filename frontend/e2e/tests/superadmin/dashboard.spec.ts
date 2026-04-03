import { test, expect } from '@playwright/test';
import { loginViaAPI } from '../../helpers/auth.helper';

test.describe('Super Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
  });

  test('dashboard loads with page title "Control Center"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Control Center' })).toBeVisible({ timeout: 10_000 });
  });

  test('dashboard displays stat cards', async ({ page }) => {
    // The dashboard has stat cards: Active Countries, Live Clinics, Doctors, Patient Records
    await expect(page.getByText('Active Countries').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Live Clinics').first()).toBeVisible();
    await expect(page.getByText('Doctors').first()).toBeVisible();
    await expect(page.getByText('Patient Records').first()).toBeVisible();
  });

  test('sidebar shows navigation items', async ({ page }) => {
    await expect(page.getByText('CommandControl')).toBeVisible({ timeout: 10_000 });
    // Use specific role-based selectors to avoid ambiguity
    await expect(page.getByRole('link', { name: /Equidor/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Countries/ })).toBeVisible();
  });

  test('country status section is visible', async ({ page }) => {
    await expect(page.getByText('Country Status')).toBeVisible({ timeout: 10_000 });
    // India and Thailand appear in the Country Status card
    await expect(page.getByText('India').first()).toBeVisible();
    await expect(page.getByText('Thailand').first()).toBeVisible();
  });

  test('can navigate to countries page from sidebar', async ({ page }) => {
    await page.getByRole('link', { name: /Countries/ }).click();
    await expect(page).toHaveURL(/\/superadmin\/countries/, { timeout: 10_000 });
  });
});
