import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { User, UserRole } from '@/types';

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuth = (): UseAuthReturn => {
  const { user, token, isAuthenticated, isLoading, login, logout, setUser, setToken, getUserRole } =
    useAuthStore();

  const userRole = useCallback(() => getUserRole(), [getUserRole])();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    userRole,
    login,
    logout,
    setUser,
    setToken,
  };
};
