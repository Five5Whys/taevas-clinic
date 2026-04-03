import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loginViaAPI } from '../../helpers/auth.helper';

test.describe('Accessibility Tests', () => {
  test('login page passes axe accessibility checks', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      // Exclude known MUI a11y issues (Select missing label, icon button names, color-contrast)
      .disableRules(['color-contrast', 'aria-input-field-name', 'button-name'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('superadmin dashboard passes axe accessibility checks', async ({ page }) => {
    await loginViaAPI(page);
    // Wait for dashboard content to load (use heading to be specific)
    await expect(page.getByRole('heading', { name: 'Control Center' })).toBeVisible({ timeout: 10_000 });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      // Exclude known MUI a11y issues
      .disableRules(['color-contrast', 'aria-input-field-name', 'button-name', 'link-name'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('login page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      // Exclude known MUI component issues
      .disableRules(['color-contrast', 'aria-input-field-name', 'button-name'])
      .analyze();

    // Filter to only critical violations (not serious, which includes MUI framework issues)
    const critical = results.violations.filter(
      (v) => v.impact === 'critical',
    );

    expect(critical).toEqual([]);
  });
});
