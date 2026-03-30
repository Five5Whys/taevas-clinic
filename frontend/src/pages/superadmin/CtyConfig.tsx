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
  FormControl,
  InputLabel,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCountries, useUpdateCountry } from '@/hooks/superadmin/useCountries';
import { useBillingConfig, useUpdateBilling } from '@/hooks/superadmin/useBilling';
import { useLocaleSettings, useUpdateLocale } from '@/hooks/superadmin/useLocale';
import type { CountryConfig, BillingConfigDto, LocaleSettingsDto } from '@/types/superadmin';

// ─── Constants ──────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  ACTIVE: { color: '#6B7A00', bg: '#CDDC5020' },
  PILOT: { color: '#B85600', bg: '#FF823220' },
  ONBOARDING: { color: '#5519E6', bg: '#5519E620' },
  INACTIVE: { color: '#9CA3AF', bg: '#F3F4F6' },
};

const REGULATORY_OPTIONS = ['NMC', 'ABDM', 'FHIR R4', 'NHSO', 'PDPA', 'MOPH', 'MOH', 'HIPAA', 'GDPR'];
const LANGUAGES = ['English', 'Hindi', 'Thai', 'Dhivehi', 'Tamil', 'Telugu', 'Marathi'];
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
const WEIGHT_UNITS = ['kg', 'lbs'];
const HEIGHT_UNITS = ['cm', 'inches', 'feet'];
const TIMEZONES = ['Asia/Kolkata', 'Asia/Bangkok', 'Indian/Maldives', 'UTC'];

const TOGGLE_META: Record<string, { name: string; desc: string }> = {
  abdmDhis: { name: 'ABDM DHIS Credits', desc: 'Enable Ayushman Bharat DHIS credit tracking' },
  upiQr: { name: 'UPI QR on Invoice', desc: 'Show UPI QR code on patient invoices' },
  nhsoAutoSubmit: { name: 'NHSO Claims Auto-Submit', desc: 'Auto-push eligible encounters to NHSO portal' },
  promptPayQr: { name: 'PromptPay QR on Invoice', desc: 'Show PromptPay QR for instant payment' },
  localPaymentGateway: { name: 'Local Payment Gateway', desc: 'Enable BML / MCB payment gateway integration' },
};

// ─── Mock fallback data ─────────────────────────────────────────────────────────
const MOCK_COUNTRIES: CountryConfig[] = [
  { id: 'india', code: 'IN', name: 'India', flagEmoji: '\u{1F1EE}\u{1F1F3}', status: 'ACTIVE', currencyCode: 'INR', currencySymbol: '\u20B9', taxType: 'GST', taxRate: 18, dateFormat: 'DD/MM/YYYY', primaryLanguage: 'English', secondaryLanguage: 'Hindi', regulatoryBodies: ['NMC', 'ABDM', 'FHIR R4'], clinicCount: 4, doctorCount: 31 },
  { id: 'thailand', code: 'TH', name: 'Thailand', flagEmoji: '\u{1F1F9}\u{1F1ED}', status: 'ACTIVE', currencyCode: 'THB', currencySymbol: '\u0E3F', taxType: 'VAT', taxRate: 7, dateFormat: 'DD/MM/YYYY', primaryLanguage: 'Thai', secondaryLanguage: 'English', regulatoryBodies: ['MOPH', 'NHSO', 'PDPA'], clinicCount: 4, doctorCount: 11 },
  { id: 'maldives', code: 'MV', name: 'Maldives', flagEmoji: '\u{1F1F2}\u{1F1FB}', status: 'PILOT', currencyCode: 'MVR', currencySymbol: 'Rf', taxType: 'GST', taxRate: 8, dateFormat: 'DD/MM/YYYY', primaryLanguage: 'Dhivehi', secondaryLanguage: 'English', regulatoryBodies: ['MOH'], clinicCount: 4, doctorCount: 5 },
];

