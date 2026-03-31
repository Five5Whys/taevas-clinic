/**
 * Mock Auth Service — enables the frontend to run standalone without the backend.
 * Activated when VITE_MOCK_AUTH=true in .env (default in dev).
 */
import { User, UserRole } from '@/types';

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

export const isMockAuthEnabled = (): boolean => {
  return import.meta.env.VITE_MOCK_AUTH === 'true';
};

export const mockLogin = (role: UserRole): { user: User; token: string } => {
  const user = MOCK_USERS[role];
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
