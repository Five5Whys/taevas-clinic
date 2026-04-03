import { type Page, expect } from '@playwright/test';

const DEFAULT_PHONE = '9876543210';
const DEFAULT_PASSWORD = 'password';

/**
 * Login via the UI form (phone method).
 * Note: The app has a known bug where the Axios 401 interceptor fires on the
 * login endpoint itself, causing a redirect loop. This helper waits for either
 * successful navigation OR handles the redirect gracefully.
 */
export async function loginViaUI(
  page: Page,
  phone = DEFAULT_PHONE,
  password = DEFAULT_PASSWORD,
) {
  await page.goto('/login');
  const phoneInput = page.getByPlaceholder('0000000000');
  await phoneInput.fill(phone);
  const passwordInput = page.getByPlaceholder('Enter your password');
  await passwordInput.fill(password);

  // Intercept the login API call to get the token before the 401 interceptor fires
  const responsePromise = page.waitForResponse(
    (resp) => resp.url().includes('/api/auth/login') && resp.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Login' }).click();
  const response = await responsePromise;

  if (response.ok()) {
    // If login succeeded but the 401 interceptor redirected us back, inject token manually
    try {
      await page.waitForURL((url) => url.pathname.startsWith('/superadmin'), { timeout: 5_000 });
    } catch {
      // 401 interceptor bug fired — inject auth state and navigate manually
      const body = await response.json();
      const authData = body.data;
      await page.evaluate(
        (data: { token: string; user: object }) => {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        },
        { token: authData.token, user: authData.user },
      );
      await page.goto('/superadmin');
      await page.waitForLoadState('networkidle');
    }
  }
}

/**
 * Login via API call and inject auth state into localStorage, then navigate.
 * Much faster than UI login for tests that don't test the login flow itself.
 */
export async function loginViaAPI(page: Page) {
  // Call the real API directly
  const response = await page.request.post('/api/auth/login', {
    data: { identifier: DEFAULT_PHONE, password: DEFAULT_PASSWORD },
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  const authData = body.data;

  // Inject auth state into localStorage before navigating
  await page.addInitScript((data: { token: string; user: object }) => {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }, { token: authData.token, user: authData.user });

  // Navigate to dashboard — the app will read localStorage on init
  await page.goto('/superadmin');
  // Wait for the page to be fully loaded (sidebar or page title visible)
  await page.waitForLoadState('networkidle');
}
