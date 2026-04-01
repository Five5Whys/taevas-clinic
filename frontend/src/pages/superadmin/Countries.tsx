import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCountries, useUpdateCountry } from '@/hooks/superadmin/useCountries';
import type {
  TenantFullConfig,
  TenantLoginConfig,
  TenantDraft,
  TenantStatusType,
} from '@/types/superadmin';

// ─── Design Constants ──────────────────────────────────────────────────────────
const BRAND = '#5519E6';
const BRAND2 = '#A046F0';
const GREEN = '#6B7A00';
const RED = '#F43F5E';
const BORDER = '#E5E7EB';
const BG = '#F4F5F9';
const SUB = '#6B7280';
const CAP = '#9CA3AF';
const DARK = '#0F0F14';
const MONO = "'JetBrains Mono', monospace";

const STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  ACTIVE: { color: GREEN, bg: '#CDDC5020', border: '#CDDC5045' },
  INACTIVE: { color: '#9F1239', bg: '#F43F5E12', border: '#F43F5E30' },
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const INITIAL_TENANTS: TenantFullConfig[] = [
  {
    id: 'india', tenantId: 'TN-000', code: 'IN', name: 'India', flagEmoji: '\u{1F1EE}\u{1F1F3}', status: 'ACTIVE',
    currencyCode: 'INR', currencySymbol: '\u20B9', dialCode: '+91',
    loginConfig: { emailEnabled: false, phoneEnabled: true, nationalIdEnabled: false, phoneOtp: { length: 6, expiryMin: 5, retries: 3, smsMessage: '{{otp}} is your code' }, nationalId: { systemName: 'ABHA', format: '##-####-####-####' } },
    locale: { timezone: 'Asia/Kolkata', primaryLanguage: 'English', secondaryLanguage: 'Hindi' },
    compliance: { modules: ['FHIR R4', 'ABDM / ABHA', 'NMC', 'E2E Encryption', 'ICD-10', 'Audit Logs'], regulatoryBody: 'NMC + ABDM', dataResidency: 'ap-south-1 (Mumbai)' },
    clinical: { countryPrefix: 'IN', userIdFormat: 'IN-UR-#####', clinicIdFormat: 'IN-CL-###', billingModel: 'Per Clinic / Month', taxType: 'GST', taxRate: 18 },
    stats: { clinics: 8, doctors: 31, patients: 1247, uniqueLogins: 892, uptime: '96.2%' },
    dateFormat: 'DD/MM/YYYY', primaryLanguage: 'English', secondaryLanguage: 'Hindi', regulatoryBodies: ['NMC', 'ABDM'], taxType: 'GST', taxRate: 18, clinicCount: 8, doctorCount: 31,
  },
  {
    id: 'thailand', tenantId: 'TN-001', code: 'TH', name: 'Thailand', flagEmoji: '\u{1F1F9}\u{1F1ED}', status: 'ACTIVE',
    currencyCode: 'THB', currencySymbol: '\u0E3F', dialCode: '+66',
    loginConfig: { emailEnabled: false, phoneEnabled: true, nationalIdEnabled: false, phoneOtp: { length: 6, expiryMin: 5, retries: 3, smsMessage: '{{otp}} code' }, nationalId: { systemName: 'NHSO', format: '#-####-#####-##-#' } },
    locale: { timezone: 'Asia/Bangkok', primaryLanguage: 'Thai', secondaryLanguage: 'English' },
    compliance: { modules: ['FHIR R4', 'NHSO', 'PDPA', 'ICD-10', 'Audit Logs'], regulatoryBody: 'MOPH', dataResidency: 'ap-southeast-1' },
    clinical: { countryPrefix: 'TH', userIdFormat: 'TH-UR-#####', clinicIdFormat: 'TH-CL-###', billingModel: 'Per Clinic / Month', taxType: 'VAT', taxRate: 7 },
    stats: { clinics: 3, doctors: 11, patients: 402, uniqueLogins: 284, uptime: '99.1%' },
    dateFormat: 'DD/MM/YYYY', primaryLanguage: 'Thai', secondaryLanguage: 'English', regulatoryBodies: ['MOPH', 'NHSO'], taxType: 'VAT', taxRate: 7, clinicCount: 3, doctorCount: 11,
  },
  {
    id: 'maldives', tenantId: 'TN-002', code: 'MV', name: 'Maldives', flagEmoji: '\u{1F1F2}\u{1F1FB}', status: 'INACTIVE',
    currencyCode: 'MVR', currencySymbol: 'Rf', dialCode: '+960',
    loginConfig: { emailEnabled: false, phoneEnabled: true, nationalIdEnabled: false, phoneOtp: { length: 6, expiryMin: 5, retries: 3, smsMessage: '{{otp}} code' } },
    locale: { timezone: 'Indian/Maldives', primaryLanguage: 'Dhivehi', secondaryLanguage: 'English' },
    compliance: { modules: ['FHIR R4', 'MOH', 'E2E Encryption', 'Audit Logs'], regulatoryBody: 'MOH', dataResidency: 'ap-south-1' },
    clinical: { countryPrefix: 'MV', userIdFormat: 'MV-UR-#####', clinicIdFormat: 'MV-CL-###', billingModel: 'Per Clinic / Month', taxType: 'GST', taxRate: 8 },
    stats: { clinics: 1, doctors: 5, patients: 87, uniqueLogins: 42, uptime: '98.5%' },
    dateFormat: 'DD/MM/YYYY', primaryLanguage: 'Dhivehi', secondaryLanguage: 'English', regulatoryBodies: ['MOH'], taxType: 'GST', taxRate: 8, clinicCount: 1, doctorCount: 5,
  },
  {
    id: 'singapore', tenantId: 'TN-003', code: 'SG', name: 'Singapore', flagEmoji: '\u{1F1F8}\u{1F1EC}', status: 'INACTIVE' as TenantStatusType,
    currencyCode: 'SGD', currencySymbol: 'S$', dialCode: '+65',
    loginConfig: { emailEnabled: true, phoneEnabled: false, nationalIdEnabled: false, emailOtp: { length: 6, expiryMin: 15, retries: 5, subject: 'Your {{clinic_name}} code: {{otp}}', body: 'Hi {{user_name}}, your code is {{otp}}' } },
    locale: { timezone: 'Asia/Singapore', primaryLanguage: 'English', secondaryLanguage: '' },
    compliance: { modules: ['FHIR R4', 'E2E Encryption', 'PDPA', 'ICD-10', 'Audit Logs'], regulatoryBody: 'MOH SG', dataResidency: 'ap-southeast-1' },
    clinical: { countryPrefix: 'SG', userIdFormat: 'SG-UR-#####', clinicIdFormat: 'SG-CL-###', billingModel: 'Per Clinic / Month', taxType: 'GST', taxRate: 9 },
    stats: { clinics: 0, doctors: 0, patients: 0, uniqueLogins: 0, uptime: '\u2014' },
    dateFormat: 'DD/MM/YYYY', primaryLanguage: 'English', secondaryLanguage: '', regulatoryBodies: ['MOH SG'], taxType: 'GST', taxRate: 9, clinicCount: 0, doctorCount: 0,
  },
];

const DEFAULT_WIZARD: TenantDraft = {
  loginConfig: { emailEnabled: false, phoneEnabled: false, nationalIdEnabled: false },
  identity: { countryName: '', isoCode: '', flagEmoji: '', dialCode: '', adminName: '', adminEmail: '' },
  setup: { timezone: '', currency: '', language: '', complianceModules: [], countryPrefix: '', userIdFormat: '', clinicIdFormat: '', billingModel: 'Per Clinic / Month' },
};

const COMPLIANCE_OPTIONS = ['FHIR R4', 'E2E Encryption', 'ICD-10', 'Audit Logs', 'ABDM / ABHA', 'NHSO', 'PDPA', 'NMC', 'MOH', 'HIPAA', 'GDPR'];
const LANGUAGES = ['English', 'Hindi', 'Thai', 'Dhivehi', 'Tamil', 'Telugu', 'Marathi', 'Mandarin', 'Malay'];
const TIMEZONES = ['Asia/Kolkata', 'Asia/Bangkok', 'Indian/Maldives', 'Asia/Singapore', 'UTC', 'Asia/Tokyo', 'Asia/Manila'];
const CURRENCIES = ['INR', 'THB', 'MVR', 'SGD', 'USD', 'AED', 'PHP', 'JPY'];

