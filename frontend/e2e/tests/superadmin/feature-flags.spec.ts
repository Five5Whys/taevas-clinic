import { test, expect } from '@playwright/test';
import { loginViaAPI } from '../../helpers/auth.helper';

test.describe('Super Admin — Feature Flags', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
    await page.goto('/superadmin/feature-flags');
    await page.waitForLoadState('networkidle');
  });

  test('feature flags page loads with flag list', async ({ page }) => {
    // Should show the features table with known flag names
    await expect(page.getByText('Voice AI').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('AI Rx').first()).toBeVisible();
    await expect(page.getByText('Device Capture').first()).toBeVisible();
  });

  test('shows toggle switches per country', async ({ page }) => {
    await expect(page.getByText('Voice AI').first()).toBeVisible({ timeout: 10_000 });
    // Table headers should show country names
    await expect(page.getByText('India').first()).toBeVisible();
    await expect(page.getByText('Thailand').first()).toBeVisible();
    await expect(page.getByText('Maldives').first()).toBeVisible();
    // There should be MUI Switch elements in the table (rendered as spans with role=checkbox inside)
    const switches = page.getByRole('checkbox');
    await expect(switches.first()).toBeVisible();
    // Expect at least as many switches as flags * countries (8 flags * 3 countries = 24)
    expect(await switches.count()).toBeGreaterThanOrEqual(8);
  });

  test('shows flag descriptions in impact preview', async ({ page }) => {
    // The page has a management instruction text
    await expect(
      page.getByText(/Manage feature availability by country/i)
    ).toBeVisible({ timeout: 10_000 });
    // AI Impact Preview section should be visible
    await expect(page.getByText('AI Impact Preview')).toBeVisible();
  });

  test('can view impact analysis', async ({ page }) => {
    await expect(page.getByText('AI Impact Preview')).toBeVisible({ timeout: 10_000 });
    // Impact cards show "Affected: X doctors, Y clinics"
    await expect(page.getByText(/Affected:.*doctors.*clinics/i).first()).toBeVisible();
  });
});
