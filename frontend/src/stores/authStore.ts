import { create } from 'zustand';
import { User, AuthState, UserRole } from '@/types';
import authService from '@/services/authService';
import { isMockAuthEnabled, mockLoginWithRealToken } from '@/services/mockAuth';

interface AuthStoreState extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  getUserRole: () => UserRole | null;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user: User, token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
    set({ token });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initializeAuth: () => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();

    if (token && user) {
      if (isMockAuthEnabled() && token === 'mock-jwt-token-for-dev-only') {
        // Keep isLoading:true until real JWT arrives — prevents API calls firing with mock token (→ 401)
        mockLoginWithRealToken(user.role as UserRole).then(({ user: u, token: t }) => {
          set({ token: t, user: u, isAuthenticated: true, isLoading: false });
        });
      } else {
        set({ token, user, isAuthenticated: true, isLoading: false });
      }
    } else {
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },

  getUserRole: (): UserRole | null => {
    const { user } = get();
    return user?.role || null;
  },
}));
