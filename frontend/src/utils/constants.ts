import { UserRole } from '@/types';

// Country Codes — single source of truth
export const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '\u{1F1EE}\u{1F1F3}', maxLen: 10 },
  { code: '+66', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', maxLen: 9 },
  { code: '+960', country: 'Maldives', flag: '\u{1F1F2}\u{1F1FB}', maxLen: 7 },
  { code: '+94', country: 'Sri Lanka', flag: '\u{1F1F1}\u{1F1F0}', maxLen: 9 },
  { code: '+880', country: 'Bangladesh', flag: '\u{1F1E7}\u{1F1E9}', maxLen: 10 },
  { code: '+971', country: 'UAE', flag: '\u{1F1E6}\u{1F1EA}', maxLen: 9 },
  { code: '+20', country: 'Egypt', flag: '\u{1F1EA}\u{1F1EC}', maxLen: 10 },
  { code: '+977', country: 'Nepal', flag: '\u{1F1F3}\u{1F1F5}', maxLen: 10 },
  { code: '+65', country: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}', maxLen: 8 },
  { code: '+60', country: 'Malaysia', flag: '\u{1F1F2}\u{1F1FE}', maxLen: 10 },
];

// User Roles
export const ROLES = {
  SUPERADMIN: 'SUPERADMIN' as UserRole,
  CLINIC_ADMIN: 'CLINIC_ADMIN' as UserRole,
  DOCTOR: 'DOCTOR' as UserRole,
  PATIENT: 'PATIENT' as UserRole,
  NURSE: 'NURSE' as UserRole,
  ASSISTANT: 'ASSISTANT' as UserRole,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_SEND_OTP: '/auth/send-otp',
  AUTH_VERIFY_OTP: '/auth/verify-otp',
  AUTH_REFRESH_TOKEN: '/auth/refresh-token',
  AUTH_LOGOUT: '/auth/logout',

  // SuperAdmin
  SUPERADMIN_CLINICS: '/superadmin/clinics',
  SUPERADMIN_DOCTORS: '/superadmin/doctors',
  SUPERADMIN_PATIENTS: '/superadmin/patients',
  SUPERADMIN_STATS: '/superadmin/stats',
  SUPERADMIN_ACTIVITY: '/superadmin/activity',

  // Clinic Admin
  CLINICADMIN_DASHBOARD: '/clinicadmin/dashboard',
  CLINICADMIN_STAFF: '/clinicadmin/staff',
  CLINICADMIN_PATIENTS: '/clinicadmin/patients',
  CLINICADMIN_CONFIG: '/clinicadmin/config',
  CLINICADMIN_SCHEDULE_CONFIG: '/clinicadmin/schedule-config',
  CLINICADMIN_BILLING: '/clinicadmin/billing',
  CLINICADMIN_CUSTOM_FIELDS: '/clinicadmin/custom-fields',
  CLINICADMIN_ID_CONFIG: '/clinicadmin/id-config',
  CLINICADMIN_COMPLIANCE: '/clinicadmin/compliance',
  CLINICADMIN_DATA_IMPORT: '/clinicadmin/data-import',
  CLINICADMIN_TEMPLATES: '/clinicadmin/templates',
  CLINICADMIN_REPORTS: '/clinicadmin/reports',

  // Doctor
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  DOCTOR_APPOINTMENTS: '/doctor/appointments',
  DOCTOR_PATIENTS: '/doctor/patients',
  DOCTOR_ENCOUNTERS: '/doctor/encounters',
  DOCTOR_PRESCRIPTIONS: '/doctor/prescriptions',
  DOCTOR_BILLING: '/doctor/billing',
  DOCTOR_DEVICE_REPORTS: '/doctor/device-reports',
  DOCTOR_FAMILY: '/doctor/family',
  DOCTOR_WHATSAPP: '/doctor/whatsapp',
  DOCTOR_MARKETING: '/doctor/marketing',

  // Patient
  PATIENT_DASHBOARD: '/patient/dashboard',
  PATIENT_APPOINTMENTS: '/patient/appointments',
  PATIENT_PRESCRIPTIONS: '/patient/prescriptions',
  PATIENT_HEALTH_RECORDS: '/patient/health-records',
  PATIENT_FAMILY: '/patient/family',

  // Shared
  NOTIFICATIONS: '/notifications',
  USERS_PROFILE: '/users/profile',
  USERS_SEARCH: '/users/search',
};

