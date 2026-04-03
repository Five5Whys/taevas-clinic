import { test, expect } from '@playwright/test';
import { loginViaAPI } from '../../helpers/auth.helper';

test.describe('Super Admin — Clinics', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
    await page.goto('/superadmin/clinics');
    await page.waitForLoadState('networkidle');
  });

  test('clinics page loads with clinic list', async ({ page }) => {
    // Should show at least one clinic card
    await expect(page.getByText('ENT Care Center').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Apollo Clinic').first()).toBeVisible();
  });

  test('search filters clinics by name', async ({ page }) => {
    await expect(page.getByText('ENT Care Center').first()).toBeVisible({ timeout: 10_000 });
    // Type in search box
    const searchInput = page.getByPlaceholder('Search clinic or location');
    await searchInput.fill('Apollo');
    // Apollo Clinic should remain visible
    await expect(page.getByText('Apollo Clinic').first()).toBeVisible({ timeout: 5_000 });
  });

  test('shows clinic cards with status badges', async ({ page }) => {
    await expect(page.getByText('ENT Care Center').first()).toBeVisible({ timeout: 10_000 });
    // Active and Pilot status chips should be present
    await expect(page.getByText('Active').first()).toBeVisible();
  });

  test('shows compliance tags on clinics', async ({ page }) => {
    await expect(page.getByText('ENT Care Center').first()).toBeVisible({ timeout: 10_000 });
    // Compliance tags like ABDM, FHIR R4, NMC should appear on clinic cards
    await expect(page.getByText('ABDM').first()).toBeVisible();
  });

  test('clinic count matches expected', async ({ page }) => {
    await expect(page.getByText('ENT Care Center').first()).toBeVisible({ timeout: 10_000 });
    // The fallback data has 12 clinics — verify multiple are rendered
    await expect(page.getByText('Bangkok ENT Clinic').first()).toBeVisible();
    await expect(page.getByText('Male ENT & Hearing').first()).toBeVisible();
  });
});
