// Dashboard
export interface DashboardStats {
  totalCountries: number;
  totalClinics: number;
  totalDoctors: number;
  totalPatients: number;
  countryDelta: number;
  clinicDelta: number;
  doctorDelta: number;
  patientDelta: number;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: any;
  newValue: any;
  ipAddress: string;
  createdAt: string;
}

export interface AIInsight {
  message: string;
}

// Country
export interface CountryConfig {
  id: string;
  code: string;
  name: string;
  flagEmoji: string;
  status: string;
  currencyCode: string;
  currencySymbol: string;
  taxType: string;
  taxRate: number;
  dateFormat: string;
  primaryLanguage: string;
  secondaryLanguage: string;
  regulatoryBodies: string[];
  clinicCount: number;
  doctorCount: number;
}

export interface CountryConfigRequest {
  code: string;
  name: string;
  flagEmoji: string;
  status: string;
  currencyCode: string;
  currencySymbol: string;
  taxType: string;
  taxRate: number;
  dateFormat: string;
  primaryLanguage: string;
  secondaryLanguage: string;
  regulatoryBodies: string[];
}

// Clinic
export interface ClinicSummary {
  id: string;
  countryId: string;
  tenantId: string;
  name: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  registrationNumber: string;
  licenseNumber: string;
  licenseValidUntil: string;
  logoUrl: string;
  status: string;
  countryName: string;
  countryFlag: string;
  complianceTags: string[];
}

export interface ClinicRequest {
  countryId: string;
  name: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  registrationNumber: string;
  licenseNumber: string;
  licenseValidUntil: string;
  logoUrl?: string;
  status: string;
}

// Feature Flags
export interface FeatureFlagDto {
  id: string;
  key: string;
  name: string;
  description: string;
  locked: boolean;
  countries: Record<string, boolean>; // countryId -> enabled
}

// Compliance
export interface ComplianceModuleDto {
  id: string;
  countryId: string;
  moduleKey: string;
  moduleName: string;
  description: string;
  enabled: boolean;
  sortOrder: number;
}

// Billing
export interface BillingConfigDto {
  id: string;
  countryId: string;
  currencySymbol: string;
  currencyCode: string;
  taxRate: number;
  taxSplit: string;
  claimCode: string;
  invoicePrefix: string;
  invoiceFormat: string;
  toggles: Record<string, boolean>;
}

export interface BillingConfigRequest {
  currencySymbol: string;
  currencyCode: string;
  taxRate: number;
  taxSplit: string;
  claimCode: string;
  invoicePrefix: string;
  invoiceFormat: string;
  toggles: Record<string, boolean>;
}

// Locale
export interface LocaleSettingsDto {
  id: string;
  countryId: string;
  primaryLanguage: string;
  secondaryLanguage: string;
  dateFormat: string;
  weightUnit: string;
  heightUnit: string;
  timezone: string;
}

export interface LocaleSettingsRequest {
  primaryLanguage: string;
  secondaryLanguage: string;
  dateFormat: string;
  weightUnit: string;
  heightUnit: string;
  timezone: string;
}

// ID Format
export interface IdFormatTemplateDto {
  id: string;
  countryId: string;
  entityType: string;
  prefix: string;
  entityCode: string;
  separator: string;
  padding: number;
  startsAt: number;
  locked: boolean;
  preview: string;
}

export interface IdFormatUpdateRequest {
  prefix: string;
  entityCode: string;
  separator: string;
  padding: number;
  startsAt: number;
}

// Field Definitions
export interface FieldDefinitionDto {
  id: string;
  scope: string;
  countryId: string | null;
  section: string;
  fieldKey: string;
  label: string;
  fieldType: string;
  locked: boolean;
  required: boolean;
  removable: boolean;
  sortOrder: number;
}

export interface FieldRequest {
  scope: string;
  countryId?: string;
  section: string;
  fieldKey: string;
  label: string;
  fieldType: string;
  locked: boolean;
  required: boolean;
  removable: boolean;
}

export interface FieldReorderRequest {
  orderedIds: string[];
}

// Doctor Roster
export interface DoctorRosterDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  systemId: string;
  roles: string[];
  speciality: string;
  clinic: string;
  registration: string;
  country: string;
  countryFlag: string;
}

export interface RoleUpdateRequest {
  roles: string[];
}

// Equidor
export interface EquidorSessionDto {
  id: string;
  cid: string;
  ingestionDate: string;
  status: string;
  totalDevices: number;
  totalFiles: number;
  devices: EquidorDeviceDto[];
}

export interface EquidorDeviceDto {
  deviceId: string;
  deviceName: string;
  clinics: EquidorClinicDto[];
}

export interface EquidorClinicDto {
  clinicId: string;
  clinicName: string;
  patients: EquidorPatientDto[];
}

export interface EquidorPatientDto {
  patientId: string;
  patientName: string;
  files: EquidorFileDto[];
}

export interface EquidorFileDto {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: string;
  failReason: string | null;
  receivedAt: string;
}

// Invitations
export interface InvitationDto {
  id: string;
  email: string;
  phone: string;
  invitedByName: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface InviteRequest {
  email: string;
  phone: string;
}

// ─── Tenant Config Types (Countries page) ──────────────────────────────────────

export type TenantStatusType = 'ACTIVE' | 'INACTIVE';

export interface TenantStatus {
  type: TenantStatusType;
}

export interface TenantLoginConfig {
  emailEnabled: boolean;
  phoneEnabled: boolean;
  nationalIdEnabled: boolean;
  emailOtp?: { length: number; expiryMin: number; retries: number; subject: string; body: string };
  phoneOtp?: { length: number; expiryMin: number; retries: number; smsMessage: string };
  nationalId?: { systemName: string; format: string };
}

export interface TenantFullConfig extends CountryConfig {
  tenantId: string;
  dialCode: string;
  loginConfig: TenantLoginConfig;
  locale: {
    timezone: string;
    primaryLanguage: string;
    secondaryLanguage: string;
  };
  compliance: {
    modules: string[];
    regulatoryBody: string;
    dataResidency: string;
  };
  clinical: {
    countryPrefix: string;
    userIdFormat: string;
    clinicIdFormat: string;
    billingModel: string;
    taxType: string;
    taxRate: number;
  };
  stats: {
    clinics: number;
    doctors: number;
    patients: number;
    uniqueLogins: number;
    uptime: string;
  };
}

export interface ReviewQAItem {
  question: string;
  mandatory: boolean;
  answer: 'yes' | 'no' | 'na' | null;
  answeredAt: string | null;
}

export interface TenantDraft {
  loginConfig: TenantLoginConfig;
  identity: {
    countryName: string;
    isoCode: string;
    flagEmoji: string;
    dialCode: string;
    adminName: string;
    adminEmail: string;
  };
  setup: {
    timezone: string;
    currency: string;
    language: string;
    complianceModules: string[];
    countryPrefix: string;
    userIdFormat: string;
    clinicIdFormat: string;
    billingModel: string;
  };
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Paginated response
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