// Navigation Configuration by Role
// emoji: shown in sidebar; badge: optional counter chip; section: group header
export const NAVIGATION_CONFIG = {
  [ROLES.SUPERADMIN]: [
    // Devices — TOP of panel
    { id: 'equidor',        label: 'Equidor',            emoji: '🔬', icon: 'DeviceHub',    path: '/superadmin/equidor',        section: 'Devices', badge: '3' },
    // Overview
    { id: 'dashboard',      label: 'Control Center',     emoji: '📊', icon: 'Dashboard',    path: '/superadmin',                section: 'Overview' },
    { id: 'users',          label: 'User Management',    emoji: '👤', icon: 'PersonAdd',    path: '/superadmin/users',          section: 'Overview' },
    { id: 'countries',      label: 'Countries',          emoji: '🌍', icon: 'Public',       path: '/superadmin/countries',      section: 'Overview' },
    { id: 'clinics',        label: 'Clinics',            emoji: '🏥', icon: 'LocationCity', path: '/superadmin/clinics',        section: 'Overview', badge: '12' },
    { id: 'audit',          label: 'Audit Log',          emoji: '📜', icon: 'History',       path: '/superadmin/audit',          section: 'Overview' },
    // Configuration
    { id: 'feature-flags',  label: 'Features',           emoji: '🚩', icon: 'ToggleOn',     path: '/superadmin/feature-flags',  section: 'Configuration' },
    { id: 'field-manager',  label: 'Field Manager',      emoji: '📋', icon: 'ViewList',     path: '/superadmin/field-manager',  section: 'Configuration' },
    { id: 'compliance',     label: 'Compliance',         emoji: '🛡️', icon: 'VerifiedUser', path: '/superadmin/compliance',     section: 'Configuration' },
    { id: 'id-management',  label: 'ID Config',          emoji: '🔑', icon: 'Badge',        path: '/superadmin/id-management',  section: 'Configuration' },
    { id: 'roster',         label: 'Global Roster',      emoji: '👥', icon: 'People',       path: '/superadmin/roster',         section: 'Configuration', badge: '47' },
    // Data
    { id: 'data-import',    label: 'Data Import',        emoji: '📥', icon: 'CloudUpload',  path: '/superadmin/data-import',    section: 'Data' },
    { id: 'templates',      label: 'Templates',          emoji: '🎨', icon: 'Palette',      path: '/superadmin/templates',      section: 'Data' },
  ],
  [ROLES.CLINIC_ADMIN]: [
    // Overview
    { id: 'dashboard',    label: 'Clinic Overview',   emoji: '📊', icon: 'Dashboard',    path: '/admin',               section: 'Overview' },
    { id: 'staff',        label: 'Staff Management',  emoji: '👥', icon: 'People',       path: '/admin/staff',         section: 'Overview' },
    { id: 'patients',     label: 'Patient Registry',  emoji: '🏥', icon: 'PersonSearch', path: '/admin/patients',      section: 'Overview' },
    { id: 'reports',      label: 'Reports',           emoji: '📈', icon: 'Assessment',   path: '/admin/reports',       section: 'Overview' },
    // Configuration
    { id: 'config',       label: 'Clinic Config',     emoji: '⚙️', icon: 'Settings',     path: '/admin/config',        section: 'Configuration' },
    { id: 'schedule',     label: 'Schedule Config',   emoji: '📅', icon: 'Schedule',     path: '/admin/schedule',      section: 'Configuration' },
    { id: 'custom-fields',label: 'Custom Fields',     emoji: '📋', icon: 'ListAlt',      path: '/admin/custom-fields', section: 'Configuration' },
    { id: 'billing',      label: 'Billing Setup',     emoji: '💰', icon: 'Payment',      path: '/admin/billing',       section: 'Configuration' },
    { id: 'id-config',    label: 'ID Config',         emoji: '🔑', icon: 'Badge',        path: '/admin/id-config',     section: 'Configuration' },
    // Data
    { id: 'data-import',  label: 'Data Import',       emoji: '📥', icon: 'CloudUpload',  path: '/admin/data-import',   section: 'Data' },
    { id: 'templates',    label: 'Templates',         emoji: '🎨', icon: 'Palette',      path: '/admin/templates',     section: 'Data' },
    // Compliance
    { id: 'compliance',   label: 'Compliance Status', emoji: '🛡️', icon: 'VerifiedUser', path: '/admin/compliance',    section: 'Compliance' },
  ],
  [ROLES.DOCTOR]: [
    // Clinical
    { id: 'dashboard',      label: 'Dashboard',       emoji: '📊', icon: 'Dashboard',        path: '/doctor',                 section: 'Clinical' },
    { id: 'appointments',   label: 'Appointments',    emoji: '📅', icon: 'EventNote',         path: '/doctor/appointments',    section: 'Clinical', badge: '7' },
    { id: 'patients',       label: 'Patients',        emoji: '👥', icon: 'People',            path: '/doctor/patients',        section: 'Clinical' },
    { id: 'encounter',      label: 'Encounter',       emoji: '🩺', icon: 'MedicalServices',   path: '/doctor/encounter',       section: 'Clinical' },
    { id: 'prescriptions',  label: 'Prescriptions',   emoji: '💊', icon: 'Receipt',           path: '/doctor/prescriptions',   section: 'Clinical' },
    // Reports
    { id: 'device-reports', label: 'Device Reports',  emoji: '🔬', icon: 'DeviceHub',         path: '/doctor/device-reports',  section: 'Reports', badge: '3' },
    { id: 'family',         label: 'Family Records',  emoji: '👨‍👩‍👧', icon: 'FamilyRestroom',     path: '/doctor/family',          section: 'Reports' },
    // Billing
    { id: 'billing',        label: 'Billing',         emoji: '🧾', icon: 'Payment',           path: '/doctor/billing',         section: 'Billing' },
    // Growth
    { id: 'whatsapp',       label: 'WhatsApp Bot',    emoji: '💬', icon: 'WhatsApp',          path: '/doctor/whatsapp',        section: 'Growth', badge: '5' },
    { id: 'marketing',      label: 'Marketing',       emoji: '📣', icon: 'Campaign',          path: '/doctor/marketing',       section: 'Growth' },
  ],
  [ROLES.PATIENT]: [
    { id: 'dashboard',     label: 'Dashboard',      emoji: '📊', icon: 'Dashboard',         path: '/patient' },
    { id: 'appointments',  label: 'Appointments',   emoji: '📅', icon: 'EventNote',          path: '/patient/appointments' },
    { id: 'prescriptions', label: 'Prescriptions',  emoji: '💊', icon: 'Receipt',            path: '/patient/prescriptions' },
    { id: 'health',        label: 'Health Records', emoji: '❤️', icon: 'HealthAndSafety',    path: '/patient/health' },
    { id: 'family',        label: 'Family',         emoji: '👨‍👩‍👧', icon: 'Group',              path: '/patient/family' },
  ],
};

