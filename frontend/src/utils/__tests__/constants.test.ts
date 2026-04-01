import {
  ROLES,
  API_ENDPOINTS,
  NAVIGATION_CONFIG,
  DEFAULT_PAGE_SIZE,
  ROLE_REDIRECT_MAP,
} from '../constants';

describe('ROLES', () => {
  it('contains SUPERADMIN', () => {
    expect(ROLES.SUPERADMIN).toBe('SUPERADMIN');
  });

  it('contains CLINIC_ADMIN', () => {
    expect(ROLES.CLINIC_ADMIN).toBe('CLINIC_ADMIN');
  });

  it('contains DOCTOR', () => {
    expect(ROLES.DOCTOR).toBe('DOCTOR');
  });

  it('contains PATIENT', () => {
    expect(ROLES.PATIENT).toBe('PATIENT');
  });
});

describe('API_ENDPOINTS', () => {
  it('has auth endpoints', () => {
    expect(API_ENDPOINTS.AUTH_SEND_OTP).toBeDefined();
    expect(API_ENDPOINTS.AUTH_VERIFY_OTP).toBeDefined();
    expect(API_ENDPOINTS.AUTH_REFRESH_TOKEN).toBeDefined();
    expect(API_ENDPOINTS.AUTH_LOGOUT).toBeDefined();
  });

  it('has superadmin endpoints', () => {
    expect(API_ENDPOINTS.SUPERADMIN_CLINICS).toBeDefined();
    expect(API_ENDPOINTS.SUPERADMIN_STATS).toBeDefined();
  });

  it('has shared endpoints', () => {
    expect(API_ENDPOINTS.NOTIFICATIONS).toBe('/notifications');
    expect(API_ENDPOINTS.USERS_PROFILE).toBe('/users/profile');
  });
});

describe('NAVIGATION_CONFIG', () => {
  it('has config for SUPERADMIN', () => {
    expect(NAVIGATION_CONFIG[ROLES.SUPERADMIN]).toBeDefined();
    expect(NAVIGATION_CONFIG[ROLES.SUPERADMIN]!.length).toBeGreaterThan(0);
  });

  it('has config for CLINIC_ADMIN', () => {
    expect(NAVIGATION_CONFIG[ROLES.CLINIC_ADMIN]).toBeDefined();
    expect(NAVIGATION_CONFIG[ROLES.CLINIC_ADMIN]!.length).toBeGreaterThan(0);
  });

  it('has config for DOCTOR', () => {
    expect(NAVIGATION_CONFIG[ROLES.DOCTOR]).toBeDefined();
    expect(NAVIGATION_CONFIG[ROLES.DOCTOR]!.length).toBeGreaterThan(0);
  });

  it('has config for PATIENT', () => {
    expect(NAVIGATION_CONFIG[ROLES.PATIENT]).toBeDefined();
    expect(NAVIGATION_CONFIG[ROLES.PATIENT]!.length).toBeGreaterThan(0);
  });
});

describe('DEFAULT_PAGE_SIZE', () => {
  it('is 10', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(10);
  });
});

describe('ROLE_REDIRECT_MAP', () => {
  it('maps SUPERADMIN to /superadmin', () => {
    expect(ROLE_REDIRECT_MAP.SUPERADMIN).toBe('/superadmin');
  });

  it('maps CLINIC_ADMIN to /admin', () => {
    expect(ROLE_REDIRECT_MAP.CLINIC_ADMIN).toBe('/admin');
  });

  it('maps DOCTOR to /doctor', () => {
    expect(ROLE_REDIRECT_MAP.DOCTOR).toBe('/doctor');
  });

  it('maps PATIENT to /patient', () => {
    expect(ROLE_REDIRECT_MAP.PATIENT).toBe('/patient');
  });
});
