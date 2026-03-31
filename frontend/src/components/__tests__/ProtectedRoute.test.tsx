import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../common/ProtectedRoute';

// Mock useAuth hook
const mockUseAuth = jest.fn();
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock react-router Navigate
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
}));

// Mock LoadingSkeleton
jest.mock('@/components/common/LoadingSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-skeleton" />,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ProtectedRoute', () => {
  it('renders children when authenticated with correct role', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      userRole: 'SUPERADMIN',
    });

    render(
      <ProtectedRoute requiredRole="SUPERADMIN">
        <div data-testid="protected-content">Secret Page</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      userRole: null,
    });

    render(
      <ProtectedRoute>
        <div>Secret Page</div>
      </ProtectedRoute>
    );

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toBeInTheDocument();
    expect(navigate.getAttribute('data-to')).toBe('/login');
  });

  it('redirects to /login when authenticated but wrong role', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      userRole: 'PATIENT',
    });

    render(
      <ProtectedRoute requiredRole="SUPERADMIN">
        <div>Admin Only</div>
      </ProtectedRoute>
    );

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toBeInTheDocument();
    expect(navigate.getAttribute('data-to')).toBe('/login');
  });

  it('shows loading skeleton when isLoading is true', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      userRole: null,
    });

    render(
      <ProtectedRoute>
        <div>Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders children when authenticated and no requiredRole specified', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      userRole: 'DOCTOR',
    });

    render(
      <ProtectedRoute>
        <div data-testid="any-role-content">Any Role Page</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('any-role-content')).toBeInTheDocument();
  });
});