// Status Colors
export const STATUS_COLORS: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
  ACTIVE: 'success',
  COMPLETED: 'success',
  SCHEDULED: 'info',
  IN_PROGRESS: 'info',
  PENDING: 'warning',
  CANCELLED: 'error',
  EXPIRED: 'error',
  NO_SHOW: 'error',
  WAITING: 'info',
  IN_CONSULTATION: 'warning',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
};

// Appointment Types
export const APPOINTMENT_TYPE = {
  CONSULTATION: 'CONSULTATION',
  FOLLOW_UP: 'FOLLOW_UP',
  CHECK_UP: 'CHECK_UP',
};

// Queue Status
export const QUEUE_STATUS = {
  WAITING: 'WAITING',
  IN_CONSULTATION: 'IN_CONSULTATION',
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
};

// Date/Time Constants
export const DATE_FORMAT = 'dd MMM yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'dd MMM yyyy HH:mm';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZES = [10, 25, 50, 100];

// Search
export const SEARCH_DEBOUNCE_TIME = 300; // ms

// Redirect URLs by Role after successful login
export const ROLE_REDIRECT_MAP: Record<string, string> = {
  [ROLES.SUPERADMIN]: '/superadmin',
  [ROLES.CLINIC_ADMIN]: '/admin',
  [ROLES.DOCTOR]: '/doctor',
  [ROLES.PATIENT]: '/patient',
  [ROLES.NURSE]: '/doctor',      // Nurse shares Doctor view
  [ROLES.ASSISTANT]: '/doctor',  // Assistant shares Doctor view
};
