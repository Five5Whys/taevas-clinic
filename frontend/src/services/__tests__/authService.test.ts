import authService from '../authService';
import api from '../api';

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('authService', () => {
  describe('login', () => {
    it('calls API with correct payload and stores tokens', async () => {
      const authData = {
        token: 'jwt-123',
        refreshToken: 'refresh-456',
        user: { id: '1', phone: '9876543210', role: 'SUPERADMIN' },
      };
      mockApi.post.mockResolvedValueOnce({ data: { data: authData } });

      const result = await authService.login('9876543210', 'password');

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
        identifier: '9876543210',
        password: 'password',
      });
      expect(result).toEqual(authData);
      expect(localStorage.getItem('authToken')).toBe('jwt-123');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-456');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(authData.user));
    });

    it('does not store tokens when response has no token', async () => {
      const authData = { token: '', user: null };
      mockApi.post.mockResolvedValueOnce({ data: { data: authData } });

      await authService.login('test', 'pass');

      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('logout', () => {
    it('clears all auth data from localStorage', () => {
      localStorage.setItem('authToken', 'token');
      localStorage.setItem('refreshToken', 'refresh');
      localStorage.setItem('user', '{}');

      authService.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('sendOtp', () => {
    it('calls correct endpoint with phone', async () => {
      mockApi.post.mockResolvedValueOnce({ data: {} });

      await authService.sendOtp('9876543210');

      expect(mockApi.post).toHaveBeenCalledWith('/auth/send-otp', {
        phone: '9876543210',
      });
    });
  });

  describe('verifyOtp', () => {
    it('calls correct endpoint and stores tokens on success', async () => {
      const authData = {
        token: 'otp-jwt',
        refreshToken: 'otp-refresh',
        user: { id: '2', phone: '1234567890', role: 'PATIENT' },
      };
      mockApi.post.mockResolvedValueOnce({ data: { data: authData } });

      const result = await authService.verifyOtp('1234567890', '123456');

      expect(mockApi.post).toHaveBeenCalledWith('/auth/verify-otp', {
        phone: '1234567890',
        otp: '123456',
      });
      expect(result).toEqual(authData);
      expect(localStorage.getItem('authToken')).toBe('otp-jwt');
      expect(localStorage.getItem('refreshToken')).toBe('otp-refresh');
    });
  });

  describe('refreshToken', () => {
    it('calls refresh endpoint and updates stored tokens', async () => {
      localStorage.setItem('refreshToken', 'old-refresh');
      const tokenData = { token: 'new-jwt', refreshToken: 'new-refresh' };
      mockApi.post.mockResolvedValueOnce({ data: { data: tokenData } });

      const result = await authService.refreshToken();

      expect(mockApi.post).toHaveBeenCalledWith('/auth/refresh-token', {
        refreshToken: 'old-refresh',
      });
      expect(result).toEqual(tokenData);
      expect(localStorage.getItem('authToken')).toBe('new-jwt');
      expect(localStorage.getItem('refreshToken')).toBe('new-refresh');
    });

    it('throws when no refresh token in localStorage', async () => {
      await expect(authService.refreshToken()).rejects.toThrow(
        'No refresh token available'
      );
    });
  });

  describe('getCurrentUser', () => {
    it('returns parsed user from localStorage', () => {
      const user = { id: '1', phone: '123', role: 'DOCTOR' };
      localStorage.setItem('user', JSON.stringify(user));

      expect(authService.getCurrentUser()).toEqual(user);
    });

    it('returns null when no user in localStorage', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });

    it('returns null when user JSON is invalid', () => {
      localStorage.setItem('user', '{bad json');
      expect(authService.getCurrentUser()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when authToken exists', () => {
      localStorage.setItem('authToken', 'token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('returns false when no authToken', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getToken', () => {
    it('returns stored token', () => {
      localStorage.setItem('authToken', 'my-token');
      expect(authService.getToken()).toBe('my-token');
    });

    it('returns null when no token', () => {
      expect(authService.getToken()).toBeNull();
    });
  });
});
