// User & Authentication Types
export type UserRole = 'SUPERADMIN' | 'CLINIC_ADMIN' | 'DOCTOR' | 'PATIENT';

export interface User {
  id: string;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  profilePicture?: string;
  clinicId?: string;
  clinicName?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth API Requests/Responses
export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  refreshToken?: string;
}

export interface TokenRefreshResponse {
  token: string;
  refreshToken?: string;
}

// Generic API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard Stats
export interface DashboardStats {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

// Activity/Event Log
export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  icon?: string;
}

// Appointments
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  clinicId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  appointmentType: 'CONSULTATION' | 'FOLLOW_UP' | 'CHECK_UP';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Prescriptions
export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  medications: PrescriptionMedication[];
  instructions?: string;
  createdAt: string;
  validUntil: string;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
}

export interface PrescriptionMedication {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

// Clinic
export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
  registrationNumber: string;
  licenseNumber: string;
  licenseValidUntil: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Doctor
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  licenseValidUntil: string;
  clinicId: string;
  profilePicture?: string;
  bio?: string;
  consultationFee: number;
  createdAt: string;
  updatedAt: string;
}

// Patient
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

// Health Records
export interface HealthRecord {
  id: string;
  patientId: string;
  recordType: string;
  recordTitle: string;
  recordDate: string;
  fileUrl?: string;
  notes?: string;
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'PRESCRIPTION' | 'SYSTEM' | 'MESSAGE';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Queue
export interface QueueEntry {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  appointmentTime: string;
  queueNumber: number;
  status: 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'SKIPPED';
  waitTime?: number;
  doctorId: string;
  clinicId: string;
  createdAt: string;
}

// Search Results
export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'appointment' | 'patient' | 'doctor' | 'prescription';
  url: string;
}

// Filter Options
export interface FilterOptions {
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  [key: string]: unknown;
}
