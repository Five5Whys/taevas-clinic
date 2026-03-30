import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useRoster, useUpdateRoles, useDeactivateDoctor } from '@/hooks/superadmin/useRoster';
import { useCountries } from '@/hooks/superadmin/useCountries';
import { DoctorRosterDto } from '@/types/superadmin';

// ─── Fallback Data ──────────────────────────────────────────────────────────────
const MOCK_DOCTORS: DoctorRosterDto[] = [
  { id:'1', firstName:'Rajesh', lastName:'Kumar',   email:'rajesh@example.com', phone:'+91-0000', systemId:'DR-IN-0001', country:'India',    countryFlag:'IN', roles:['DOCTOR','CLINIC_ADMIN'], speciality:'ENT',             clinic:'ENT Care Center',    registration:'NMC-12345' },
  { id:'2', firstName:'Priya',  lastName:'Menon',   email:'priya@example.com',  phone:'+91-0001', systemId:'DR-IN-0002', country:'India',    countryFlag:'IN', roles:['DOCTOR'],                speciality:'ENT',             clinic:'ENT Care Center',    registration:'NMC-12346' },
  { id:'3', firstName:'Somchai',lastName:'T.',      email:'somchai@example.com',phone:'+66-0000', systemId:'DR-TH-0001', country:'Thailand', countryFlag:'TH', roles:['DOCTOR','CLINIC_ADMIN'], speciality:'ENT',             clinic:'Bangkok ENT Center', registration:'MOPH-5678' },
  { id:'4', firstName:'Ahmed',  lastName:'Hassan',  email:'ahmed@example.com',  phone:'+960-000', systemId:'DR-MV-0001', country:'Maldives', countryFlag:'MV', roles:['DOCTOR','CLINIC_ADMIN'], speciality:'ENT',             clinic:'Male ENT Clinic',    registration:'MOH-9012' },
];

// ─── Style Mappings ─────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  'DOCTOR':       { bg: '#5519E615', color: '#5519E6' },
  'CLINIC_ADMIN': { bg: '#FF823215', color: '#B85600' },
  'SUPERADMIN':   { bg: '#F43F5E15', color: '#9F1239' },
};

const ALL_ROLES = ['DOCTOR', 'CLINIC_ADMIN', 'SUPERADMIN'];