const MOCK_BILLING: Record<string, BillingConfigDto> = {
  india: { id: 'b-india', countryId: 'india', currencySymbol: '\u20B9', currencyCode: 'INR', taxRate: 18, taxSplit: 'CGST 9% + SGST 9%', claimCode: '', invoicePrefix: 'TC-IN-', invoiceFormat: 'GST Tax Invoice', toggles: { abdmDhis: true, upiQr: true } },
  thailand: { id: 'b-thailand', countryId: 'thailand', currencySymbol: '\u0E3F', currencyCode: 'THB', taxRate: 7, taxSplit: '', claimCode: 'CLM-TH', invoicePrefix: 'TC-TH-', invoiceFormat: 'NHSO Standard', toggles: { nhsoAutoSubmit: true, promptPayQr: true } },
  maldives: { id: 'b-maldives', countryId: 'maldives', currencySymbol: 'Rf', currencyCode: 'MVR', taxRate: 0, taxSplit: '', claimCode: '', invoicePrefix: 'TC-MV-', invoiceFormat: 'Standard Invoice', toggles: { localPaymentGateway: true } },
};

const MOCK_LOCALE: Record<string, LocaleSettingsDto> = {
  india: { id: 'l-india', countryId: 'india', primaryLanguage: 'English', secondaryLanguage: 'Hindi', dateFormat: 'DD/MM/YYYY', weightUnit: 'kg', heightUnit: 'cm', timezone: 'Asia/Kolkata' },
  thailand: { id: 'l-thailand', countryId: 'thailand', primaryLanguage: 'Thai', secondaryLanguage: 'English', dateFormat: 'DD/MM/YYYY', weightUnit: 'kg', heightUnit: 'cm', timezone: 'Asia/Bangkok' },
  maldives: { id: 'l-maldives', countryId: 'maldives', primaryLanguage: 'Dhivehi', secondaryLanguage: 'English', dateFormat: 'DD/MM/YYYY', weightUnit: 'kg', heightUnit: 'cm', timezone: 'Indian/Maldives' },
};

// ─── Sub-components ─────────────────────────────────────────────────────────────

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{ background: '#fff', borderRadius: 2, border: '1px solid #E5E7EB', mb: 2, overflow: 'hidden' }}>
    <Box sx={{ px: 2.5, py: 1.75, borderBottom: '1px solid #F3F4F6' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{title}</Typography>
    </Box>
    <Box sx={{ px: 2.5, py: 2 }}>{children}</Box>
  </Box>
);

const FieldGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.75, '@media (max-width: 900px)': { gridTemplateColumns: '1fr 1fr' } }}>
    {children}
  </Box>
);

const ReadOnlyField: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <Box>
    <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>{label}</Typography>
    <Box sx={{
      fontSize: '13px', fontWeight: highlight ? 600 : 500, p: '8px 12px',
      background: highlight ? '#F0EEFF' : '#F9FAFB',
      border: `1px solid ${highlight ? '#5519E640' : '#E5E7EB'}`,
      borderRadius: 1,
      color: highlight ? '#5519E6' : 'inherit',
    }}>{value}</Box>
  </Box>
);

