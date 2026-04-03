import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173/api';

test.describe('Auth API Tests', () => {
  let authToken: string;

  test('POST /auth/login with valid credentials returns token', async ({ request }) => {
    const response = await request.post(`${BASE}/auth/login`, {
      data: { identifier: '9876543210', password: 'password' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.token).toBeTruthy();
    expect(body.data.user).toBeDefined();
    expect(body.data.user.role).toBe('SUPERADMIN');
    // Store token for later tests
    authToken = body.data.token;
  });

  test('POST /auth/login with wrong password returns error', async ({ request }) => {
    const response = await request.post(`${BASE}/auth/login`, {
      data: { identifier: '9876543210', password: 'wrongpassword' },
    });
    // Should return 4xx
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /auth/login with non-existent user returns error', async ({ request }) => {
    const response = await request.post(`${BASE}/auth/login`, {
      data: { identifier: '0000000000', password: 'password' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('GET /superadmin/stats with auth header returns stats', async ({ request }) => {
    // First get a token
    const loginRes = await request.post(`${BASE}/auth/login`, {
      data: { identifier: '9876543210', password: 'password' },
    });
    const loginBody = await loginRes.json();
    const token = loginBody.data.token;

    const response = await request.get(`${BASE}/superadmin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
  });

  test('GET /superadmin/stats without auth returns 401 or 403', async ({ request }) => {
    const response = await request.get(`${BASE}/superadmin/stats`);
    expect(response.status()).toBeGreaterThanOrEqual(401);
    expect(response.status()).toBeLessThanOrEqual(403);
  });
});
