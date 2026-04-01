/**
 * Tests for the api.ts axios instance and its interceptors.
 *
 * api.ts uses `import.meta.env` (Vite-only), so we replicate the interceptor
 * logic and test the callback functions in isolation.
 */

import axios from 'axios';

// ── Replicate interceptor callbacks from api.ts ──────────────────────

function requestInterceptor(config: { headers: Record<string, string> }) {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

async function responseErrorInterceptor(
  error: { response?: { status: number }; config: Record<string, unknown> },
  retryFn: (config: Record<string, unknown>) => Promise<unknown>,
  redirect: (url: string) => void
) {
  const originalRequest = error.config as Record<string, unknown> & { _retry?: boolean };

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        redirect('/login');
        return Promise.reject(error);
      }

      const response = await axios.post('/api/auth/refresh-token', { refreshToken });
      const { token, refreshToken: newRefreshToken } = response.data.data;

      localStorage.setItem('authToken', token);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      const headers = ((originalRequest as Record<string, Record<string, string>>).headers) || {};
      headers.Authorization = `Bearer ${token}`;
      (originalRequest as Record<string, unknown>).headers = headers;
      return retryFn(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      redirect('/login');
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
}

// ── Mock axios ───────────────────────────────────────────────────────
jest.mock('axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
  post: jest.fn(),
}));

const mockAxiosPost = axios.post as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

// ── Tests ────────────────────────────────────────────────────────────

describe('api request interceptor', () => {
  it('adds Authorization header when authToken exists in localStorage', () => {
    localStorage.setItem('authToken', 'jwt-abc');
    const config = { headers: {} as Record<string, string> };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBe('Bearer jwt-abc');
  });

  it('does not add Authorization header when no token exists', () => {
    const config = { headers: {} as Record<string, string> };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('returns the config object for chaining', () => {
    const config = { headers: {} as Record<string, string> };
    expect(requestInterceptor(config)).toBe(config);
  });
});

describe('api response error interceptor', () => {
  const retryFn = jest.fn();
  const redirect = jest.fn();

  beforeEach(() => {
    retryFn.mockReset();
    redirect.mockReset();
  });

  it('redirects to /login and clears storage on 401 without refresh token', async () => {
    localStorage.setItem('authToken', 'expired');
    localStorage.setItem('user', '{}');

    const error = { response: { status: 401 }, config: { headers: {} } };
    await expect(responseErrorInterceptor(error, retryFn, redirect)).rejects.toBeDefined();

    expect(redirect).toHaveBeenCalledWith('/login');
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('refreshes token and retries request on 401 with valid refresh token', async () => {
    localStorage.setItem('refreshToken', 'valid-refresh');

    mockAxiosPost.mockResolvedValueOnce({
      data: { data: { token: 'new-jwt', refreshToken: 'new-refresh' } },
    });
    retryFn.mockResolvedValueOnce({ data: 'success' });

    const error = { response: { status: 401 }, config: { headers: {} } };
    const result = await responseErrorInterceptor(error, retryFn, redirect);

    expect(mockAxiosPost).toHaveBeenCalledWith('/api/auth/refresh-token', {
      refreshToken: 'valid-refresh',
    });
    expect(localStorage.getItem('authToken')).toBe('new-jwt');
    expect(localStorage.getItem('refreshToken')).toBe('new-refresh');
    expect(retryFn).toHaveBeenCalled();
    expect(result).toEqual({ data: 'success' });
  });

  it('redirects to /login when token refresh API call fails', async () => {
    localStorage.setItem('refreshToken', 'bad-refresh');

    mockAxiosPost.mockRejectedValueOnce(new Error('Network error'));

    const error = { response: { status: 401 }, config: { headers: {} } };
    await expect(responseErrorInterceptor(error, retryFn, redirect)).rejects.toThrow('Network error');

    expect(redirect).toHaveBeenCalledWith('/login');
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('rejects non-401 errors without attempting refresh', async () => {
    const error = { response: { status: 500 }, config: { headers: {} } };
    await expect(responseErrorInterceptor(error, retryFn, redirect)).rejects.toBe(error);
    expect(mockAxiosPost).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
