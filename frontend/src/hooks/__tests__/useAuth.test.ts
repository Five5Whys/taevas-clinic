import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types';

// Mock authService (used by authStore)
jest.mock('@/services/authService', () => ({
  __esModule: true,
  default: {
    logout: jest.fn(() => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }),
    getToken: jest.fn(() => localStorage.getItem('authToken')),
    getCurrentUser: jest.fn(() => {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    }),
  },
}));

const mockUser: User = {
  id: '1',
  phone: '9876543210',
  firstName: 'John',
  lastName: 'Doe',
  role: 'SUPERADMIN',
};

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  });
});

describe('useAuth', () => {
  it('returns user, token, isAuthenticated from store', () => {
    useAuthStore.setState({
      user: mockUser,
      token: 'jwt-token',
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('jwt-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login calls store login and updates state', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login(mockUser, 'new-token');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('new-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout calls store logout and clears state', () => {
    useAuthStore.setState({
      user: mockUser,
      token: 'jwt-token',
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('userRole returns correct role from user', () => {
    useAuthStore.setState({
      user: mockUser,
      token: 'jwt-token',
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.userRole).toBe('SUPERADMIN');
  });

  it('userRole returns null when no user', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.userRole).toBeNull();
  });
});
