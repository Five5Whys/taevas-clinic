import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage';
import OtpVerifyPage from '@/pages/auth/OtpVerifyPage';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import DevRoleSwitcher from '@/components/common/DevRoleSwitcher';

// SuperAdmin Pages
const SADashboard = lazy(() => import('@/pages/superadmin/Dashboard'));
const SACtyConfig = lazy(() => import('@/pages/superadmin/CtyConfig'));
const SAFeatureFlags = lazy(() => import('@/pages/superadmin/FeatureFlags'));
const SAFieldManager = lazy(() => import('@/pages/superadmin/FieldManager'));
const SACompliance = lazy(() => import('@/pages/superadmin/Compliance'));
const SAIDManagement = lazy(() => import('@/pages/superadmin/IDManagement'));
const SAGlobalRoster = lazy(() => import('@/pages/superadmin/GlobalRoster'));
const SAClinics = lazy(() => import('@/pages/superadmin/Clinics'));
const SAEquidor = lazy(() => import('@/pages/superadmin/Equidor'));
const SACountries = lazy(() => import('@/pages/superadmin/Countries'));
const SAUserManagement = lazy(() => import('@/pages/superadmin/UserManagement'));
const SAAuditLog = lazy(() => import('@/pages/superadmin/AuditLog'));

// Clinic Admin Pages
const CADashboard = lazy(() => import('@/pages/clinicadmin/Dashboard'));
const CAConfig = lazy(() => import('@/pages/clinicadmin/Config'));
const CACustomFields = lazy(() => import('@/pages/clinicadmin/CustomFields'));
const CABillingSetup = lazy(() => import('@/pages/clinicadmin/BillingSetup'));
const CAIDConfig = lazy(() => import('@/pages/clinicadmin/IDConfig'));
const CAScheduleConfig = lazy(() => import('@/pages/clinicadmin/ScheduleConfig'));
const CARoster = lazy(() => import('@/pages/clinicadmin/Roster'));
const CAComplianceStatus = lazy(() => import('@/pages/clinicadmin/ComplianceStatus'));
const CATemplates = lazy(() => import('@/pages/clinicadmin/Templates'));
const CADataImport = lazy(() => import('@/pages/clinicadmin/DataImport'));
const CAUserManagement = lazy(() => import('@/pages/clinicadmin/UserManagement'));
const CAReports = lazy(() => import('@/pages/clinicadmin/Reports'));

// Doctor Pages
const DRDashboard = lazy(() => import('@/pages/doctor/Dashboard'));
const DRAppointments = lazy(() => import('@/pages/doctor/Appointments'));
const DRPatients = lazy(() => import('@/pages/doctor/Patients'));
const DREncounter = lazy(() => import('@/pages/doctor/Encounter'));
const DRPrescriptions = lazy(() => import('@/pages/doctor/Prescriptions'));
const DRDeviceReports = lazy(() => import('@/pages/doctor/DeviceReports'));
const DRFamily = lazy(() => import('@/pages/doctor/Family'));
const DRBilling = lazy(() => import('@/pages/doctor/Billing'));
const DRWhatsApp = lazy(() => import('@/pages/doctor/WhatsApp'));
const DRMarketing = lazy(() => import('@/pages/doctor/Marketing'));

// Patient
const PatientDashboard = lazy(() => import('@/pages/patient/Dashboard'));
const PatientAppointments = lazy(() => import('@/pages/patient/Appointments'));
const PatientPrescriptions = lazy(() => import('@/pages/patient/Prescriptions'));
const PatientHealthRecords = lazy(() => import('@/pages/patient/HealthRecords'));
const PatientFamily = lazy(() => import('@/pages/patient/Family'));

// SA extras
const SATemplates = lazy(() => import('@/pages/superadmin/Templates'));
const SADataImport = lazy(() => import('@/pages/superadmin/DataImport'));

// Stores
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/utils/constants';

// Loading fallback
const PageLoader: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: 2,
    }}
  >
    <CircularProgress sx={{ color: '#5519E6' }} />
  </Box>
);

// 404 Page
const NotFoundPage: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: 2,
    }}
  >
    <Box sx={{ fontSize: '4rem', fontWeight: 700, color: '#5519E6' }}>404</Box>
    <Box sx={{ fontSize: '1.5rem', fontWeight: 600 }}>Page Not Found</Box>
    <Box sx={{ color: '#6B7280' }}>The page you're looking for doesn't exist.</Box>
  </Box>
);

const App: React.FC = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <DevRoleSwitcher />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/verify-otp" element={<OtpVerifyPage />} />

          {/* ═══ Super Admin Routes ═══ */}
          <Route
            path="/superadmin/*"
            element={
              <ProtectedRoute requiredRole={ROLES.SUPERADMIN}>
                <Routes>
                  <Route index element={<SADashboard />} />
                  <Route path="cty-config" element={<SACtyConfig />} />
                  <Route path="feature-flags" element={<SAFeatureFlags />} />
                  <Route path="field-manager" element={<SAFieldManager />} />
                  <Route path="compliance" element={<SACompliance />} />
                  <Route path="id-management" element={<SAIDManagement />} />
                  <Route path="roster" element={<SAGlobalRoster />} />
                  <Route path="clinics" element={<SAClinics />} />
                  <Route path="equidor" element={<SAEquidor />} />
                  <Route path="countries" element={<SACountries />} />
                  <Route path="users" element={<SAUserManagement />} />
                  <Route path="audit" element={<SAAuditLog />} />
                  <Route path="templates" element={<SATemplates />} />
                  <Route path="data-import" element={<SADataImport />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* ═══ Clinic Admin Routes ═══ */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole={ROLES.CLINIC_ADMIN}>
                <Routes>
                  <Route index element={<CADashboard />} />
                  <Route path="config" element={<CAConfig />} />
                  <Route path="custom-fields" element={<CACustomFields />} />
                  <Route path="billing" element={<CABillingSetup />} />
                  <Route path="id-config" element={<CAIDConfig />} />
                  <Route path="schedule" element={<CAScheduleConfig />} />
                  <Route path="roster" element={<CARoster />} />
                  <Route path="compliance" element={<CAComplianceStatus />} />
                  <Route path="templates" element={<CATemplates />} />
                  <Route path="data-import" element={<CADataImport />} />
                  <Route path="users" element={<CAUserManagement />} />
                  <Route path="reports" element={<CAReports />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* ═══ Doctor Routes ═══ */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute requiredRole={ROLES.DOCTOR}>
                <Routes>
                  <Route index element={<DRDashboard />} />
                  <Route path="appointments" element={<DRAppointments />} />
                  <Route path="patients" element={<DRPatients />} />
                  <Route path="encounter" element={<DREncounter />} />
                  <Route path="prescriptions" element={<DRPrescriptions />} />
                  <Route path="device-reports" element={<DRDeviceReports />} />
                  <Route path="family" element={<DRFamily />} />
                  <Route path="billing" element={<DRBilling />} />
                  <Route path="whatsapp" element={<DRWhatsApp />} />
                  <Route path="marketing" element={<DRMarketing />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* ═══ Patient Routes ═══ */}
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute requiredRole={ROLES.PATIENT}>
                <Routes>
                  <Route index element={<PatientDashboard />} />
                  <Route path="appointments" element={<PatientAppointments />} />
                  <Route path="prescriptions" element={<PatientPrescriptions />} />
                  <Route path="health" element={<PatientHealthRecords />} />
                  <Route path="family" element={<PatientFamily />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