const ToggleRow: React.FC<{ name: string; desc: string; checked: boolean; onChange: (v: boolean) => void }> = ({ name, desc, checked, onChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #F9FAFB', '&:last-child': { border: 'none' } }}>
    <Box>
      <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{name}</Typography>
      <Typography sx={{ fontSize: '11px', color: '#9CA3AF' }}>{desc}</Typography>
    </Box>
    <Switch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      size="small"
      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#5519E6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5519E6' } }}
    />
  </Box>
);

// ─── Main Component ─────────────────────────────────────────────────────────────
const CtyConfig: React.FC = () => {
  const { data: countriesData, isLoading } = useCountries();
  const updateCountry = useUpdateCountry();
  const updateBilling = useUpdateBilling();
  const updateLocale = useUpdateLocale();

  const countries = countriesData ?? MOCK_COUNTRIES;
  const [selectedId, setSelectedId] = useState('');
  const [activeTab, setActiveTab] = useState<'localization' | 'billing'>('localization');

  // Localization form
  const [regulatoryBodies, setRegulatoryBodies] = useState<string[]>([]);
  const [currency, setCurrency] = useState('');
  const [primaryLang, setPrimaryLang] = useState('');
  const [secondaryLang, setSecondaryLang] = useState('');
  const [timezone, setTimezone] = useState('');
  const [dateFormat, setDateFormat] = useState('');
  const [weightUnit, setWeightUnit] = useState('');
  const [heightUnit, setHeightUnit] = useState('');

  // Billing form
  const [taxType, setTaxType] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [taxSplit, setTaxSplit] = useState('');
  const [invoicePrefix, setInvoicePrefix] = useState('');
  const [invoiceFormat, setInvoiceFormat] = useState('');
  const [claimCode, setClaimCode] = useState('');
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  const selected = countries.find((c) => c.id === selectedId);

  // Fetch billing & locale for selected country
  const { data: billingData } = useBillingConfig(selectedId);
  const { data: localeData } = useLocaleSettings(selectedId);

  // Auto-select first country, or re-select when list IDs change
  useEffect(() => {
    if (countries.length === 0) return;
    const match = countries.find((c) => c.id === selectedId);
    if (!match) {
      setSelectedId(countries[0].id);
    }
  }, [countries, selectedId]);

  // Sync localization form when country changes
  useEffect(() => {
    if (!selected) return;
    const locale = localeData ?? MOCK_LOCALE[selected.id] ?? MOCK_LOCALE[selected.name.toLowerCase()];
    setRegulatoryBodies(selected.regulatoryBodies ?? []);
    setCurrency(selected.currencyCode);
    setPrimaryLang(locale?.primaryLanguage ?? selected.primaryLanguage);
    setSecondaryLang(locale?.secondaryLanguage ?? selected.secondaryLanguage);
    setTimezone(locale?.timezone ?? 'UTC');
    setDateFormat(locale?.dateFormat ?? selected.dateFormat);
    setWeightUnit(locale?.weightUnit ?? 'kg');
    setHeightUnit(locale?.heightUnit ?? 'cm');
  }, [selected?.id, localeData]);

  // Sync billing form when country changes
  useEffect(() => {
    if (!selected) return;
    const billing = billingData ?? MOCK_BILLING[selected.id] ?? MOCK_BILLING[selected.name.toLowerCase()];
    setTaxType(selected.taxType);
    setTaxRate(billing ? `${billing.taxRate}%` : `${selected.taxRate}%`);
    setTaxSplit(billing?.taxSplit ?? '');
    setInvoicePrefix(billing?.invoicePrefix ?? '');
    setInvoiceFormat(billing?.invoiceFormat ?? '');
    setClaimCode(billing?.claimCode ?? '');
    setToggles(billing?.toggles ?? {});
  }, [selected?.id, billingData]);

  const handleSaveLocalization = () => {
    if (!selected) return;
    updateCountry.mutate({
      id: selected.id,
      data: { currencyCode: currency, regulatoryBodies },
    });
    updateLocale.mutate({
      countryId: selected.id,
      data: { primaryLanguage: primaryLang, secondaryLanguage: secondaryLang, dateFormat, weightUnit, heightUnit, timezone },
    });
  };

  const handleSaveBilling = () => {
    if (!selected) return;
    const rateNum = parseFloat(taxRate.replace(/[^0-9.]/g, '')) || 0;
    updateBilling.mutate({
      countryId: selected.id,
      data: { taxRate: rateNum, taxSplit, invoicePrefix, invoiceFormat, claimCode, toggles },
    });
  };

  const isSaving = updateCountry.isPending || updateLocale.isPending || updateBilling.isPending;

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="CTY Config">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#5519E6' }} />
        </Box>
      </DashboardLayout>
    );
  }

  const statusStyle = STATUS_STYLES[selected?.status ?? 'ACTIVE'];

  return (
    <DashboardLayout pageTitle="CTY Config">
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>

        {/* ─── Country Sidebar ─── */}
        <Box sx={{
          width: 200, flexShrink: 0, background: '#fff', borderRight: '1px solid #E5E7EB',
          overflowY: 'auto', py: 2,
        }}>
          <Typography sx={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', px: 2, mb: 1, fontWeight: 600 }}>
            Countries ({countries.length})
          </Typography>
          {countries.map((c) => {
            const ss = STATUS_STYLES[c.status] ?? STATUS_STYLES.ACTIVE;
            return (
              <Box
                key={c.id}
                onClick={() => { setSelectedId(c.id); setActiveTab('localization'); }}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25,
                  cursor: 'pointer', borderLeft: '3px solid transparent',
                  transition: 'all 0.15s',
                  ...(selectedId === c.id && { background: '#F0EEFF', borderLeftColor: '#5519E6' }),
                  '&:hover': { background: selectedId === c.id ? '#F0EEFF' : '#F9FAFB' },
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '13px' }}>{c.name}</Typography>
                  <Typography sx={{ fontSize: '10px', color: '#9CA3AF' }}>{c.clinicCount} clinics</Typography>
                </Box>
                <Chip
                  label={c.status}
                  size="small"
                  sx={{ background: ss.bg, color: ss.color, fontWeight: 700, fontSize: '9px', height: 18, '& .MuiChip-label': { px: 0.75 } }}
                />
              </Box>
            );
          })}
        </Box>

        {/* ─── Main Content ─── */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
          {selected && (
            <>
              {/* Country Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 800 }}>{selected.name}</Typography>
                <Chip
                  label={selected.status}
                  size="small"
                  sx={{ background: statusStyle?.bg, color: statusStyle?.color, fontWeight: 700, fontSize: '11px', height: 22 }}
                />
              </Box>

              {/* Tabs */}
              <Box sx={{ display: 'flex', gap: 0, mb: 2.5, borderBottom: '2px solid #E5E7EB' }}>
                {(['localization', 'billing'] as const).map((tab) => (
                  <Box
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    sx={{
                      px: 3, py: 1.25, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      borderBottom: '2px solid transparent', mb: '-2px',
                      color: activeTab === tab ? '#5519E6' : '#9CA3AF',
                      borderBottomColor: activeTab === tab ? '#5519E6' : 'transparent',
                      transition: 'all 0.15s',
                      '&:hover': { color: activeTab === tab ? '#5519E6' : '#374151' },
                      textTransform: 'capitalize',
                    }}
                  >
                    {tab}
                  </Box>
                ))}
              </Box>

              {/* ═══ Localization Tab ═══ */}
              {activeTab === 'localization' && (
                <>
                  <SectionCard title="Country Details">
                    <FieldGrid>
                      <ReadOnlyField label="ISO Code" value={selected.code} />
                      <Box>
                        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>Currency</Typography>
                        <TextField
                          fullWidth size="small" value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }}
                        />
                      </Box>
                      <ReadOnlyField label="Status" value={selected.status} highlight />
                    </FieldGrid>
                    <Box sx={{ mt: 1.75 }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>Regulatory Bodies</Typography>
                      <Autocomplete
                        multiple
                        options={REGULATORY_OPTIONS}
                        value={regulatoryBodies}
                        onChange={(_, newVal) => setRegulatoryBodies(newVal)}
                        freeSolo
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              label={option}
                              size="small"
                              sx={{ background: '#5519E610', color: '#5519E6', fontWeight: 600, fontSize: '11px' }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField {...params} size="small" placeholder="Add regulatory body..." sx={{ '& .MuiInputBase-input': { fontSize: '13px' } }} />
                        )}
                      />
                    </Box>
                  </SectionCard>

                  <SectionCard title="Language & Format">
                    <FieldGrid>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: '13px' }}>Primary Language</InputLabel>
                        <Select value={primaryLang} label="Primary Language" onChange={(e) => setPrimaryLang(e.target.value)} sx={{ fontSize: '13px' }}>
                          {LANGUAGES.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: '13px' }}>Secondary Language</InputLabel>
                        <Select value={secondaryLang} label="Secondary Language" onChange={(e) => setSecondaryLang(e.target.value)} sx={{ fontSize: '13px' }}>
                          {LANGUAGES.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: '13px' }}>Timezone</InputLabel>
                        <Select value={timezone} label="Timezone" onChange={(e) => setTimezone(e.target.value)} sx={{ fontSize: '13px' }}>
                          {TIMEZONES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: '13px' }}>Date Format</InputLabel>
                        <Select value={dateFormat} label="Date Format" onChange={(e) => setDateFormat(e.target.value)} sx={{ fontSize: '13px' }}>
                          {DATE_FORMATS.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: '13px' }}>Weight Unit</InputLabel>
                        <Select value={weightUnit} label="Weight Unit" onChange={(e) => setWeightUnit(e.target.value)} sx={{ fontSize: '13px' }}>
                          {WEIGHT_UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ fontSize: '13px' }}>Height Unit</InputLabel>
                        <Select value={heightUnit} label="Height Unit" onChange={(e) => setHeightUnit(e.target.value)} sx={{ fontSize: '13px' }}>
                          {HEIGHT_UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </FieldGrid>
                  </SectionCard>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mt: 1 }}>
                    <Button variant="outlined" size="small" sx={{ borderColor: '#E5E7EB', color: '#6B7280', fontWeight: 600 }}>Reset</Button>
                    <Button
                      variant="contained" size="small"
                      disabled={isSaving}
                      onClick={handleSaveLocalization}
                      sx={{ background: '#5519E6', '&:hover': { background: '#4410C0' }, fontWeight: 700 }}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </>
              )}

              {/* ═══ Billing Tab ═══ */}
              {activeTab === 'billing' && (
                <>
                  <SectionCard title="Tax & Invoice">
                    <FieldGrid>
                      <ReadOnlyField label="Tax Type" value={taxType} />
                      <Box>
                        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>Tax Rate</Typography>
                        <TextField
                          fullWidth size="small" value={taxRate}
                          onChange={(e) => setTaxRate(e.target.value)}
                          sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>Tax Split</Typography>
                        <TextField
                          fullWidth size="small" value={taxSplit}
                          onChange={(e) => setTaxSplit(e.target.value)}
                          placeholder="e.g. CGST 9% + SGST 9%"
                          sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>Invoice Prefix</Typography>
                        <TextField
                          fullWidth size="small" value={invoicePrefix}
                          onChange={(e) => setInvoicePrefix(e.target.value)}
                          sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>Invoice Format</Typography>
                        <TextField
                          fullWidth size="small" value={invoiceFormat}
                          onChange={(e) => setInvoiceFormat(e.target.value)}
                          sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>Claim Code</Typography>
                        <TextField
                          fullWidth size="small" value={claimCode}
                          onChange={(e) => setClaimCode(e.target.value)}
                          placeholder="Not set"
                          sx={{ '& .MuiInputBase-input': { fontSize: '13px', py: '8px' } }}
                        />
                      </Box>
                    </FieldGrid>
                  </SectionCard>

                  <SectionCard title="Billing Toggles">
                    {Object.entries(toggles).map(([key, val]) => {
                      const meta = TOGGLE_META[key] ?? { name: key, desc: '' };
                      return (
                        <ToggleRow
                          key={key}
                          name={meta.name}
                          desc={meta.desc}
                          checked={val}
                          onChange={(v) => setToggles((prev) => ({ ...prev, [key]: v }))}
                        />
                      );
                    })}
                  </SectionCard>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mt: 1 }}>
                    <Button variant="outlined" size="small" sx={{ borderColor: '#E5E7EB', color: '#6B7280', fontWeight: 600 }}>Reset</Button>
                    <Button
                      variant="contained" size="small"
                      disabled={isSaving}
                      onClick={handleSaveBilling}
                      sx={{ background: '#5519E6', '&:hover': { background: '#4410C0' }, fontWeight: 700 }}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default CtyConfig;
