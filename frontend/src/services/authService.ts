import api from './api';
import { AuthResponse, SendOtpRequest, VerifyOtpRequest, TokenRefreshResponse } from '@/types';

const authService = {
  /**
   * Login with phone/email + password
   */
  login: async (identifier: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { identifier, password });
    const authData = response.data.data as AuthResponse;

    if (authData.token) {
      localStorage.setItem('authToken', authData.token);
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }
      if (authData.user) {
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
    }

    return authData;
  },

  /**
   * Send OTP to phone/email (for registration)
   */
  sendOtp: async (phone: string): Promise<void> => {
    const request: SendOtpRequest = { phone };
    await api.post('/auth/send-otp', request);
  },

  /**
   * Verify OTP and get auth token
   */
  verifyOtp: async (phone: string, otp: string): Promise<AuthResponse> => {
    const request: VerifyOtpRequest = { phone, otp };
    const response = await api.post('/auth/verify-otp', request);

    // Unwrap ApiResponse wrapper: response.data is axios unwrap, .data is ApiResponse.data
    const authData = response.data.data as AuthResponse;

    // Store tokens in localStorage
    if (authData.token) {
      localStorage.setItem('authToken', authData.token);
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }
    }

    return authData;
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (): Promise<TokenRefreshResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post(
      '/auth/refresh-token',
      { refreshToken }
    );

    // Unwrap ApiResponse wrapper: response.data is axios unwrap, .data is ApiResponse.data
    const tokenData = response.data.data as TokenRefreshResponse;

    if (tokenData.token) {
      localStorage.setItem('authToken', tokenData.token);
      if (tokenData.refreshToken) {
        localStorage.setItem('refreshToken', tokenData.refreshToken);
      }
    }

    return tokenData;
  },

  /**
   * Logout user
   */
  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (e) {
      if (import.meta.env.DEV) console.warn('Failed to parse stored user:', e);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Get stored auth token
   */
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },
};

export default authService;
