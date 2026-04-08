import { useAuthStore } from '../authStore';
import type { User } from '@/types';

// Mock authService used by the store
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

// Reset Zustand + localStorage between tests
beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
});

describe('authStore', () => {
  // ── initial state ──────────────────────────────────────────────
  it('has null user initially', () => {
    const { user } = useAuthStore.getState();
    expect(user).toBeNull();
  });

  it('has null token initially', () => {
    const { token } = useAuthStore.getState();
    expect(token).toBeNull();
  });

  it('is not authenticated initially', () => {
    const { isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
  });

  // ── login ──────────────────────────────────────────────────────
  it('login sets user, token, and isAuthenticated', () => {
    useAuthStore.getState().login(mockUser, 'jwt-token');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('jwt-token');
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem('authToken')).toBe('jwt-token');
  });

  // ── logout ─────────────────────────────────────────────────────
  it('logout clears state and localStorage', () => {
    useAuthStore.getState().login(mockUser, 'jwt-token');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  // ── setUser ────────────────────────────────────────────────────
  it('setUser updates the user in state and localStorage', () => {
    const updatedUser: User = { ...mockUser, firstName: 'Jane' };
    useAuthStore.getState().setUser(updatedUser);

    expect(useAuthStore.getState().user).toEqual(updatedUser);
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(updatedUser);
  });

  // ── setToken ───────────────────────────────────────────────────
  it('setToken updates token in state and localStorage', () => {
    useAuthStore.getState().setToken('new-token');

    expect(useAuthStore.getState().token).toBe('new-token');
    expect(localStorage.getItem('authToken')).toBe('new-token');
  });

  // ── initializeAuth ─────────────────────────────────────────────
  it('initializeAuth restores state from localStorage', () => {
    localStorage.setItem('authToken', 'stored-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    useAuthStore.getState().initializeAuth();

    const state = useAuthStore.getState();
    expect(state.token).toBe('stored-token');
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('initializeAuth clears state when localStorage is empty', () => {
    useAuthStore.getState().initializeAuth();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  // ── getUserRole ────────────────────────────────────────────────
  it('getUserRole returns the role of the current user', () => {
    useAuthStore.getState().login(mockUser, 'jwt-token');
    expect(useAuthStore.getState().getUserRole()).toBe('SUPERADMIN');
  });

  it('getUserRole returns null when no user is logged in', () => {
    expect(useAuthStore.getState().getUserRole()).toBeNull();
  });
});
