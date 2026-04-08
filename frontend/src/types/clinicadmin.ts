// Dashboard
export interface ClinicDashboardStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointmentsToday: number;
  totalRevenue: number;
  doctorDelta: number;
  patientDelta: number;
  appointmentDelta: number;
  revenueDelta: number;
}

// Config
export interface ClinicConfig {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  timezone: string;
  currency: string;
  dateFormat: string;
}

// Schedule
export interface ScheduleConfig {
  id: string;
  clinicId: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  slotDuration: number;
  breakStart: string;
  breakEnd: string;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  slotDuration: number;
}

// Billing
export interface BillingConfig {
  id: string;
  clinicId: string;
  taxType: string;
  taxRate: number;
  currency: string;
  invoicePrefix: string;
  paymentModes: string[];
}

// ID Config
export interface IDConfig {
  id: string;
  entityType: string;
  prefix: string;
  entityCode: string;
  separator: string;
  padding: number;
  startsAt: number;
  locked: boolean;
  preview: string;
}

// Custom Fields
export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: string;
  entityType: string;
  required: boolean;
  options: string[];
  order: number;
}

// Staff / Roster
export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  specialization?: string;
  joinedAt: string;
}

// Patient
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  createdAt: string;
}

// Compliance
export interface ComplianceStatus {
  category: string;
  status: string;
  items: ComplianceItem[];
}

export interface ComplianceItem {
  name: string;
  status: string;
  description: string;
  lastChecked: string;
}

// Template
export interface ClinicTemplate {
  id: string;
  type: string;
  name: string;
  content: string;
  updatedAt: string;
}

// Data Import
export interface ImportRecord {
  id: string;
  type: string;
  fileName: string;
  status: string;
  recordCount: number;
  errors: number;
  createdAt: string;
}

// Report
export interface ClinicReport {
  period: string;
  totalAppointments: number;
  totalRevenue: number;
  newPatients: number;
  returningPatients: number;
}

// Paged response
export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// API wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
