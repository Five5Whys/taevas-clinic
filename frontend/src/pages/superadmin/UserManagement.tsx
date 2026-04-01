import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
// DashboardLayout provided by parent Manage page
import { useCountries } from '@/hooks/superadmin/useCountries';

const BRAND = '#5519E6';
const SUB = '#6B7280';
const BORDER = '#E5E7EB';

const FALLBACK_TENANTS = [
  { code: '+91', country: 'India', maxLen: 10, status: 'ACTIVE' as const },
  { code: '+66', country: 'Thailand', maxLen: 9, status: 'ACTIVE' as const },
  { code: '+960', country: 'Maldives', maxLen: 7, status: 'INACTIVE' as const },
];

type RoleType = 'CLINIC_ADMIN' | 'DOCTOR' | 'PATIENT' | 'NURSE' | 'ASSISTANT';


const ROLE_OPTIONS: { value: RoleType; label: string; icon: string; color: string }[] = [
  { value: 'CLINIC_ADMIN', label: 'Clinic Admin', icon: '\u{1F3E5}', color: '#FF8232' },
  { value: 'DOCTOR', label: 'Doctor', icon: '\u{1FA7A}', color: '#5519E6' },
  { value: 'PATIENT', label: 'Patient', icon: '\u{1F464}', color: '#3B82F6' },
  { value: 'NURSE', label: 'Nurse', icon: '\u{1F469}\u{200D}\u{2695}\u{FE0F}', color: '#10B981' },
  { value: 'ASSISTANT', label: 'Assistant', icon: '\u{1F4CB}', color: '#8B5CF6' },
];

const CLINICS = [
  { id: 'clinic-pune-001', name: 'ENT Care Center, Pune' },
  { id: 'clinic-mumbai-002', name: 'Apollo ENT, Mumbai' },
  { id: 'clinic-bangkok-001', name: 'Bangkok ENT Clinic' },
  { id: 'clinic-male-001', name: 'Male Health Center' },
];

interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  clinicId: string;
  clinicName: string;
  roles: RoleType[];
  status: 'ACTIVE' | 'INVITED' | 'INACTIVE';
  createdAt: string;
}

const INITIAL_USERS: MockUser[] = [
  { id: 'u-001', firstName: 'Sunita', lastName: 'Rao', phone: '+919876543211', email: 'sunita@entcare.in', clinicId: 'clinic-pune-001', clinicName: 'ENT Care Center, Pune', roles: ['CLINIC_ADMIN'], status: 'ACTIVE', createdAt: '2026-03-15' },
  { id: 'u-002', firstName: 'Dr. Rajesh', lastName: 'Kumar', phone: '+919876543212', email: 'rajesh@entcare.in', clinicId: 'clinic-pune-001', clinicName: 'ENT Care Center, Pune', roles: ['DOCTOR'], status: 'ACTIVE', createdAt: '2026-03-16' },
  { id: 'u-003', firstName: 'Anita', lastName: 'Sharma', phone: '+919876543213', email: 'anita@gmail.com', clinicId: 'clinic-pune-001', clinicName: 'ENT Care Center, Pune', roles: ['PATIENT'], status: 'ACTIVE', createdAt: '2026-03-18' },
  { id: 'u-004', firstName: 'Meera', lastName: 'Nair', phone: '+919876543214', email: 'meera@entcare.in', clinicId: 'clinic-pune-001', clinicName: 'ENT Care Center, Pune', roles: ['NURSE', 'ASSISTANT'], status: 'ACTIVE', createdAt: '2026-03-20' },
  { id: 'u-005', firstName: 'Priya', lastName: 'Das', phone: '+919876543215', email: '', clinicId: '', clinicName: '', roles: [], status: 'INVITED', createdAt: '2026-03-28' },
];

const DIAL_MAX: Record<string, number> = { '+91': 10, '+66': 9, '+960': 7, '+94': 9, '+880': 10, '+971': 9, '+20': 10, '+977': 10, '+65': 8, '+60': 10 };

