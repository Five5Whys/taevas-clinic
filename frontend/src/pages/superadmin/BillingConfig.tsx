import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  Select,
  MenuItem,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCountries } from '@/hooks/superadmin/useCountries';
import { useBillingConfig, useUpdateBilling } from '@/hooks/superadmin/useBilling';
import { BillingConfigDto, CountryConfig } from '@/types/superadmin';

// ─── Toggle Row ────────────────────────────────────────────────────────────────
const ToggleRow: React.FC<{
  name: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ name, desc, checked, onChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, borderTop: '1px solid #F3F4F6' }}>
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12.5px' }}>{name}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>{desc}</Typography>
    </Box>
    <Switch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      size="small"
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color: '#5519E6' },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5519E6' },
      }}
    />
  </Box>
);

// ─── Country Selector Card ────────────────────────────────────────────────────
const CountryCard: React.FC<{
  flag: string; name: string; sub: string;
  selected: boolean; onClick: () => void;
}> = ({ flag, name, sub, selected, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      border: selected ? '2px solid #5519E6' : '1.5px solid #E5E7EB',
      background: selected ? '#5519E608' : '#fff',
      transition: 'all 0.15s',
      '&:hover': { borderColor: '#5519E6' },
    }}
  >
    <CardContent sx={{ p: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: 20 }}>{flag}</Typography>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px' }}>{name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>{sub}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// ─── Billing Form State ──────────────────────────────────────────────────────
interface BillingForm {
  currencySymbol: string;
  currencyCode: string;
  taxRate: string;
  taxSplit: string;
  claimCode: string;
  invoicePrefix: string;
  invoiceFormat: string;
  toggles: Record<string, boolean>;
}

// ─── Mock fallback data ──────────────────────────────────────────────────────
const MOCK_COUNTRIES: Pick<CountryConfig, 'id' | 'name' | 'flagEmoji' | 'currencySymbol' | 'currencyCode' | 'taxRate' | 'taxType'>[] = [
  { id: 'india', name: 'India', flagEmoji: '\u{1F1EE}\u{1F1F3}', currencySymbol: '\u20B9', currencyCode: 'INR', taxRate: 18, taxType: 'GST' },
  { id: 'thailand', name: 'Thailand', flagEmoji: '\u{1F1F9}\u{1F1ED}', currencySymbol: '\u0E3F', currencyCode: 'THB', taxRate: 7, taxType: 'VAT' },
  { id: 'maldives', name: 'Maldives', flagEmoji: '\u{1F1F2}\u{1F1FB}', currencySymbol: '\u0DBB', currencyCode: 'MVR', taxRate: 0, taxType: 'None' },
];

const MOCK_BILLING: Record<string, BillingConfigDto> = {
  india: {
    id: 'b-india',
    countryId: 'india',
    currencySymbol: '\u20B9',
    currencyCode: 'INR',
    taxRate: 18,
    taxSplit: 'CGST 9% + SGST 9%',
    claimCode: '',
    invoicePrefix: 'TC-IN-',
    invoiceFormat: 'GST Tax Invoice',
    toggles: { abdmDhis: true, upiQr: true },
  },
  thailand: {
    id: 'b-thailand',
    countryId: 'thailand',
    currencySymbol: '\u0E3F',
    currencyCode: 'THB',
    taxRate: 7,
    taxSplit: '',
    claimCode: 'ENT-TH-001',
    invoicePrefix: 'TC-TH-',
    invoiceFormat: 'NHSO Standard',
    toggles: { nhsoAutoSubmit: true, promptPayQr: true },
  },
  maldives: {
    id: 'b-maldives',
    countryId: 'maldives',
    currencySymbol: '\u0DBB',
    currencyCode: 'MVR',
    taxRate: 0,
    taxSplit: '',
    claimCode: '',
    invoicePrefix: 'TC-MV-',
    invoiceFormat: 'Standard Invoice',
    toggles: { localPayment: true },
  },
};