// ─── Edit Roles Dialog ──────────────────────────────────────────────────────────
const EditRolesDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  doctor: DoctorRosterDto | null;
}> = ({ open, onClose, doctor }) => {
  const updateRoles = useUpdateRoles();
  const [roles, setRoles] = useState<string[]>([]);

  React.useEffect(() => {
    if (doctor) setRoles([...doctor.roles]);
  }, [doctor]);

  const toggleRole = (role: string) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = () => {
    if (!doctor || roles.length === 0) return;
    updateRoles.mutate(
      { id: doctor.id, roles },
      { onSuccess: () => onClose() }
    );
  };

  if (!doctor) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '16px' }}>
        Edit Roles — {doctor.firstName} {doctor.lastName}
      </DialogTitle>
      <DialogContent>
        <Typography variant="caption" sx={{ color: '#6B7280', mb: 2, display: 'block' }}>
          {doctor.systemId} · {doctor.clinic}
        </Typography>
        {ALL_ROLES.map((role) => (
          <FormControlLabel
            key={role}
            control={
              <Checkbox
                checked={roles.includes(role)}
                onChange={() => toggleRole(role)}
                size="small"
                sx={{ '&.Mui-checked': { color: '#5519E6' } }}
              />
            }
            label={<Typography sx={{ fontSize: '13px' }}>{role}</Typography>}
          />
        ))}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280', fontWeight: 600 }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={roles.length === 0 || updateRoles.isPending}
          onClick={handleSave}
          sx={{ background: '#5519E6', '&:hover': { background: '#4410C0' }, fontWeight: 700 }}
        >
          {updateRoles.isPending ? 'Saving...' : 'Save Roles'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────────
const GlobalRoster: React.FC = () => {
  const [search,  setSearch]  = useState('');
  const [country, setCountry] = useState('all');
  const [editDoctor, setEditDoctor] = useState<DoctorRosterDto | null>(null);

  // API hooks
  const { data: rosterData, isLoading } = useRoster({
    search: search || undefined,
    country: country !== 'all' ? country : undefined,
  });
  const { data: countriesData } = useCountries();
  const deactivateDoctor = useDeactivateDoctor();

  // Unwrap paginated response — API returns { content: [...] }, fallback is flat array
  const doctors: DoctorRosterDto[] = React.useMemo(() => {
    if (!rosterData) return MOCK_DOCTORS;
    if (Array.isArray(rosterData)) return rosterData;
    if ('content' in rosterData && Array.isArray((rosterData as any).content)) {
      return (rosterData as any).content;
    }
    return MOCK_DOCTORS;
  }, [rosterData]);

  const initials = (firstName: string, lastName: string) =>
    `${(firstName?.[0] ?? '').toUpperCase()}${(lastName?.[0] ?? '').toUpperCase()}`;

  const handleRemove = (d: DoctorRosterDto) => {
    const name = `${d.firstName} ${d.lastName}`;
    if (window.confirm(`Are you sure you want to deactivate ${name}?`)) {
      deactivateDoctor.mutate(d.id);
    }
  };

  return (
    <DashboardLayout pageTitle="Global Roster">
      <Container maxWidth="lg" sx={{ py: 2.5 }}>

        {/* Toolbar */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center' }}>
          <TextField
            size="small" placeholder="Search doctor, clinic, country, ID…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 16, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          <Select
            size="small" value={country} onChange={(e) => setCountry(e.target.value)}
            sx={{ minWidth: 160, fontSize: '13px' }}
          >
            <MenuItem value="all">All Countries</MenuItem>
            {countriesData?.map((c) => (
              <MenuItem key={c.id} value={c.name}>
                {c.flagEmoji} {c.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained" size="small"
            sx={{ background: '#5519E6', '&:hover': { background: '#4410C0' }, fontWeight: 700, whiteSpace: 'nowrap' }}
            onClick={() => alert('Add Doctor — coming soon')}
          >
            + Add Doctor
          </Button>
        </Box>

        {/* Count */}
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
          Showing {doctors.length} doctors
        </Typography>

        {/* Loading state */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} sx={{ color: '#5519E6' }} />
          </Box>
        )}

        {/* Roster list */}
        {!isLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {doctors.map((d) => {
              const name = `${d.firstName} ${d.lastName}`;
              return (
                <Box
                  key={d.id}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    px: 1.75, py: 1.25,
                    border: '1px solid #E5E7EB', borderRadius: 2,
                    background: '#fff',
                    '&:hover': { borderColor: '#5519E630', background: '#FAFAFA', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Avatar */}
                  <Box
                    sx={{
                      width: 36, height: 36, borderRadius: 1.5, flexShrink: 0,
                      background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 800, fontSize: '12px',
                    }}
                  >
                    {initials(d.firstName, d.lastName)}
                  </Box>

                  {/* Name + ID */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13.5px', whiteSpace: 'nowrap' }}>
                        {name}
                      </Typography>
                      <Box
                        sx={{
                          fontFamily: 'monospace', fontSize: '10px', px: 0.75, py: 0.25,
                          background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 0.75,
                          color: '#6B7280', flexShrink: 0,
                        }}
                      >
                        {d.systemId}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5, flexWrap: 'wrap' }}>
                      {d.roles.map((r) => {
                        const rc = ROLE_COLORS[r] ?? { bg: '#F3F4F6', color: '#374151' };
                        return (
                          <Chip key={r} label={r} size="small"
                            sx={{ background: rc.bg, color: rc.color, fontWeight: 700, fontSize: '10px', height: 18 }}
                          />
                        );
                      })}
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                        · {d.speciality} · {d.clinic}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                        · {d.country} · Reg: {d.registration}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                    <Button size="small" variant="outlined"
                      sx={{ fontSize: '11px', height: 26, px: 1.25, borderColor: '#E5E7EB', color: '#374151', minWidth: 0 }}
                      onClick={() => setEditDoctor(d)}
                    >
                      Edit Roles
                    </Button>
                    <Button size="small"
                      sx={{
                        fontSize: '11px', height: 26, px: 1.25, minWidth: 0,
                        color: '#F43F5E', background: '#FFF1F2', border: '1px solid #FCA5A5',
                        '&:hover': { background: '#FFE4E6' },
                      }}
                      disabled={deactivateDoctor.isPending}
                      onClick={() => handleRemove(d)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {!isLoading && doctors.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No doctors match your search criteria.
            </Typography>
          </Box>
        )}

        <EditRolesDialog
          open={!!editDoctor}
          onClose={() => setEditDoctor(null)}
          doctor={editDoctor}
        />

      </Container>
    </DashboardLayout>
  );
};

export default GlobalRoster;
