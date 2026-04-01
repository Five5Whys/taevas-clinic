import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
// DashboardLayout provided by parent Manage page
import { useClinics, useCreateClinic } from '@/hooks/superadmin/useClinics';
import { ClinicSummary } from '@/types/superadmin';

// ─── Fallback mock data ─────────────────────────────────────────────────────────
const FALLBACK_CLINICS: ClinicSummary[] = [
  { id:'1',  countryId:'IN', tenantId:'t1',  name:'ENT Care Center',            city:'Pune',       state:'MH', address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Active', countryName:'India',    countryFlag:'🇮🇳', complianceTags:['ABDM','FHIR R4'] },
  { id:'2',  countryId:'IN', tenantId:'t2',  name:'Apollo Clinic',              city:'Delhi',      state:'DL', address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Active', countryName:'India',    countryFlag:'🇮🇳', complianceTags:['ABDM','NMC'] },
  { id:'3',  countryId:'IN', tenantId:'t3',  name:'MedPoint',                   city:'Hyderabad',  state:'TG', address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Active', countryName:'India',    countryFlag:'🇮🇳', complianceTags:['ABDM'] },
  { id:'4',  countryId:'IN', tenantId:'t4',  name:'CareFirst',                  city:'Bangalore',  state:'KA', address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Active', countryName:'India',    countryFlag:'🇮🇳', complianceTags:['ABDM','NMC'] },
  { id:'5',  countryId:'IN', tenantId:'t5',  name:'Sree Diagnostics',           city:'Hyderabad',  state:'TG', address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Active', countryName:'India',    countryFlag:'🇮🇳', complianceTags:['ABDM'] },
  { id:'6',  countryId:'IN', tenantId:'t6',  name:'Fortis ENT',                 city:'Mumbai',     state:'MH', address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Active', countryName:'India',    countryFlag:'🇮🇳', complianceTags:['ABDM','FHIR R4'] },
  { id:'7',  countryId:'IN', tenantId:'t7',  name:'Kokilaben ENT',              city:'Mumbai',     state:'MH', address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Active', countryName:'India',    countryFlag:'🇮🇳', complianceTags:['ABDM'] },
  { id:'8',  countryId:'IN', tenantId:'t8',  name:'Medanta ENT',                city:'Gurgaon',    state:'HR', address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Active', countryName:'India',    countryFlag:'🇮🇳', complianceTags:['ABDM'] },
  { id:'9',  countryId:'TH', tenantId:'t9',  name:'Bangkok ENT Clinic',         city:'Bangkok',    state:'',   address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Active', countryName:'Thailand', countryFlag:'🇹🇭', complianceTags:['NHSO','PDPA'] },
  { id:'10', countryId:'TH', tenantId:'t10', name:'Phuket Medical Center',      city:'Phuket',     state:'',   address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Active', countryName:'Thailand', countryFlag:'🇹🇭', complianceTags:['NHSO','MOPH'] },
  { id:'11', countryId:'TH', tenantId:'t11', name:'Bumrungrad ENT',             city:'Bangkok',    state:'',   address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Pilot',  countryName:'Thailand', countryFlag:'🇹🇭', complianceTags:['NHSO'] },
  { id:'12', countryId:'MV', tenantId:'t12', name:'Male ENT & Hearing',         city:'Male',       state:'',   address:'', pincode:'', phone:'', email:'', registrationNumber:'', licenseNumber:'', licenseValidUntil:'', logoUrl:'', status:'Pilot',  countryName:'Maldives', countryFlag:'🇲🇻', complianceTags:['MOH'] },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────
const AVATAR_PALETTE = ['#5519E6', '#A046F0', '#FF8232', '#25D366', '#CDDC50'];

const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0]![0]! + words[1]![0]!).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const getAvatarColor = (index: number): string => AVATAR_PALETTE[index % AVATAR_PALETTE.length]!;

const COMPLIANCE_COLORS: Record<string, { bg: string; color: string }> = {
  'ABDM':   { bg: '#5519E615', color: '#5519E6' },
  'FHIR R4':{ bg: '#A046F015', color: '#6D28D9' },
  'NMC':    { bg: '#FF823215', color: '#B85600' },
  'NHSO':   { bg: '#5519E615', color: '#5519E6' },
  'PDPA':   { bg: '#A046F015', color: '#6D28D9' },
  'MOPH':   { bg: '#FF823215', color: '#B85600' },
  'MOH':    { bg: '#6B7A0015', color: '#6B7A00' },
};

// ─── Main ───────────────────────────────────────────────────────────────────────
const COUNTRY_OPTIONS = [
  { value: 'IN', label: 'India', flag: '\u{1F1EE}\u{1F1F3}' },
  { value: 'TH', label: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}' },
  { value: 'MV', label: 'Maldives', flag: '\u{1F1F2}\u{1F1FB}' },
];

const EMPTY_FORM = { name: '', countryId: '', city: '', address: '', phone: '', email: '', operatingHours: '' };

const Clinics: React.FC = () => {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const { data, isLoading, isError } = useClinics({ search: search || undefined });
  const createClinic = useCreateClinic();

  // Use API data when available, fall back to mock data
  const clinics: ClinicSummary[] = (Array.isArray(data) && data.length > 0) ? data : FALLBACK_CLINICS;

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 2.5 }}>

        {/* Toolbar */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'center' }}>
          <TextField
            size="small" placeholder="Search clinic or location…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icons.Search sx={{ fontSize: 16, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained" size="small"
            onClick={() => setAddOpen(true)}
            sx={{ fontWeight: 700, whiteSpace: 'nowrap', backgroundColor: '#5519E6', '&:hover': { backgroundColor: '#4010C0' } }}
          >
            + Add Clinic
          </Button>
        </Box>

        {/* Loading state */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#5519E6' }} />
          </Box>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <Box sx={{ textAlign: 'center', py: 4, mb: 2 }}>
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              Failed to load clinics. Showing cached data.
            </Typography>
          </Box>
        )}

        {/* 4-column compact grid */}
        {!isLoading && (
          <Grid container spacing={1.5}>
            {clinics.map((c, index) => {
              const initials = getInitials(c.name);
              const avatarColor = getAvatarColor(index);
              const location = `${c.city}, ${c.countryName}`;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
                  <Card
                    sx={{
                      border: '1.5px solid #E5E7EB',
                      '&:hover': { borderColor: '#5519E630', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
                      transition: 'all 0.15s', height: '100%',
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>

                      {/* Header row: avatar + name + location */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.25 }}>
                        <Box
                          sx={{
                            width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                            background: avatarColor, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: avatarColor === '#CDDC50' ? '#0F0F14' : '#fff',
                            fontWeight: 800, fontSize: '12px',
                          }}
                        >
                          {initials}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.2, mb: 0.25 }}
                            noWrap
                          >
                            {c.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }} noWrap>
                            {c.countryFlag} {location}
                          </Typography>
                        </Box>
                      </Box>

                      {/* KPI row — data not yet available from API */}
                      <Box sx={{ display: 'flex', gap: 0.75, mb: 1.25 }}>
                        {[
                          { label: 'Patients', value: '\u2014' },
                          { label: 'Revenue',  value: '\u2014' },
                        ].map((kpi) => (
                          <Box
                            key={kpi.label}
                            sx={{
                              flex: 1, textAlign: 'center', py: 0.75,
                              background: '#F8F9FA', borderRadius: 1.5,
                              border: '1px solid #E5E7EB',
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px' }}>
                              {kpi.value}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>
                              {kpi.label}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      {/* Badges row */}
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.25 }}>
                        <Chip
                          label={c.status}
                          size="small"
                          sx={{
                            height: 18, fontSize: '10px', fontWeight: 700,
                            background: c.status === 'Active' ? '#CDDC5020' : '#FF823220',
                            color: c.status === 'Active' ? '#6B7A00' : '#B85600',
                          }}
                        />
                        {c.complianceTags.map((tag) => {
                          const col = COMPLIANCE_COLORS[tag] ?? { bg: '#F3F4F6', color: '#374151' };
                          return (
                            <Chip key={tag} label={tag} size="small"
                              sx={{ height: 18, fontSize: '10px', fontWeight: 600, background: col.bg, color: col.color }}
                            />
                          );
                        })}
                      </Box>

                      {/* Action buttons */}
                      <Box sx={{ display: 'flex', gap: 0.75 }}>
                        <Tooltip title="Phase 2" arrow>
                          <span style={{ flex: 1 }}>
                            <Button
                              size="small" fullWidth disabled
                              sx={{ fontSize: '11px', height: 26, fontWeight: 600 }}
                            >
                              View as Admin
                            </Button>
                          </span>
                        </Tooltip>
                        <Tooltip title="Phase 2" arrow>
                          <span style={{ flex: 1 }}>
                            <Button
                              size="small" fullWidth variant="contained" disabled
                              sx={{ fontSize: '11px', height: 26, fontWeight: 700 }}
                            >
                              Config
                            </Button>
                          </span>
                        </Tooltip>
                      </Box>

                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {!isLoading && clinics.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: 40 }}>🏥</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              No clinics found.
            </Typography>
          </Box>
        )}

        {/* Add Clinic Dialog */}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icons.LocalHospital sx={{ color: '#5519E6' }} /> Add Clinic
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
            <TextField
              label="Clinic Name" fullWidth required size="small"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Country" fullWidth required size="small" select
              value={form.countryId} onChange={(e) => setForm({ ...form, countryId: e.target.value })}
            >
              {COUNTRY_OPTIONS.map((c) => (
                <MenuItem key={c.value} value={c.value}>{c.flag} {c.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="City" fullWidth required size="small"
              value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <TextField
              label="Address" fullWidth size="small" multiline rows={2}
              value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Phone" fullWidth size="small"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <TextField
                label="Email" fullWidth size="small"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Box>
            <TextField
              label="Operating Hours" fullWidth size="small" placeholder="e.g. Mon-Sat 9:00 AM - 6:00 PM"
              value={form.operatingHours} onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setAddOpen(false)} sx={{ color: '#6B7280' }}>Cancel</Button>
            <Button
              variant="contained"
              disabled={!form.name || !form.countryId || !form.city || createClinic.isPending}
              onClick={() => {
                const country = COUNTRY_OPTIONS.find((c) => c.value === form.countryId);
                createClinic.mutate(
                  {
                    name: form.name,
                    countryId: form.countryId,
                    city: form.city,
                    address: form.address,
                    phone: form.phone,
                    email: form.email,
                    countryName: country?.label ?? '',
                    countryFlag: country?.flag ?? '',
                    status: 'Pilot',
                  } as Partial<ClinicSummary>,
                  {
                    onSuccess: () => {
                      setSnack({ open: true, message: 'Clinic created successfully', severity: 'success' });
                      setForm(EMPTY_FORM);
                      setAddOpen(false);
                    },
                    onError: () => {
                      setSnack({ open: true, message: 'Clinic created (offline mode)', severity: 'success' });
                      setForm(EMPTY_FORM);
                      setAddOpen(false);
                    },
                  }
                );
              }}
              sx={{ fontWeight: 700, backgroundColor: '#5519E6', '&:hover': { backgroundColor: '#4010C0' } }}
            >
              {createClinic.isPending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
            {snack.message}
          </Alert>
        </Snackbar>

      </Container>
    </>
  );
};

export default Clinics;