function buildSubLine(c: Pick<CountryConfig, 'currencySymbol' | 'currencyCode' | 'taxRate' | 'taxType'>): string {
  const parts = [`${c.currencySymbol} ${c.currencyCode}`];
  if (c.taxRate > 0) {
    parts.push(`${c.taxType} ${c.taxRate}%`);
  } else {
    parts.push(`No ${c.taxType || 'GST'}`);
  }
  return parts.join(' \u00B7 ');
}

function dtoToForm(dto: BillingConfigDto): BillingForm {
  return {
    currencySymbol: dto.currencySymbol,
    currencyCode: dto.currencyCode,
    taxRate: dto.taxRate > 0 ? `${dto.taxRate}%` : 'No VAT',
    taxSplit: dto.taxSplit,
    claimCode: dto.claimCode,
    invoicePrefix: dto.invoicePrefix,
    invoiceFormat: dto.invoiceFormat,
    toggles: { ...dto.toggles },
  };
}

function formToDto(form: BillingForm): Partial<BillingConfigDto> {
  const rateStr = form.taxRate.replace(/[^0-9.]/g, '');
  return {
    currencySymbol: form.currencySymbol,
    currencyCode: form.currencyCode,
    taxRate: rateStr ? parseFloat(rateStr) : 0,
    taxSplit: form.taxSplit,
    claimCode: form.claimCode,
    invoicePrefix: form.invoicePrefix,
    invoiceFormat: form.invoiceFormat,
    toggles: form.toggles,
  };
}