const UserManagement: React.FC = () => {
  const { data: countriesData } = useCountries();
  const TENANTS = React.useMemo(() => {
    if (!countriesData || !Array.isArray(countriesData)) return FALLBACK_TENANTS.filter(t => t.status === 'ACTIVE');
    return countriesData
      .filter((c: any) => c.status === 'ACTIVE')
      .map((c: any) => ({ code: c.dialCode || `+${c.code}`, country: c.name, maxLen: DIAL_MAX[c.dialCode] || 10, status: c.status }));
  }, [countriesData]);

  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [alertMsg, setAlertMsg] = useState('');

  // Create user form
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newTenant, setNewTenant] = useState('+91');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newClinic, setNewClinic] = useState('');
  const [newRoles, setNewRoles] = useState<RoleType[]>([]);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  // Assign form
  const [editRoles, setEditRoles] = useState<RoleType[]>([]);
  const [editClinic, setEditClinic] = useState('');

  const selectedTenant = TENANTS.find(t => t.code === newTenant) || TENANTS[0] || { code: '+91', country: 'India', maxLen: 10, status: 'ACTIVE' as const };
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhoneValid = newPhone.length === 0 || newPhone.length === selectedTenant.maxLen;
  const isEmailValid = newEmail.length === 0 || isValidEmail(newEmail);
  const hasPhone = newPhone.length === selectedTenant.maxLen;
  const hasEmail = isValidEmail(newEmail);
  const isCreateValid = newFirstName.trim().length > 0 && (hasPhone || hasEmail) && isPhoneValid && isEmailValid;

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.phone} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggleNewRole = (role: RoleType) => {
    setNewRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const handleCreateUser = () => {
    if (!isCreateValid) return;
    const clinic = CLINICS.find(c => c.id === newClinic);
    const newUser: MockUser = {
      id: `u-${Date.now()}`,
      firstName: newFirstName,
      lastName: newLastName,
      phone: hasPhone ? `${newTenant}${newPhone}` : '',
      email: newEmail,
      clinicId: newClinic,
      clinicName: clinic?.name || '',
      roles: newRoles,
      status: newRoles.length > 0 && newClinic ? 'ACTIVE' : 'INVITED',
      createdAt: new Date().toISOString().split('T')[0]!,
    };
    setUsers(prev => [newUser, ...prev]);
    resetCreateForm();
    const roleLabels = newRoles.map(r => ROLE_OPTIONS.find(o => o.value === r)?.label || r).join(', ');
    setAlertMsg(`Account created for ${newFirstName}.${roleLabels ? ` Assigned as ${roleLabels}${clinic ? ` @ ${clinic.name}` : ''}.` : ''} Invite sent.`);
  };

  const resetCreateForm = () => {
    setCreateOpen(false);
    setNewFirstName(''); setNewLastName(''); setNewPhone(''); setNewEmail(''); setNewTenant('+91');
    setNewClinic(''); setNewRoles([]);
    setPhoneTouched(false); setEmailTouched(false);
  };

  const handleSaveRoles = () => {
    if (!selectedUser) return;
    const clinic = CLINICS.find(c => c.id === editClinic);
    const updatedUser: MockUser = {
      ...selectedUser,
      roles: editRoles,
      clinicId: editClinic,
      clinicName: clinic?.name || '',
      status: editRoles.length > 0 ? 'ACTIVE' : 'INVITED',
    };
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? updatedUser : u));
    setSelectedUser(updatedUser);
    setAssignOpen(false);
    const roleLabels = editRoles.map(r => ROLE_OPTIONS.find(o => o.value === r)?.label || r).join(', ');
    setAlertMsg(`${selectedUser.firstName} updated — ${roleLabels || 'No roles'}${clinic ? ` @ ${clinic.name}` : ''}`);
  };

  const toggleRole = (role: RoleType) => {
    setEditRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const getRoleChip = (role: RoleType) => {
    const r = ROLE_OPTIONS.find(o => o.value === role);
    if (!r) return null;
    return <Chip label={`${r.icon} ${r.label}`} size="small" sx={{ background: `${r.color}15`, color: r.color, fontWeight: 700, fontSize: '10px', height: 22 }} />;
  };

  const getStatusChip = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      ACTIVE: { bg: '#CDDC5020', color: '#6B7A00' },
      INVITED: { bg: '#FF823220', color: '#B85600' },
      INACTIVE: { bg: '#F43F5E15', color: '#9F1239' },
    };
    const c = colors[status] || colors['INACTIVE']!;
    return <Chip label={status} size="small" sx={{ background: c.bg, color: c.color, fontWeight: 700, fontSize: '10px', height: 20 }} />;
  };

  return (
    <>
      <Box sx={{ px: 3, py: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Users</Typography>
            <Typography variant="body2" sx={{ color: SUB }}>{users.length} total &middot; {users.filter(u => u.status === 'ACTIVE').length} active</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setCreateOpen(true)}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}
          >
            + Create User
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth size="small" placeholder="Search by name, phone, or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        {/* Table */}
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#F8F9FA' }}>
                  {['Name', 'Phone', 'Email', 'Roles', 'Clinic', 'Status', 'Created', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '11px', color: SUB, py: 1.25 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(u => (
                  <TableRow key={u.id} sx={{ '&:hover': { background: '#F8F9FC' } }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>{u.firstName} {u.lastName}</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: SUB }}>{u.phone || '\u2014'}</TableCell>
                    <TableCell sx={{ fontSize: '12px', color: SUB }}>{u.email || '\u2014'}</TableCell>
                    <TableCell>
                      {u.roles.length === 0 ? (
                        <Chip label="Unassigned" size="small" sx={{ background: '#F3F4F6', color: SUB, fontWeight: 600, fontSize: '10px', height: 22 }} />
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {u.roles.map(role => getRoleChip(role))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontSize: '11px', color: SUB }}>{u.clinicName || '\u2014'}</TableCell>
                    <TableCell>{getStatusChip(u.status)}</TableCell>
                    <TableCell sx={{ fontSize: '11px', color: SUB }}>{u.createdAt}</TableCell>
                    <TableCell>
                      <Tooltip title="Manage Roles" arrow>
                        <Button
                          size="small" variant="outlined"
                          onClick={() => { setSelectedUser(u); setEditRoles([...u.roles]); setEditClinic(u.clinicId); setAssignOpen(true); }}
                          sx={{ fontSize: '10px', textTransform: 'none', fontWeight: 600, borderColor: BORDER, color: BRAND, minWidth: 0, px: 1 }}
                        >
                          Roles
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onClose={resetCreateForm} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <Typography variant="body2" sx={{ color: SUB }}>
            User will receive an invite via SMS/Email ID with a default password. They must change it on first login.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField fullWidth size="small" label="First Name *" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} />
            <TextField fullWidth size="small" label="Last Name" value={newLastName} onChange={e => setNewLastName(e.target.value)} />
          </Box>

          {/* Tenant (country) */}
          <FormControl fullWidth size="small">
            <InputLabel>Active Tenants *</InputLabel>
            <Select
              value={newTenant} label="Active Tenants *"
              onChange={e => { setNewTenant(e.target.value); setNewPhone(''); setPhoneTouched(false); }}
            >
              {TENANTS.map(t => (
                <MenuItem key={t.code} value={t.code}>{t.country} ({t.code})</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Phone with tenant-based validation */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              disabled size="small" value={selectedTenant.code}
              sx={{ width: 72, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <TextField
              fullWidth size="small"
              label="Phone Number"
              placeholder={`Enter ${selectedTenant.maxLen}-digit ${selectedTenant.country} number`}
              value={newPhone}
              onChange={e => { setNewPhone(e.target.value.replace(/\D/g, '').slice(0, selectedTenant.maxLen)); setPhoneTouched(true); }}
              onBlur={() => setPhoneTouched(true)}
              error={phoneTouched && newPhone.length > 0 && newPhone.length !== selectedTenant.maxLen}
              helperText={phoneTouched && newPhone.length > 0 && newPhone.length !== selectedTenant.maxLen ? `Enter a valid ${selectedTenant.maxLen}-digit ${selectedTenant.country} number` : ''}
            />
          </Box>

          {/* Email with validation */}
          <TextField
            fullWidth size="small" label="Email ID" type="email"
            value={newEmail}
            onChange={e => { setNewEmail(e.target.value); setEmailTouched(true); }}
            onBlur={() => setEmailTouched(true)}
            placeholder="user@example.com"
            error={emailTouched && newEmail.length > 0 && !isValidEmail(newEmail)}
            helperText={emailTouched && newEmail.length > 0 && !isValidEmail(newEmail) ? 'Enter a valid email address' : ''}
          />

          {/* Hint */}
          <Typography sx={{ fontSize: '10px', color: '#E65100' }}>
            Phone or Email ID is mandatory (at least one)
          </Typography>

          {/* Divider */}
          <Box sx={{ borderTop: `1px solid ${BORDER}`, pt: 1 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
              Assign Role (optional)
            </Typography>

            {/* Clinic */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Clinic</InputLabel>
              <Select value={newClinic} label="Clinic" onChange={e => { setNewClinic(e.target.value); if (!e.target.value) setNewRoles([]); }}>
                <MenuItem value="">— Select clinic —</MenuItem>
                {CLINICS.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Role chips — enabled only after clinic selected */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, opacity: newClinic ? 1 : 0.4, pointerEvents: newClinic ? 'auto' : 'none' }}>
              {ROLE_OPTIONS.map(r => {
                const selected = newRoles.includes(r.value);
                return (
                  <Chip
                    key={r.value}
                    label={`${r.icon} ${r.label}`}
                    onClick={() => toggleNewRole(r.value)}
                    sx={{
                      fontWeight: 700, fontSize: '12px', height: 32, cursor: 'pointer',
                      background: selected ? `${r.color}20` : '#F3F4F6',
                      color: selected ? r.color : SUB,
                      border: selected ? `2px solid ${r.color}` : '2px solid transparent',
                      '&:hover': { background: `${r.color}15` },
                    }}
                  />
                );
              })}
            </Box>
            {!newClinic && (
              <Typography sx={{ fontSize: '10px', color: '#9CA3AF', mt: 0.75 }}>
                Select a clinic to enable role assignment
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetCreateForm} sx={{ color: SUB, textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained" onClick={handleCreateUser}
            disabled={!isCreateValid}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}
          >
            Create & Send Invite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage Roles Dialog — multi roles, single clinic */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Manage Roles
          {selectedUser && <Typography variant="body2" sx={{ color: SUB }}>{selectedUser.firstName} {selectedUser.lastName}</Typography>}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
          {/* Clinic selector */}
          <FormControl fullWidth size="small">
            <InputLabel>Clinic *</InputLabel>
            <Select value={editClinic} label="Clinic *" onChange={e => setEditClinic(e.target.value)}>
              {CLINICS.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Role toggles */}
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
              Roles (select one or more)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {ROLE_OPTIONS.map(r => {
                const selected = editRoles.includes(r.value);
                return (
                  <Chip
                    key={r.value}
                    label={`${r.icon} ${r.label}`}
                    onClick={() => toggleRole(r.value)}
                    sx={{
                      fontWeight: 700, fontSize: '12px', height: 32, cursor: 'pointer',
                      background: selected ? `${r.color}20` : '#F3F4F6',
                      color: selected ? r.color : SUB,
                      border: selected ? `2px solid ${r.color}` : '2px solid transparent',
                      '&:hover': { background: `${r.color}15` },
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAssignOpen(false)} sx={{ color: SUB, textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained" onClick={handleSaveRoles}
            disabled={editRoles.length === 0 || !editClinic}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={!!alertMsg} autoHideDuration={4000} onClose={() => setAlertMsg('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setAlertMsg('')} sx={{ fontWeight: 600 }}>{alertMsg}</Alert>
      </Snackbar>
    </>
  );
};

export default UserManagement;
