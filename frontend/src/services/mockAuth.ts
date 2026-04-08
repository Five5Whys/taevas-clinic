/**
 * Mock Auth Service — enables the frontend to run standalone without the backend.
 * Activated when VITE_MOCK_AUTH=true in .env (default in dev).
 */
import type { User, UserRole } from '@/types';
import api from './api';

// Pre-built mock users for each role
export const MOCK_USERS: Record<UserRole, User> = {
  SUPERADMIN: {
    id: 'sa-001',
    phone: '9876543210',
    email: 'admin@taevas.health',
    firstName: 'Taevas',
    lastName: 'Admin',
    role: 'SUPERADMIN',
    clinicId: 'global',
    clinicName: 'Taevas Global',
  },
  CLINIC_ADMIN: {
    id: 'ca-001',
    phone: '9876543211',
    email: 'clinic@entcare.in',
    firstName: 'Sunita',
    lastName: 'Rao',
    role: 'CLINIC_ADMIN',
    clinicId: 'clinic-pune-001',
    clinicName: 'ENT Care Center, Pune',
  },
  DOCTOR: {
    id: 'dr-001',
    phone: '9876543212',
    email: 'rajesh@entcare.in',
    firstName: 'Dr. Rajesh',
    lastName: 'Kumar',
    role: 'DOCTOR',
    clinicId: 'clinic-pune-001',
    clinicName: 'ENT Care Center, Pune',
    assignments: [
      { role: 'DOCTOR', clinicId: 'clinic-pune-001', clinicName: 'ENT Care Center, Pune' },
      { role: 'DOCTOR', clinicId: 'clinic-mumbai-002', clinicName: 'Apollo ENT, Mumbai' },
    ],
  },
  PATIENT: {
    id: 'pt-001',
    phone: '9876543213',
    email: 'anita@gmail.com',
    firstName: 'Anita',
    lastName: 'Sharma',
    role: 'PATIENT',
    clinicId: 'clinic-pune-001',
    clinicName: 'ENT Care Center, Pune',
  },
  NURSE: {
    id: 'nr-001',
    phone: '9876543214',
    email: 'meera@entcare.in',
    firstName: 'Meera',
    lastName: 'Nair',
    role: 'NURSE',
    clinicId: 'clinic-pune-001',
    clinicName: 'ENT Care Center, Pune',
  },
  ASSISTANT: {
    id: 'as-001',
    phone: '9876543215',
    email: 'ravi@entcare.in',
    firstName: 'Ravi',
    lastName: 'Patel',
    role: 'ASSISTANT',
    clinicId: 'clinic-pune-001',
    clinicName: 'ENT Care Center, Pune',
  },
};

const MOCK_TOKEN = 'mock-jwt-token-for-dev-only';

/** Dev credentials for each role — must match seeded backend users */
const MOCK_CREDENTIALS: Partial<Record<UserRole, { identifier: string; password: string }>> = {
  SUPERADMIN:   { identifier: '9876543210', password: 'password' },
  CLINIC_ADMIN: { identifier: '9876543211', password: 'password' },
};

// TODO: Re-enable when real token acquisition flow is needed
// /**
//  * Silently fetch a real JWT from the backend using dev credentials.
//  * On success, overwrites the mock token so all API calls are authenticated.
//  * On failure (BE down), mock token stays — graceful degradation.
//  */
// const acquireRealToken = async (role: UserRole): Promise<void> => {
//   const creds = MOCK_CREDENTIALS[role] ?? MOCK_CREDENTIALS.SUPERADMIN;
//   if (!creds) return;
//   try {
//     const res = await api.post('/auth/login', { identifier: creds.identifier, password: creds.password });
//     const d = res.data?.data;
//     if (d?.token) {
//       localStorage.setItem('authToken', d.token);
//       if (d.refreshToken) localStorage.setItem('refreshToken', d.refreshToken);
//       if (d.user) localStorage.setItem('user', JSON.stringify(d.user));
//       if (import.meta.env.DEV) console.info('[MockAuth] Real JWT acquired for', role);
//     }
//   } catch {
//     if (import.meta.env.DEV) console.warn('[MockAuth] BE unreachable — using mock token');
//   }
// };

export const isMockAuthEnabled = (): boolean => {
  return import.meta.env.VITE_MOCK_AUTH === 'true';
};

export const mockLogin = (role: UserRole): { user: User; token: string } => {
  const user = MOCK_USERS[role];
  localStorage.setItem('authToken', MOCK_TOKEN);
  localStorage.setItem('user', JSON.stringify(user));
  return { user, token: MOCK_TOKEN };
};

/** Awaitable version — gets real JWT before returning. Falls back to mock if BE down. */
export const mockLoginWithRealToken = async (role: UserRole): Promise<{ user: User; token: string }> => {
  const user = MOCK_USERS[role];
  const creds = MOCK_CREDENTIALS[role] ?? MOCK_CREDENTIALS.SUPERADMIN;
  if (creds) {
    try {
      const res = await api.post('/auth/login', { identifier: creds.identifier, password: creds.password });
      const d = res.data?.data;
      if (d?.token) {
        localStorage.setItem('authToken', d.token);
        if (d.refreshToken) localStorage.setItem('refreshToken', d.refreshToken);
        if (d.user) localStorage.setItem('user', JSON.stringify(d.user));
        return { user: d.user ?? user, token: d.token };
      }
    } catch {
      if (import.meta.env.DEV) console.warn('[MockAuth] BE unreachable — using mock token');
    }
  }
  localStorage.setItem('authToken', MOCK_TOKEN);
  localStorage.setItem('user', JSON.stringify(user));
  return { user, token: MOCK_TOKEN };
};

export const mockSendOtp = async (_phone: string): Promise<void> => {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 500));
};

export const mockVerifyOtp = async (
  _phone: string,
  _otp: string,
  role: UserRole = 'DOCTOR'
): Promise<{ user: User; token: string }> => {
  await new Promise((r) => setTimeout(r, 800));
  return mockLogin(role);
};