// ─── Billing Config Card ──────────────────────────────────────────────────────
const BillingCardWrapper: React.FC<{
  countryId: string;
  countries: Pick<CountryConfig, 'id' | 'name' | 'flagEmoji' | 'currencySymbol' | 'currencyCode' | 'taxRate' | 'taxType'>[];
}> = ({ countryId, countries }) => {
  const { data: billingData, isLoading } = useBillingConfig(countryId);
  const updateBilling = useUpdateBilling();

  const apiData = billingData ?? MOCK_BILLING[countryId];
  const country = countries.find((c) => c.id === countryId);

  const [form, setForm] = useState<BillingForm>(() =>
    apiData ? dtoToForm(apiData) : dtoToForm((MOCK_BILLING[countryId] ?? MOCK_BILLING.india)!)
  );

  // Sync local form when API data loads or country changes
  useEffect(() => {
    if (apiData) {
      setForm(dtoToForm(apiData));
    }
  }, [apiData?.id, apiData?.countryId, countryId]);

  const onChange = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const onToggle = (key: string, val: boolean) =>
    setForm((prev) => ({ ...prev, toggles: { ...prev.toggles, [key]: val } }));

  const onSave = () => {
    updateBilling.mutate({ countryId, data: formToDto(form) });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <CircularProgress size={32} sx={{ color: '#5519E6' }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {country?.flagEmoji} {country?.name} — Billing Config
        </Typography>

        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
          <Grid item xs={6}>
            <TextField fullWidth size="small" label="Currency Symbol" value={form.currencySymbol} onChange={(e) => onChange('currencySymbol', e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth size="small" label="Currency Code" value={form.currencyCode} onChange={(e) => onChange('currencyCode', e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth size="small" label={countryId === 'thailand' ? 'VAT Rate' : 'GST Rate'} value={form.taxRate} onChange={(e) => onChange('taxRate', e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth size="small"
              label={countryId === 'thailand' ? 'NHSO Claim Code' : 'GST Split'}
              value={countryId === 'thailand' ? form.claimCode : form.taxSplit}
              onChange={(e) => onChange(countryId === 'thailand' ? 'claimCode' : 'taxSplit', e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth size="small" label="Invoice Prefix" value={form.invoicePrefix} onChange={(e) => onChange('invoicePrefix', e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <Select
              fullWidth size="small"
              value={form.invoiceFormat}
              onChange={(e) => onChange('invoiceFormat', e.target.value)}
              sx={{ fontSize: '13px' }}
            >
              {countryId === 'india' ? (
                ['GST Tax Invoice', 'Proforma'].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)
              ) : countryId === 'thailand' ? (
                ['NHSO Standard', 'Private'].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)
              ) : (
                ['Standard Invoice', 'MOH Format'].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)
              )}
            </Select>
          </Grid>
        </Grid>

        {/* Country-specific toggles */}
        {countryId === 'india' && (
          <>
            <ToggleRow
              name="ABDM DHIS Credits"
              desc="Auto-apply \u20B920 credit per record pushed"
              checked={form.toggles.abdmDhis ?? true}
              onChange={(v) => onToggle('abdmDhis', v)}
            />
            <ToggleRow
              name="UPI Payment QR on Invoice"
              desc="Show UPI QR code for instant payment"
              checked={form.toggles.upiQr ?? true}
              onChange={(v) => onToggle('upiQr', v)}
            />
          </>
        )}
        {countryId === 'thailand' && (
          <>
            <ToggleRow
              name="NHSO Claims Auto-Submit"
              desc="Auto-push eligible encounters to NHSO portal"
              checked={form.toggles.nhsoAutoSubmit ?? true}
              onChange={(v) => onToggle('nhsoAutoSubmit', v)}
            />
            <ToggleRow
              name="PromptPay QR on Invoice"
              desc="Show PromptPay QR for instant payment"
              checked={form.toggles.promptPayQr ?? true}
              onChange={(v) => onToggle('promptPayQr', v)}
            />
          </>
        )}
        {countryId === 'maldives' && (
          <ToggleRow
            name="Local Payment Gateway"
            desc="Enable BML / MCB payment gateway integration"
            checked={form.toggles.localPayment ?? true}
            onChange={(v) => onToggle('localPayment', v)}
          />
        )}

        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={onSave}
          disabled={updateBilling.isPending}
          sx={{ mt: 2, background: '#5519E6', '&:hover': { background: '#4410C0' }, fontWeight: 700 }}
        >
          {updateBilling.isPending ? 'Saving...' : `Save ${country?.name ?? ''} Billing Config`}
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const BillingConfig: React.FC = () => {
  const { data: countriesData, isLoading: countriesLoading } = useCountries();

  // Build country list with fallback
  const countries = (countriesData ?? MOCK_COUNTRIES) as typeof MOCK_COUNTRIES;

  const [activePair, setActivePair] = useState<[string, string]>(['', '']);

  // Auto-select first two countries when data loads
  useEffect(() => {
    if (activePair[0] === '' && countries.length >= 2) {
      setActivePair([countries[0]!.id, countries[1]!.id]);
    } else if (activePair[0] === '' && countries.length === 1) {
      setActivePair([countries[0]!.id, countries[0]!.id]);
    }
  }, [countries, activePair]);

  return (
    <DashboardLayout pageTitle="Billing Config">
      <Container maxWidth="lg" sx={{ py: 3 }}>

        {/* Country selector strip */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {countriesLoading ? (
            <>
              {[0, 1, 2].map((i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <Skeleton variant="rounded" height={64} />
                </Grid>
              ))}
            </>
          ) : (
            countries.map((c) => (
              <Grid item xs={12} sm={4} key={c.id}>
                <CountryCard
                  flag={c.flagEmoji}
                  name={c.name}
                  sub={buildSubLine(c)}
                  selected={activePair.includes(c.id)}
                  onClick={() => {
                    if (!activePair.includes(c.id)) {
                      setActivePair([c.id, activePair[0]]);
                    }
                  }}
                />
              </Grid>
            ))
          )}
        </Grid>

        {/* Two billing config cards side by side */}
        {activePair[0] !== '' && (
          <Grid container spacing={2.5}>
            {activePair.map((countryId) => (
              <Grid item xs={12} md={6} key={countryId}>
                <BillingCardWrapper countryId={countryId} countries={countries} />
              </Grid>
            ))}
          </Grid>
        )}

      </Container>
    </DashboardLayout>
  );
};

export default BillingConfig;