// ─── Helper: Section Card ──────────────────────────────────────────────────────
const SectionCard: React.FC<{ title: string; children: React.ReactNode; disabled?: boolean }> = ({ title, children, disabled }) => (
  <Box sx={{ background: '#fff', borderRadius: '10px', border: `1.5px solid ${BORDER}`, mb: 1.25, overflow: 'hidden', opacity: disabled ? 0.55 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
    <Box sx={{ px: 2, py: 1.25, borderBottom: `1px solid #F3F4F6` }}>
      <Typography sx={{ fontWeight: 800, fontSize: '13px', color: DARK }}>{title}</Typography>
    </Box>
    <Box sx={{ px: 2, py: 1.5 }}>{children}</Box>
  </Box>
);

const FieldGrid: React.FC<{ children: React.ReactNode; cols?: number }> = ({ children, cols = 3 }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 1.25 }}>{children}</Box>
);

const FieldLabel: React.FC<{ label: string }> = ({ label }) => (
  <Typography sx={{ fontSize: '10px', fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 0.5 }}>{label}</Typography>
);

// Helper: map API country to TenantFullConfig
const apiToTenant = (c: any): TenantFullConfig => {
  const cfg = c.config ? (typeof c.config === 'string' ? JSON.parse(c.config) : c.config) : {};
  return {
    id: c.id, tenantId: c.code ? `TN-${c.code}` : c.id, code: c.code, name: c.name,
    flagEmoji: c.flagEmoji || '', status: c.status as any, currencyCode: c.currencyCode || '',
    currencySymbol: c.currencySymbol || '', dialCode: c.dialCode || '',
    loginConfig: cfg.loginConfig || { emailEnabled: false, phoneEnabled: true, nationalIdEnabled: false, phoneOtp: { length: 6, expiryMin: 5, retries: 3, smsMessage: '{{otp}} is your code' } },
    locale: cfg.locale || { timezone: '', primaryLanguage: c.primaryLanguage || '', secondaryLanguage: c.secondaryLanguage || '' },
    compliance: cfg.compliance || { modules: [], regulatoryBody: c.regulatoryBody || '', dataResidency: '' },
    clinical: cfg.clinical || { countryPrefix: c.code || '', userIdFormat: `${c.code}-UR-#####`, clinicIdFormat: `${c.code}-CL-###`, billingModel: 'Per Clinic / Month', taxType: c.taxType || '', taxRate: c.taxRate || 0 },
    stats: { clinics: c.clinicCount || 0, doctors: c.doctorCount || 0, patients: 0, uniqueLogins: 0, uptime: '—' },
    dateFormat: c.dateFormat || 'DD/MM/YYYY', primaryLanguage: c.primaryLanguage || '', secondaryLanguage: c.secondaryLanguage || '',
    regulatoryBodies: c.regulatoryBody ? [c.regulatoryBody] : [], taxType: c.taxType || '', taxRate: c.taxRate || 0,
    clinicCount: c.clinicCount || 0, doctorCount: c.doctorCount || 0,
  };
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Countries: React.FC = () => {
  const { data: apiCountries } = useCountries();
  const [tenants, setTenants] = useState<TenantFullConfig[]>(INITIAL_TENANTS);
  const [selectedId, setSelectedId] = useState(INITIAL_TENANTS[0]?.id || '');
  const [search, setSearch] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<TenantDraft>(JSON.parse(JSON.stringify(DEFAULT_WIZARD)));
  const [configForm, setConfigForm] = useState<TenantFullConfig | null>(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [emailApiOpen, setEmailApiOpen] = useState(false);
  const [smsApiOpen, setSmsApiOpen] = useState(false);
  const [wizEmailApiOpen, setWizEmailApiOpen] = useState(false);
  const [wizSmsApiOpen, setWizSmsApiOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; tenantId: string }>({ open: false, tenantId: '' });
  const updateCountry = useUpdateCountry();

  // Load from API when data arrives
  useEffect(() => {
    if (apiCountries && Array.isArray(apiCountries) && apiCountries.length > 0) {
      const mapped = apiCountries.map(apiToTenant);
      setTenants(mapped);
      if (!selectedId || !mapped.find(t => t.id === selectedId)) {
        setSelectedId(mapped[0].id);
      }
    }
  }, [apiCountries]);

  // Sync configForm when selectedId changes
  useEffect(() => {
    const t = tenants.find(x => x.id === selectedId);
    if (t) setConfigForm(JSON.parse(JSON.stringify(t)));
  }, [selectedId, tenants]);

  // Derived
  const selected = tenants.find(t => t.id === selectedId);
  const filtered = tenants.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const activeCount = tenants.filter(t => t.status === 'ACTIVE').length;
  const inactiveCount = tenants.filter(t => t.status === 'INACTIVE').length;

  const handleToggle = (tenantId: string) => {
    const t = tenants.find(x => x.id === tenantId);
    if (!t) return;
    if (t.status === 'ACTIVE') {
      setConfirmDialog({ open: true, tenantId });
      return;
    }
    // Any non-ACTIVE status (INACTIVE, PILOT, ONBOARDING) → activate
    const updated = { ...t, status: 'ACTIVE' as TenantStatusType };
    setTenants(prev => prev.map(x => x.id === tenantId ? updated : x));
    updateCountry.mutate({ id: tenantId, data: { status: 'ACTIVE', code: t.code, name: t.name } as any }, {
      onSuccess: () => setAlertMsg(`${t.name} activated.`),
      onError: () => setAlertMsg(`Activation failed — please try again.`),
    });
  };

  const confirmDeactivate = () => {
    const tid = confirmDialog.tenantId;
    const t = tenants.find(x => x.id === tid);
    setTenants(prev => prev.map(x => x.id === tid ? { ...x, status: 'INACTIVE' } : x));
    setConfirmDialog({ open: false, tenantId: '' });
    updateCountry.mutate({ id: tid, data: { status: 'INACTIVE', code: t?.code, name: t?.name } as any }, {
      onSuccess: () => setAlertMsg('Tenant deactivated.'),
      onError: () => setAlertMsg('Deactivation failed — please try again.'),
    });
  };

  const handleSaveConfig = () => {
    if (!configForm) return;
    setTenants(prev => prev.map(t => t.id === configForm.id ? { ...configForm } : t));
    const payload = {
      code: configForm.code, name: configForm.name, flagEmoji: configForm.flagEmoji,
      status: configForm.status, currencyCode: configForm.currencyCode, currencySymbol: configForm.currencySymbol,
      taxType: configForm.taxType || configForm.clinical?.taxType, taxRate: configForm.taxRate || configForm.clinical?.taxRate,
      dateFormat: configForm.dateFormat, primaryLanguage: configForm.primaryLanguage || configForm.locale?.primaryLanguage,
      secondaryLanguage: configForm.secondaryLanguage || configForm.locale?.secondaryLanguage,
      regulatoryBody: configForm.compliance?.regulatoryBody, dialCode: configForm.dialCode,
      config: JSON.stringify({ loginConfig: configForm.loginConfig, locale: configForm.locale, compliance: configForm.compliance, clinical: configForm.clinical }),
    };
    updateCountry.mutate({ id: configForm.id, data: payload as any }, {
      onSuccess: () => setAlertMsg('Configuration saved.'),
      onError: () => setAlertMsg('Save failed — please try again.'),
    });
  };

  const handleResetConfig = () => {
    const t = tenants.find(x => x.id === selectedId);
    if (t) setConfigForm(JSON.parse(JSON.stringify(t)));
  };

  const handleWizardSubmit = () => {
    const d = wizardData;
    const newId = d.identity.countryName.toLowerCase().replace(/\s+/g, '-');
    const tnNum = tenants.length.toString().padStart(3, '0');
    const newTenant: TenantFullConfig = {
      id: newId,
      tenantId: `TN-${tnNum}`,
      code: d.identity.isoCode,
      name: d.identity.countryName,
      flagEmoji: d.identity.flagEmoji,
      status: 'INACTIVE',
      currencyCode: d.setup.currency,
      currencySymbol: '',
      dialCode: d.identity.dialCode,
      loginConfig: { ...d.loginConfig },
      locale: { timezone: d.setup.timezone, primaryLanguage: d.setup.language, secondaryLanguage: '' },
      compliance: { modules: [...d.setup.complianceModules], regulatoryBody: '', dataResidency: '' },
      clinical: { countryPrefix: d.setup.countryPrefix, userIdFormat: d.setup.userIdFormat, clinicIdFormat: d.setup.clinicIdFormat, billingModel: d.setup.billingModel, taxType: '', taxRate: 0 },
      stats: { clinics: 0, doctors: 0, patients: 0, uniqueLogins: 0, uptime: '\u2014' },
      dateFormat: 'DD/MM/YYYY',
      primaryLanguage: d.setup.language,
      secondaryLanguage: '',
      regulatoryBodies: [],
      taxType: '',
      taxRate: 0,
      clinicCount: 0,
      doctorCount: 0,
    };
    setTenants(prev => [...prev, newTenant]);
    setSelectedId(newId);
    setShowWizard(false);
    setWizardStep(1);
    setWizardData(JSON.parse(JSON.stringify(DEFAULT_WIZARD)));
    setAlertMsg(`${d.identity.countryName} added as INACTIVE.`);
  };

  const wizardValid = (step: number): boolean => {
    const d = wizardData;
    if (step === 1) return d.loginConfig.emailEnabled || d.loginConfig.phoneEnabled || d.loginConfig.nationalIdEnabled;
    if (step === 2) return d.identity.countryName.trim() !== '' && d.identity.isoCode.trim() !== '';
    return true;
  };

  const statusChip = (status: string) => {
    const s = STATUS_COLORS[status] ?? STATUS_COLORS['ACTIVE'];
    const label = status;
    const bg = s!.bg;
    const clr = s!.color;
    const bdr = s!.border;
    return (
      <Chip label={label} size="small" sx={{ background: bg, color: clr, border: `1px solid ${bdr}`, fontWeight: 700, fontSize: '9px', height: 20, '& .MuiChip-label': { px: 0.75 } }} />
    );
  };

  // ─── Render: Sidebar ─────────────────────────────────────────────────────────
  const renderSidebar = () => (
    <Box sx={{ width: 220, flexShrink: 0, background: '#fff', borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ px: 1.25, pt: 1.25, pb: 1, borderBottom: `1px solid ${BORDER}` }}>
        <Box sx={{ mb: 0.75 }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.08em' }}>TENANTS</Typography>
        </Box>
        <TextField
          fullWidth size="small" placeholder="Search tenants..."
          value={search} onChange={e => setSearch(e.target.value)}
          sx={{ '& .MuiInputBase-input': { fontSize: '11px', py: '4px' }, '& .MuiOutlinedInput-root': { borderRadius: '6px' }, mb: 0.75 }}
        />
        <Button
          fullWidth variant="contained"
          onClick={() => { setShowWizard(true); setWizardStep(1); setWizardData(JSON.parse(JSON.stringify(DEFAULT_WIZARD))); }}
          sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, fontSize: '11px', borderRadius: '6px', textTransform: 'none', py: 0.5 }}
        >
          + Add New Tenant
        </Button>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map(t => (
          <Box
            key={t.id}
            onClick={() => { setSelectedId(t.id); setShowWizard(false); }}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.875,
              cursor: 'pointer', borderBottom: `1px solid ${BORDER}`, borderLeft: '3px solid transparent',
              transition: 'all 0.15s', position: 'relative',
              ...(selectedId === t.id && !showWizard && { background: `${BRAND}08`, borderLeftColor: BRAND }),
              '&:hover': { background: selectedId === t.id && !showWizard ? `${BRAND}08` : '#F8F9FC' },
            }}
          >
            <Box sx={{ width: 30, height: 30, borderRadius: '8px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              {t.flagEmoji}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '12px', lineHeight: 1.3 }}>{t.name}</Typography>
              <Typography sx={{ fontSize: '9px', color: CAP, fontFamily: MONO }}>{t.tenantId} &middot; {t.clinicCount} clinics</Typography>
              <Box sx={{ mt: 0.15 }}>{statusChip(t.status)}</Box>
            </Box>
            <Box sx={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)' }} onClick={e => e.stopPropagation()}>
              <Switch
                checked={t.status === 'ACTIVE'}
                onChange={() => handleToggle(t.id)}
                size="small"
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: BRAND } }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  // ─── Render: Stats Row ───────────────────────────────────────────────────────
  const renderStats = (s: TenantFullConfig['stats']) => {
    const items = [
      { label: 'Clinics', value: s.clinics },
      { label: 'Doctors', value: s.doctors },
      { label: 'Patients', value: s.patients },
      { label: 'Unique Logins', value: s.uniqueLogins },
      { label: 'Uptime', value: s.uptime },
    ];
    return (
      <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
        {items.map(i => (
          <Box key={i.label} sx={{ flex: 1, background: '#F8F9FC', border: `1px solid ${BORDER}`, borderRadius: '8px', p: 1, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 800, color: BRAND, fontFamily: MONO }}>{i.value}</Typography>
            <Typography sx={{ fontSize: '9px', color: SUB, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', mt: 0.15 }}>{i.label}</Typography>
          </Box>
        ))}
      </Box>
    );
  };

  // ─── Render: Active/Pilot Config ─────────────────────────────────────────────
  const renderActiveConfig = () => {
    if (!selected || !configForm) return null;
    const lc = configForm.loginConfig;
    const updateLogin = (field: keyof TenantLoginConfig, value: boolean) => {
      setConfigForm(prev => prev ? { ...prev, loginConfig: { ...prev.loginConfig, [field]: value } } : prev);
    };
    const updateField = (path: string, value: string | number) => {
      setConfigForm(prev => {
        if (!prev) return prev;
        const clone = JSON.parse(JSON.stringify(prev)) as TenantFullConfig;
        const parts = path.split('.');
        let obj: Record<string, unknown> = clone as unknown as Record<string, unknown>;
        for (let i = 0; i < parts.length - 1; i++) {
          const key = parts[i]!;
          obj = obj[key] as Record<string, unknown>;
        }
        const lastKey = parts[parts.length - 1]!;
        obj[lastKey] = value;
        return clone;
      });
    };

    return (
      <>
        {/* Header + Save */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '11px', fontFamily: MONO, color: CAP }}>{selected.code}</Typography>
            <Typography sx={{ fontSize: '11px', fontFamily: MONO, color: CAP }}>{selected.tenantId}</Typography>
            {statusChip(selected.status)}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" onClick={handleResetConfig} sx={{ borderColor: BORDER, color: SUB, fontWeight: 600, textTransform: 'none', fontSize: '12px' }}>Reset</Button>
            <Button variant="contained" size="small" onClick={handleSaveConfig} disabled={updateCountry.isPending} sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none', fontSize: '12px' }}>{updateCountry.isPending ? 'Saving...' : 'Save Changes'}</Button>
          </Box>
        </Box>

        {renderStats(selected.stats)}

        {/* Login & Auth */}
        <SectionCard title="Login & Authentication">
          {/* Login method toggles — 50:50 side by side */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 0.875 }}>
            {/* Email + Password toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '9px 11px', borderRadius: '10px', border: `1.5px solid ${lc.emailEnabled ? '#CDDC5050' : BORDER}`, background: lc.emailEnabled ? '#F9FFDC' : '#F8F9FA' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875 }}>
                <Box sx={{ width: 24, height: 24, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', background: '#6366F115' }}>{'\u2709\uFE0F'}</Box>
                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>Email + Password</Typography>
                  <Typography sx={{ fontSize: '10px', color: SUB }}>{lc.emailEnabled ? 'OTP verification' : 'Not enabled'}</Typography>
                </Box>
              </Box>
              <Switch checked={lc.emailEnabled} onChange={e => updateLogin('emailEnabled', e.target.checked)} size="small" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: BRAND } }} />
            </Box>
            {/* Phone OTP toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '9px 11px', borderRadius: '10px', border: `1.5px solid ${lc.phoneEnabled ? '#CDDC5050' : BORDER}`, background: lc.phoneEnabled ? '#F9FFDC' : '#F8F9FA' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875 }}>
                <Box sx={{ width: 24, height: 24, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', background: '#5519E615' }}>{'\uD83D\uDCF1'}</Box>
                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>Phone OTP (SMS)</Typography>
                  <Typography sx={{ fontSize: '10px', color: SUB }}>{lc.phoneEnabled ? `${configForm?.dialCode} \u00B7 SMS` : 'Not enabled'}</Typography>
                </Box>
              </Box>
              <Switch checked={lc.phoneEnabled} onChange={e => updateLogin('phoneEnabled', e.target.checked)} size="small" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: BRAND } }} />
            </Box>
          </Box>
          {/* Email OTP Settings (when enabled) */}
          {lc.emailEnabled && (
            <Box sx={{ background: '#FAFBFF', border: `1.5px solid ${BRAND}15`, borderRadius: '10px', p: 2, mb: 1 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: BRAND, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>{'\u2709\uFE0F'} EMAIL OTP SETTINGS</Typography>
              <FieldGrid>
                <Box><FieldLabel label="OTP Length *" /><FormControl fullWidth size="small"><Select defaultValue="6" sx={{ fontSize: '13px' }}><MenuItem value="4">4 digits</MenuItem><MenuItem value="6">6 digits (recommended)</MenuItem><MenuItem value="8">8 digits</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Digits in the email verification code</Typography></Box>
                <Box><FieldLabel label="OTP Expiry *" /><FormControl fullWidth size="small"><Select defaultValue="15" sx={{ fontSize: '13px' }}><MenuItem value="5">5 minutes</MenuItem><MenuItem value="10">10 minutes</MenuItem><MenuItem value="15">15 minutes (recommended)</MenuItem><MenuItem value="30">30 minutes</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Email OTPs expire slower than SMS</Typography></Box>
                <Box><FieldLabel label="Max Retries *" /><FormControl fullWidth size="small"><Select defaultValue="5" sx={{ fontSize: '13px' }}><MenuItem value="3">3 attempts</MenuItem><MenuItem value="5">5 attempts (recommended)</MenuItem><MenuItem value="10">10 attempts</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Failed attempts before lockout</Typography></Box>
              </FieldGrid>
              <Box sx={{ mt: 2 }}>
                <FieldLabel label="Email OTP Subject Line *" />
                <TextField fullWidth size="small" defaultValue="Your {{clinic_name}} verification code: {{otp}}" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} />
                <Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>{'Placeholders: {{otp}}  {{user_name}}  {{clinic_name}}  {{expiry_mins}}'}</Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <FieldLabel label="Email OTP Body Text *" />
                <TextField fullWidth size="small" multiline rows={3} defaultValue={'Hi {{user_name}},\nYour {{clinic_name}} login code is: {{otp}}\nThis code is valid for {{expiry_mins}} minutes. Do not share it with anyone.'} sx={{ '& .MuiInputBase-input': { fontSize: '12px', lineHeight: 1.6 } }} />
                <Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Plain text body. HTML template can be configured in Email Settings after activation.</Typography>
              </Box>
              {/* Email Provider (optional expandable) */}
              <Box sx={{ mt: 2, border: `1.5px solid ${emailApiOpen ? BRAND + '40' : BRAND + '20'}`, borderRadius: '10px', overflow: 'hidden', transition: 'all 0.2s' }}>
                <Box onClick={() => setEmailApiOpen(!emailApiOpen)} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, cursor: 'pointer', background: emailApiOpen ? '#F8F9FF' : 'transparent', '&:hover': { background: '#F8F9FF' } }}>
                  <Typography sx={{ fontSize: '11px' }}>{'\u2699\uFE0F'}</Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: BRAND, flex: 1 }}>Email Provider & Domain API Config</Typography>
                  <Typography sx={{ fontSize: '11px', color: CAP }}>(optional — configure sending domain, API keys)</Typography>
                  <Typography sx={{ fontSize: '10px', color: BRAND, transform: emailApiOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>{'\u25B6'}</Typography>
                </Box>
                {emailApiOpen && (
                  <Box sx={{ px: 2.5, pb: 2.5, pt: 1.5, borderTop: `1px solid ${BRAND}15` }}>
                    <FieldGrid cols={2}>
                      <Box><FieldLabel label="Email Provider" /><FormControl fullWidth size="small"><Select defaultValue="auto" sx={{ fontSize: '13px' }}><MenuItem value="auto">Auto (platform default)</MenuItem><MenuItem value="sendgrid">SendGrid</MenuItem><MenuItem value="ses">AWS SES</MenuItem><MenuItem value="smtp">Custom SMTP</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Transactional email delivery service</Typography></Box>
                      <Box><FieldLabel label="Sending Domain" /><TextField fullWidth size="small" placeholder="e.g. mail.taevasclinic.sg" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Domain used in From address (must be SPF/DKIM verified)</Typography></Box>
                    </FieldGrid>
                    <Box sx={{ mt: 1.75 }}><FieldGrid cols={2}>
                      <Box><FieldLabel label="API Key / Client ID" /><TextField fullWidth size="small" type="password" defaultValue="sk-••••••••••••••••••••" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Provider API key or client ID</Typography></Box>
                      <Box><FieldLabel label="API Secret / Token" /><TextField fullWidth size="small" type="password" defaultValue="••••••••••••••••••••" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>API secret or auth token</Typography></Box>
                    </FieldGrid></Box>
                    <Box sx={{ mt: 1.75 }}><FieldGrid>
                      <Box><FieldLabel label="From Email Address" /><TextField fullWidth size="small" placeholder="noreply@taevasclinic.sg" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Sender email shown to user</Typography></Box>
                      <Box><FieldLabel label="From Name (Display)" /><TextField fullWidth size="small" placeholder="TaevasClinic" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Sender name shown in inbox</Typography></Box>
                      <Box><FieldLabel label="Reply-To" /><TextField fullWidth size="small" placeholder="support@taevasclinic.sg" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Optional reply-to address</Typography></Box>
                    </FieldGrid></Box>
                    <Box sx={{ mt: 1.75 }}><FieldGrid cols={2}>
                      <Box><FieldLabel label="SMTP Host (if SMTP)" /><TextField fullWidth size="small" placeholder="smtp.taevasclinic.sg" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
                      <Box><FieldLabel label="SMTP Port (if SMTP)" /><FormControl fullWidth size="small"><Select defaultValue="587" sx={{ fontSize: '13px' }}><MenuItem value="587">587 (TLS)</MenuItem><MenuItem value="465">465 (SSL)</MenuItem><MenuItem value="25">25 (Unencrypted)</MenuItem></Select></FormControl></Box>
                    </FieldGrid></Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Phone OTP Settings (when enabled) */}
          {lc.phoneEnabled && (
            <Box sx={{ background: '#FAFBFF', border: `1.5px solid ${BRAND}15`, borderRadius: '10px', p: 2, mb: 1 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: BRAND, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>{'\uD83D\uDCF1'} PHONE OTP SETTINGS</Typography>
              <FieldGrid>
                <Box><FieldLabel label="OTP Length *" /><FormControl fullWidth size="small"><Select defaultValue="6" sx={{ fontSize: '13px' }}><MenuItem value="4">4 digits</MenuItem><MenuItem value="6">6 digits (recommended)</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>How many digits in the OTP code</Typography></Box>
                <Box><FieldLabel label="OTP Expiry *" /><FormControl fullWidth size="small"><Select defaultValue="5" sx={{ fontSize: '13px' }}><MenuItem value="3">3 minutes</MenuItem><MenuItem value="5">5 minutes (recommended)</MenuItem><MenuItem value="10">10 minutes</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Time before OTP expires</Typography></Box>
                <Box><FieldLabel label="Max Retries *" /><FormControl fullWidth size="small"><Select defaultValue="3" sx={{ fontSize: '13px' }}><MenuItem value="2">2 attempts</MenuItem><MenuItem value="3">3 attempts (recommended)</MenuItem><MenuItem value="5">5 attempts</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Failed attempts before lockout</Typography></Box>
              </FieldGrid>
              <Box sx={{ mt: 2 }}>
                <FieldGrid cols={2}>
                  <Box><FieldLabel label="SMS Provider (optional)" /><FormControl fullWidth size="small"><Select defaultValue="auto" sx={{ fontSize: '13px' }}><MenuItem value="auto">Auto (platform default)</MenuItem><MenuItem value="twilio">Twilio</MenuItem><MenuItem value="msg91">MSG91</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>OTP delivery provider for this country</Typography></Box>
                  <Box><FieldLabel label="Sender ID / From (optional)" /><TextField fullWidth size="small" placeholder="e.g. TAEVAS" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Alphanumeric sender ID (max 11 chars)</Typography></Box>
                </FieldGrid>
              </Box>
              <Box sx={{ mt: 2 }}>
                <FieldLabel label="SMS OTP Message Text *" />
                <TextField fullWidth size="small" defaultValue={'{{otp}} is your {{clinic_name}} login code. Valid for {{expiry_mins}} mins. Do not share.'} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} />
                <Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>{'Keep under 160 chars for single SMS. Placeholders: {{otp}}  {{user_name}}  {{clinic_name}}  {{expiry_mins}}'}</Typography>
              </Box>
              {/* SMS Provider API (optional expandable) */}
              <Box sx={{ mt: 2, border: `1.5px solid ${smsApiOpen ? BRAND + '40' : BRAND + '20'}`, borderRadius: '10px', overflow: 'hidden', transition: 'all 0.2s' }}>
                <Box onClick={() => setSmsApiOpen(!smsApiOpen)} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, cursor: 'pointer', background: smsApiOpen ? '#F8F9FF' : 'transparent', '&:hover': { background: '#F8F9FF' } }}>
                  <Typography sx={{ fontSize: '11px' }}>{'\u2699\uFE0F'}</Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: BRAND, flex: 1 }}>SMS Provider API Credentials</Typography>
                  <Typography sx={{ fontSize: '11px', color: CAP }}>(optional — uses platform default if not set)</Typography>
                  <Typography sx={{ fontSize: '10px', color: BRAND, transform: smsApiOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>{'\u25B6'}</Typography>
                </Box>
                {smsApiOpen && (
                  <Box sx={{ px: 2.5, pb: 2.5, pt: 1.5, borderTop: `1px solid ${BRAND}15` }}>
                    <FieldGrid cols={2}>
                      <Box><FieldLabel label="Account SID" /><TextField fullWidth size="small" type="password" defaultValue="AC••••••••••••••••••••" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Twilio / MSG91 Account SID</Typography></Box>
                      <Box><FieldLabel label="Auth Token" /><TextField fullWidth size="small" type="password" defaultValue="••••••••••••••••••••" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Provider auth token or API key</Typography></Box>
                    </FieldGrid>
                    <Box sx={{ mt: 1.75 }}><FieldGrid cols={2}>
                      <Box><FieldLabel label="From Number" /><TextField fullWidth size="small" placeholder="+1234567890" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Registered sender phone number</Typography></Box>
                      <Box><FieldLabel label="Webhook URL (optional)" /><TextField fullWidth size="small" placeholder="https://api.taevasclinic.com/webhooks/sms" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Delivery status callback URL</Typography></Box>
                    </FieldGrid></Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </SectionCard>

        {/* Identity */}
        <SectionCard title="Identity">
          <FieldGrid>
            <Box><FieldLabel label="Country Name" /><TextField fullWidth size="small" value={configForm.name} onChange={e => updateField('name', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /></Box>
            <Box><FieldLabel label="ISO Code" /><TextField fullWidth size="small" value={configForm.code} onChange={e => updateField('code', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
            <Box><FieldLabel label="Dial Code" /><TextField fullWidth size="small" value={configForm.dialCode} onChange={e => updateField('dialCode', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
            <Box><FieldLabel label="Currency Code" /><TextField fullWidth size="small" value={configForm.currencyCode} onChange={e => updateField('currencyCode', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
            <Box><FieldLabel label="Currency Symbol" /><TextField fullWidth size="small" value={configForm.currencySymbol} onChange={e => updateField('currencySymbol', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /></Box>
            <Box><FieldLabel label="Date Format" /><TextField fullWidth size="small" value={configForm.dateFormat} onChange={e => updateField('dateFormat', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
          </FieldGrid>
        </SectionCard>

        {/* Locale */}
        <SectionCard title="Locale">
          <FieldGrid>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: '13px' }}>Timezone</InputLabel>
              <Select value={configForm.locale.timezone} label="Timezone" onChange={e => updateField('locale.timezone', e.target.value)} sx={{ fontSize: '13px' }}>
                {TIMEZONES.map(tz => <MenuItem key={tz} value={tz}>{tz}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: '13px' }}>Primary Language</InputLabel>
              <Select value={configForm.locale.primaryLanguage} label="Primary Language" onChange={e => updateField('locale.primaryLanguage', e.target.value)} sx={{ fontSize: '13px' }}>
                {LANGUAGES.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: '13px' }}>Secondary Language</InputLabel>
              <Select value={configForm.locale.secondaryLanguage} label="Secondary Language" onChange={e => updateField('locale.secondaryLanguage', e.target.value)} sx={{ fontSize: '13px' }}>
                <MenuItem value="">None</MenuItem>
                {LANGUAGES.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
            </FormControl>
          </FieldGrid>
        </SectionCard>

        {/* Compliance */}
        <SectionCard title="Compliance">
          <FieldGrid cols={2}>
            <Box><FieldLabel label="Regulatory Body" /><TextField fullWidth size="small" value={configForm.compliance.regulatoryBody} onChange={e => updateField('compliance.regulatoryBody', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /></Box>
            <Box><FieldLabel label="Data Residency" /><TextField fullWidth size="small" value={configForm.compliance.dataResidency} onChange={e => updateField('compliance.dataResidency', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
          </FieldGrid>
          <Box sx={{ mt: 1.5 }}>
            <FieldLabel label="Compliance Modules" />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {configForm.compliance.modules.map(m => (
                <Chip key={m} label={m} size="small" sx={{ background: `${BRAND}10`, color: BRAND, border: `1px solid ${BRAND}25`, fontWeight: 600, fontSize: '10px' }} />
              ))}
            </Box>
          </Box>
        </SectionCard>

        {/* Clinical & Billing */}
        <SectionCard title="Clinical & Billing">
          <FieldGrid>
            <Box><FieldLabel label="Country Prefix" /><TextField fullWidth size="small" value={configForm.clinical.countryPrefix} onChange={e => updateField('clinical.countryPrefix', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
            <Box><FieldLabel label="User ID Format" /><TextField fullWidth size="small" value={configForm.clinical.userIdFormat} onChange={e => updateField('clinical.userIdFormat', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
            <Box><FieldLabel label="Clinic ID Format" /><TextField fullWidth size="small" value={configForm.clinical.clinicIdFormat} onChange={e => updateField('clinical.clinicIdFormat', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
            <Box><FieldLabel label="Tax Type" /><TextField fullWidth size="small" value={configForm.clinical.taxType} onChange={e => updateField('clinical.taxType', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /></Box>
            <Box><FieldLabel label="Tax Rate (%)" /><TextField fullWidth size="small" type="number" value={configForm.clinical.taxRate} onChange={e => updateField('clinical.taxRate', Number(e.target.value))} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
            <Box><FieldLabel label="Billing Model" /><TextField fullWidth size="small" value={configForm.clinical.billingModel} onChange={e => updateField('clinical.billingModel', e.target.value)} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /></Box>
          </FieldGrid>
        </SectionCard>

        {/* Bottom spacer */}
        <Box sx={{ mb: 3 }} />
      </>
    );
  };

  // ─── Render: Wizard ──────────────────────────────────────────────────────────
  const renderWizard = () => {
    const d = wizardData;
    const updateWizard = (updater: (draft: TenantDraft) => void) => {
      setWizardData(prev => {
        const clone = JSON.parse(JSON.stringify(prev)) as TenantDraft;
        updater(clone);
        return clone;
      });
    };
    const stepLabels = ['Login Methods', 'Identity', 'Setup & Compliance', 'Review'];
    const tnPreview = `TN-${tenants.length.toString().padStart(3, '0')}`;

    return (
      <>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 800, color: DARK }}>Add New Tenant</Typography>
          <Button variant="outlined" size="small" onClick={() => setShowWizard(false)} sx={{ borderColor: BORDER, color: SUB, fontWeight: 600, textTransform: 'none' }}>Cancel</Button>
        </Box>

        {/* Stepper */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {stepLabels.map((label, idx) => {
            const step = idx + 1;
            const isDone = wizardStep > step;
            const isActive = wizardStep === step;
            return (
              <React.Fragment key={step}>
                {idx > 0 && <Box sx={{ flex: 1, height: 2, background: isDone ? BRAND : BORDER, mx: 0.625 }} />}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer' }} onClick={() => setWizardStep(step)}>
                  <Box sx={{
                    width: 27, height: 27, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, transition: 'all 0.2s',
                    ...(isDone || isActive ? { background: BRAND, color: '#fff' } : { background: BORDER, color: CAP }),
                    ...(isActive && { boxShadow: `0 0 0 4px ${BRAND}22` }),
                    '&:hover': { opacity: 0.75, transform: 'scale(1.1)' },
                  }}>
                    {step}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700 }}>{label}</Typography>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}
        </Box>

        {/* Step 1: Login Methods */}
        {wizardStep === 1 && (
          <SectionCard title="Login & Authentication">
            <Typography sx={{ fontSize: '12px', color: SUB, mb: 1 }}>Choose login methods. Enable at least one.</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1.125 }}>Login Methods <Box component="span" sx={{ color: BRAND, ml: 0.5 }}>* at least one</Box></Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.875 }}>
              {([
                { key: 'emailEnabled' as const, label: 'Email + Password', desc: 'Standard email login', icon: '\u2709\uFE0F', iconBg: '#6366F115' },
                { key: 'phoneEnabled' as const, label: 'Phone OTP (SMS)', desc: 'SMS-based login', icon: '\uD83D\uDCF1', iconBg: '#5519E615' },
              ]).map(m => (
                <Box key={m.key} sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '11px 13px',
                  borderRadius: '10px', border: `1.5px solid ${d.loginConfig[m.key] ? '#CDDC5050' : BORDER}`,
                  background: d.loginConfig[m.key] ? '#F9FFDC' : '#F8F9FA', transition: 'all 0.15s',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.125 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: m.iconBg }}>{m.icon}</Box>
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{m.label}</Typography>
                      <Typography sx={{ fontSize: '11px', color: SUB }}>{m.desc}</Typography>
                    </Box>
                  </Box>
                  <Switch
                    checked={d.loginConfig[m.key]}
                    onChange={e => updateWizard(dr => { dr.loginConfig[m.key] = e.target.checked; })}
                    size="small"
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: BRAND } }}
                  />
                </Box>
              ))}
            </Box>
            {d.loginConfig.emailEnabled && (
              <Box sx={{ background: '#FAFBFF', border: `1.5px solid ${BRAND}15`, borderRadius: '10px', p: 2.5, mt: 1.5 }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: BRAND, mb: 0.5 }}>{'\u2709\uFE0F'} EMAIL OTP & VERIFICATION SETTINGS</Typography>
                <FieldGrid>
                  <Box><FieldLabel label="OTP Length *" /><FormControl fullWidth size="small"><Select defaultValue="6" sx={{ fontSize: '13px' }}><MenuItem value="4">4 digits</MenuItem><MenuItem value="6">6 digits (recommended)</MenuItem><MenuItem value="8">8 digits</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Digits in the email verification code</Typography></Box>
                  <Box><FieldLabel label="OTP Expiry *" /><FormControl fullWidth size="small"><Select defaultValue="15" sx={{ fontSize: '13px' }}><MenuItem value="5">5 minutes</MenuItem><MenuItem value="10">10 minutes</MenuItem><MenuItem value="15">15 minutes (recommended)</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Email OTPs expire slower than SMS</Typography></Box>
                  <Box><FieldLabel label="Max Retries *" /><FormControl fullWidth size="small"><Select defaultValue="5" sx={{ fontSize: '13px' }}><MenuItem value="3">3 attempts</MenuItem><MenuItem value="5">5 attempts (recommended)</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Failed attempts before lockout</Typography></Box>
                </FieldGrid>
                <Box sx={{ mt: 2 }}><FieldLabel label="Email OTP Subject Line *" /><TextField fullWidth size="small" defaultValue="Your {{clinic_name}} verification code: {{otp}}" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>{'Placeholders: {{otp}}  {{user_name}}  {{clinic_name}}  {{expiry_mins}}'}</Typography></Box>
                <Box sx={{ mt: 2 }}><FieldLabel label="Email OTP Body Text *" /><TextField fullWidth size="small" multiline rows={3} defaultValue={'Hi {{user_name}},\nYour {{clinic_name}} login code is: {{otp}}\nThis code is valid for {{expiry_mins}} minutes. Do not share it with anyone.'} sx={{ '& .MuiInputBase-input': { fontSize: '12px', lineHeight: 1.6 } }} /></Box>
                {/* Email Provider (optional expandable) */}
                <Box sx={{ mt: 2, border: `1.5px solid ${wizEmailApiOpen ? BRAND + '40' : BRAND + '20'}`, borderRadius: '10px', overflow: 'hidden', transition: 'all 0.2s' }}>
                  <Box onClick={() => setWizEmailApiOpen(!wizEmailApiOpen)} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, cursor: 'pointer', background: wizEmailApiOpen ? '#F8F9FF' : 'transparent', '&:hover': { background: '#F8F9FF' } }}>
                    <Typography sx={{ fontSize: '11px' }}>{'\u2699\uFE0F'}</Typography>
                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: BRAND, flex: 1 }}>Email Provider & Domain API Config</Typography>
                    <Typography sx={{ fontSize: '11px', color: CAP }}>(optional)</Typography>
                    <Typography sx={{ fontSize: '10px', color: BRAND, transform: wizEmailApiOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>{'\u25B6'}</Typography>
                  </Box>
                  {wizEmailApiOpen && (
                    <Box sx={{ px: 2.5, pb: 2.5, pt: 1.5, borderTop: `1px solid ${BRAND}15` }}>
                      <FieldGrid cols={2}>
                        <Box><FieldLabel label="Email Provider" /><FormControl fullWidth size="small"><Select defaultValue="auto" sx={{ fontSize: '13px' }}><MenuItem value="auto">Auto (platform default)</MenuItem><MenuItem value="sendgrid">SendGrid</MenuItem><MenuItem value="ses">AWS SES</MenuItem><MenuItem value="smtp">Custom SMTP</MenuItem></Select></FormControl></Box>
                        <Box><FieldLabel label="Sending Domain" /><TextField fullWidth size="small" placeholder="e.g. mail.taevasclinic.sg" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /></Box>
                      </FieldGrid>
                      <Box sx={{ mt: 1.75 }}><FieldGrid cols={2}>
                        <Box><FieldLabel label="API Key / Client ID" /><TextField fullWidth size="small" type="password" placeholder="sk-..." sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
                        <Box><FieldLabel label="API Secret / Token" /><TextField fullWidth size="small" type="password" placeholder="secret..." sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
                      </FieldGrid></Box>
                      <Box sx={{ mt: 1.75 }}><FieldGrid>
                        <Box><FieldLabel label="From Email Address" /><TextField fullWidth size="small" placeholder="noreply@clinic.com" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /></Box>
                        <Box><FieldLabel label="From Name (Display)" /><TextField fullWidth size="small" placeholder="TaevasClinic" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /></Box>
                        <Box><FieldLabel label="Reply-To" /><TextField fullWidth size="small" placeholder="support@clinic.com" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /></Box>
                      </FieldGrid></Box>
                      <Box sx={{ mt: 1.75 }}><FieldGrid cols={2}>
                        <Box><FieldLabel label="SMTP Host (if SMTP)" /><TextField fullWidth size="small" placeholder="smtp.example.com" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
                        <Box><FieldLabel label="SMTP Port (if SMTP)" /><FormControl fullWidth size="small"><Select defaultValue="587" sx={{ fontSize: '13px' }}><MenuItem value="587">587 (TLS)</MenuItem><MenuItem value="465">465 (SSL)</MenuItem><MenuItem value="25">25 (Unencrypted)</MenuItem></Select></FormControl></Box>
                      </FieldGrid></Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            {d.loginConfig.phoneEnabled && (
              <Box sx={{ background: '#FAFBFF', border: `1.5px solid ${BRAND}15`, borderRadius: '10px', p: 2.5, mt: 1.5 }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: BRAND, mb: 0.5 }}>{'\uD83D\uDCF1'} PHONE OTP SETTINGS</Typography>
                <FieldGrid>
                  <Box><FieldLabel label="OTP Length *" /><FormControl fullWidth size="small"><Select defaultValue="6" sx={{ fontSize: '13px' }}><MenuItem value="4">4 digits</MenuItem><MenuItem value="6">6 digits (recommended)</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>How many digits in the OTP code</Typography></Box>
                  <Box><FieldLabel label="OTP Expiry *" /><FormControl fullWidth size="small"><Select defaultValue="5" sx={{ fontSize: '13px' }}><MenuItem value="3">3 minutes</MenuItem><MenuItem value="5">5 minutes (recommended)</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Time before OTP expires</Typography></Box>
                  <Box><FieldLabel label="Max Retries *" /><FormControl fullWidth size="small"><Select defaultValue="3" sx={{ fontSize: '13px' }}><MenuItem value="2">2 attempts</MenuItem><MenuItem value="3">3 attempts (recommended)</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Failed attempts before lockout</Typography></Box>
                </FieldGrid>
                <Box sx={{ mt: 2 }}>
                  <FieldGrid cols={2}>
                    <Box><FieldLabel label="SMS Provider (optional)" /><FormControl fullWidth size="small"><Select defaultValue="auto" sx={{ fontSize: '13px' }}><MenuItem value="auto">Auto (platform default)</MenuItem><MenuItem value="twilio">Twilio</MenuItem><MenuItem value="msg91">MSG91</MenuItem></Select></FormControl><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>OTP delivery provider for this country</Typography></Box>
                    <Box><FieldLabel label="Sender ID / From (optional)" /><TextField fullWidth size="small" placeholder="e.g. TAEVAS" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Alphanumeric sender ID (max 11 chars)</Typography></Box>
                  </FieldGrid>
                </Box>
                <Box sx={{ mt: 2 }}><FieldLabel label="SMS OTP Message Text *" /><TextField fullWidth size="small" defaultValue={'{{otp}} is your {{clinic_name}} login code. Valid for {{expiry_mins}} mins. Do not share.'} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>{'Keep under 160 chars. Placeholders: {{otp}}  {{user_name}}  {{clinic_name}}  {{expiry_mins}}'}</Typography></Box>
                {/* SMS Provider API (optional expandable) */}
                <Box sx={{ mt: 2, border: `1.5px solid ${wizSmsApiOpen ? BRAND + '40' : BRAND + '20'}`, borderRadius: '10px', overflow: 'hidden', transition: 'all 0.2s' }}>
                  <Box onClick={() => setWizSmsApiOpen(!wizSmsApiOpen)} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, cursor: 'pointer', background: wizSmsApiOpen ? '#F8F9FF' : 'transparent', '&:hover': { background: '#F8F9FF' } }}>
                    <Typography sx={{ fontSize: '11px' }}>{'\u2699\uFE0F'}</Typography>
                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: BRAND, flex: 1 }}>SMS Provider API Credentials</Typography>
                    <Typography sx={{ fontSize: '11px', color: CAP }}>(optional)</Typography>
                    <Typography sx={{ fontSize: '10px', color: BRAND, transform: wizSmsApiOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>{'\u25B6'}</Typography>
                  </Box>
                  {wizSmsApiOpen && (
                    <Box sx={{ px: 2.5, pb: 2.5, pt: 1.5, borderTop: `1px solid ${BRAND}15` }}>
                      <FieldGrid cols={2}>
                        <Box><FieldLabel label="Account SID" /><TextField fullWidth size="small" type="password" placeholder="AC..." sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Twilio / MSG91 Account SID</Typography></Box>
                        <Box><FieldLabel label="Auth Token" /><TextField fullWidth size="small" type="password" placeholder="token..." sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Provider auth token or API key</Typography></Box>
                      </FieldGrid>
                      <Box sx={{ mt: 1.75 }}><FieldGrid cols={2}>
                        <Box><FieldLabel label="From Number" /><TextField fullWidth size="small" placeholder="+1234567890" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Registered sender phone number</Typography></Box>
                        <Box><FieldLabel label="Webhook URL (optional)" /><TextField fullWidth size="small" placeholder="https://api.taevasclinic.com/webhooks/sms" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /><Typography sx={{ fontSize: '10px', color: CAP, mt: 0.5 }}>Delivery status callback URL</Typography></Box>
                      </FieldGrid></Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </SectionCard>
        )}

        {/* Step 2: Identity */}
        {wizardStep === 2 && (
          <>
            {/* TN Preview */}
            <Box sx={{ background: `linear-gradient(135deg, ${BRAND}08, ${BRAND2}08)`, border: `1.5px solid ${BRAND}25`, borderRadius: '10px', p: '11px 15px', display: 'flex', alignItems: 'center', gap: 1.375, mb: 2 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '9px', background: BRAND, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', flexShrink: 0 }}>
                {d.identity.flagEmoji || '#'}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{d.identity.countryName || 'New Tenant'}</Typography>
                <Typography sx={{ fontSize: '11px', fontFamily: MONO, color: BRAND, fontWeight: 700 }}>{tnPreview}</Typography>
              </Box>
            </Box>

            <SectionCard title="Country Identity">
              <FieldGrid cols={2}>
                <Box>
                  <FieldLabel label="Country Name *" />
                  <TextField fullWidth size="small" value={d.identity.countryName} onChange={e => updateWizard(dr => { dr.identity.countryName = e.target.value; })} placeholder="e.g. Philippines" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} />
                </Box>
                <Box>
                  <FieldLabel label="ISO Code *" />
                  <TextField fullWidth size="small" value={d.identity.isoCode} onChange={e => updateWizard(dr => { dr.identity.isoCode = e.target.value.toUpperCase(); })} placeholder="e.g. PH" inputProps={{ maxLength: 2 }} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} />
                </Box>
              </FieldGrid>

              <Box sx={{ mt: 2 }}>
                <FieldGrid>
                  <Box><FieldLabel label="Dial Code" /><TextField fullWidth size="small" value={d.identity.dialCode} onChange={e => updateWizard(dr => { dr.identity.dialCode = e.target.value; })} placeholder="+63" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
                </FieldGrid>
              </Box>
            </SectionCard>
          </>
        )}

        {/* Step 3: Setup & Compliance */}
        {wizardStep === 3 && (
          <>
            <SectionCard title="Locale & Currency">
              <FieldGrid>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '13px' }}>Timezone</InputLabel>
                  <Select value={d.setup.timezone} label="Timezone" onChange={e => updateWizard(dr => { dr.setup.timezone = e.target.value; })} sx={{ fontSize: '13px' }}>
                    {TIMEZONES.map(tz => <MenuItem key={tz} value={tz}>{tz}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '13px' }}>Currency</InputLabel>
                  <Select value={d.setup.currency} label="Currency" onChange={e => updateWizard(dr => { dr.setup.currency = e.target.value; })} sx={{ fontSize: '13px' }}>
                    {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '13px' }}>Language</InputLabel>
                  <Select value={d.setup.language} label="Language" onChange={e => updateWizard(dr => { dr.setup.language = e.target.value; })} sx={{ fontSize: '13px' }}>
                    {LANGUAGES.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
              </FieldGrid>
            </SectionCard>

            <SectionCard title="Compliance Modules">
              <Typography sx={{ fontSize: '12px', color: SUB, mb: 1.5 }}>Click to toggle modules for this tenant.</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.875 }}>
                {COMPLIANCE_OPTIONS.map(mod => {
                  const isSel = d.setup.complianceModules.includes(mod);
                  return (
                    <Chip
                      key={mod}
                      label={mod}
                      onClick={() => updateWizard(dr => {
                        if (isSel) dr.setup.complianceModules = dr.setup.complianceModules.filter(m => m !== mod);
                        else dr.setup.complianceModules.push(mod);
                      })}
                      sx={{
                        fontWeight: 600, fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
                        ...(isSel ? { background: BRAND, color: '#fff', border: `1.5px solid ${BRAND}` } : { background: '#fff', color: SUB, border: `1.5px solid ${BORDER}` }),
                        '&:hover': { borderColor: BRAND },
                      }}
                    />
                  );
                })}
              </Box>
            </SectionCard>

            <SectionCard title="ID Formats & Billing">
              <FieldGrid>
                <Box><FieldLabel label="Country Prefix" /><TextField fullWidth size="small" value={d.setup.countryPrefix} onChange={e => updateWizard(dr => { dr.setup.countryPrefix = e.target.value.toUpperCase(); })} placeholder="PH" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
                <Box><FieldLabel label="User ID Format" /><TextField fullWidth size="small" value={d.setup.userIdFormat} onChange={e => updateWizard(dr => { dr.setup.userIdFormat = e.target.value; })} placeholder="PH-UR-#####" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
                <Box><FieldLabel label="Clinic ID Format" /><TextField fullWidth size="small" value={d.setup.clinicIdFormat} onChange={e => updateWizard(dr => { dr.setup.clinicIdFormat = e.target.value; })} placeholder="PH-CL-###" sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px', fontFamily: MONO } }} /></Box>
              </FieldGrid>
              <Box sx={{ mt: 1.5 }}>
                <FieldLabel label="Billing Model" />
                <TextField fullWidth size="small" value={d.setup.billingModel} onChange={e => updateWizard(dr => { dr.setup.billingModel = e.target.value; })} sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }} />
              </Box>
            </SectionCard>
          </>
        )}

        {/* Step 4: Review */}
        {wizardStep === 4 && (
          <>
            <SectionCard title="Review Summary">
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.08em', pb: 0.75, borderBottom: `1px solid ${BORDER}`, mb: 1.125 }}>Identity</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
                  {[
                    { k: 'Country', v: d.identity.countryName },
                    { k: 'ISO', v: d.identity.isoCode, mono: true },
                    { k: 'Dial Code', v: d.identity.dialCode, mono: true },
                  ].map(r => (
                    <Box key={r.k} sx={{ p: '7px 10px', background: '#F8F9FC', border: `1px solid ${BORDER}`, borderRadius: '7px' }}>
                      <Typography sx={{ fontSize: '10px', fontWeight: 600, color: CAP, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.k}</Typography>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, ...(r.mono ? { fontFamily: MONO, color: BRAND } : {}) }}>{r.v || '\u2014'}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.08em', pb: 0.75, borderBottom: `1px solid ${BORDER}`, mb: 1.125 }}>Login Methods</Typography>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {d.loginConfig.emailEnabled && <Chip label="Email + Password" size="small" sx={{ background: `${BRAND}10`, color: BRAND, fontWeight: 600 }} />}
                  {d.loginConfig.phoneEnabled && <Chip label="Phone OTP (SMS)" size="small" sx={{ background: `${BRAND}10`, color: BRAND, fontWeight: 600 }} />}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.08em', pb: 0.75, borderBottom: `1px solid ${BORDER}`, mb: 1.125 }}>Setup</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
                  {[
                    { k: 'Timezone', v: d.setup.timezone },
                    { k: 'Currency', v: d.setup.currency, mono: true },
                    { k: 'Language', v: d.setup.language },
                    { k: 'Billing', v: d.setup.billingModel },
                    { k: 'User ID', v: d.setup.userIdFormat, mono: true },
                    { k: 'Clinic ID', v: d.setup.clinicIdFormat, mono: true },
                  ].map(r => (
                    <Box key={r.k} sx={{ p: '7px 10px', background: '#F8F9FC', border: `1px solid ${BORDER}`, borderRadius: '7px' }}>
                      <Typography sx={{ fontSize: '10px', fontWeight: 600, color: CAP, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.k}</Typography>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, ...(r.mono ? { fontFamily: MONO, color: BRAND } : {}) }}>{r.v || '\u2014'}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {d.setup.complianceModules.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: '10px', fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.08em', pb: 0.75, borderBottom: `1px solid ${BORDER}`, mb: 1.125 }}>Compliance</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.625 }}>
                    {d.setup.complianceModules.map(m => (
                      <Chip key={m} label={m} size="small" sx={{ background: `${BRAND}10`, color: BRAND, border: `1px solid ${BRAND}25`, fontWeight: 600, fontSize: '10px' }} />
                    ))}
                  </Box>
                </Box>
              )}
            </SectionCard>
          </>
        )}

        {/* Action Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '13px 22px', background: '#fff', border: `1.5px solid ${BORDER}`, borderRadius: '13px', mt: 2, mb: 3 }}>
          <Button
            variant="outlined" size="small" disabled={wizardStep === 1}
            onClick={() => setWizardStep(prev => prev - 1)}
            sx={{ borderColor: BORDER, color: SUB, fontWeight: 600, textTransform: 'none' }}
          >
            Back
          </Button>
          <Typography sx={{ fontSize: '11px', color: CAP, fontFamily: MONO }}>Step {wizardStep} of 4</Typography>
          {wizardStep < 4 ? (
            <Button
              variant="contained" size="small"
              disabled={!wizardValid(wizardStep)}
              onClick={() => setWizardStep(prev => prev + 1)}
              sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained" size="small"
              onClick={handleWizardSubmit}
              sx={{ background: GREEN, '&:hover': { background: '#5a6600' }, fontWeight: 700, textTransform: 'none' }}
            >
              Submit
            </Button>
          )}
        </Box>
      </>
    );
  };

  // ─── Main Render ─────────────────────────────────────────────────────────────
  return (
    <DashboardLayout pageTitle="Countries">
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {renderSidebar()}

        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden', background: BG }}>
          <Box
            id="countries-scroll"
            onScroll={(e: any) => {
              const el = e.target;
              const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
              const arrow = document.getElementById('scroll-arrow');
              if (arrow) arrow.style.opacity = atBottom ? '0' : '1';
            }}
            sx={{ height: '100%', overflowY: 'auto', px: 3, py: 2 }}
          >
            {showWizard && renderWizard()}
            {!showWizard && selected && renderActiveConfig()}
          </Box>
          <Box
            id="scroll-arrow"
            onClick={() => { const el = document.getElementById('countries-scroll'); if (el) el.scrollBy({ top: 300, behavior: 'smooth' }); }}
            sx={{
              position: 'absolute', bottom: 8, right: 18,
              px: 1.25, py: 0.5, borderRadius: '12px',
              background: 'rgba(85,25,230,0.9)', color: '#fff',
              cursor: 'pointer', transition: 'opacity 0.3s', zIndex: 2,
              boxShadow: '0 2px 8px rgba(85,25,230,0.3)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '10px', fontWeight: 600 }}>
              <span>{'\u25BC'}</span>
              <span>More</span>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Confirm Suspend Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, tenantId: '' })}>
        <DialogTitle sx={{ fontWeight: 700 }}>Deactivate Tenant?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '14px', color: SUB }}>This will deactivate the tenant. Users will lose access until re-activated. Are you sure?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, tenantId: '' })} sx={{ color: SUB, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={confirmDeactivate} variant="contained" sx={{ background: RED, '&:hover': { background: '#DC2626' }, textTransform: 'none', fontWeight: 700 }}>Deactivate</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!alertMsg}
        autoHideDuration={3000}
        onClose={() => setAlertMsg('')}
        message={alertMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </DashboardLayout>
  );
};

export default Countries;
