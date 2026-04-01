import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Chip,
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
  CircularProgress,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStaffList, useCreateStaff, useUpdateStaff } from '@/hooks/clinicadmin/useStaff';

const BRAND = '#5519E6';
const SUB = '#6B7280';
const BORDER = '#E5E7EB';

// Phone validation: India +91, 10 digits
const PHONE_CODE = '+91';
const PHONE_MAX_LEN = 10;

type RoleType = 'DOCTOR' | 'NURSE' | 'ASSISTANT' | 'PATIENT';

const ROLE_OPTIONS: { value: RoleType; label: string; icon: string; color: string }[] = [
  { value: 'DOCTOR', label: 'Doctor', icon: '\u{1FA7A}', color: '#5519E6' },
  { value: 'NURSE', label: 'Nurse', icon: '\u{1F469}\u{200D}\u{2695}\u{FE0F}', color: '#10B981' },
  { value: 'ASSISTANT', label: 'Assistant', icon: '\u{1F4CB}', color: '#8B5CF6' },
  { value: 'PATIENT', label: 'Patient', icon: '\u{1F464}', color: '#3B82F6' },
];

interface ClinicUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roles: RoleType[];
  status: 'ACTIVE' | 'INVITED' | 'INACTIVE';
  createdAt: string;
}

const FALLBACK_STAFF: ClinicUser[] = [
  { id: 'S-001', firstName: 'Dr. Meera', lastName: 'Kapoor', phone: '+919876500010', email: 'meera.kapoor@clinic.com', roles: ['DOCTOR'], status: 'ACTIVE', createdAt: '2026-03-01' },
  { id: 'S-002', firstName: 'Sanjay', lastName: 'Reddy', phone: '+919876500011', email: 'sanjay.r@clinic.com', roles: ['NURSE'], status: 'ACTIVE', createdAt: '2026-03-05' },
  { id: 'S-003', firstName: 'Neha', lastName: 'Gupta', phone: '+919876500012', email: 'neha.g@clinic.com', roles: ['ASSISTANT'], status: 'ACTIVE', createdAt: '2026-03-10' },
  { id: 'S-004', firstName: 'Dr. Arjun', lastName: 'Nair', phone: '+919876500013', email: '', roles: ['DOCTOR'], status: 'INVITED', createdAt: '2026-03-20' },
  { id: 'S-005', firstName: 'Priya', lastName: 'Menon', phone: '+919876500014', email: 'priya.m@clinic.com', roles: ['NURSE', 'ASSISTANT'], status: 'ACTIVE', createdAt: '2026-02-15' },
];

const StaffManagement: React.FC = () => {
  const { data: usersData = [], isLoading, isError } = useStaffList();
  const isMock = localStorage.getItem('authToken') === 'mock-jwt-token-for-dev-only';
  const [localStaff, setLocalStaff] = useState<ClinicUser[]>([]);
  const raw = Array.isArray(usersData) && usersData.length > 0 ? usersData : (isError || isMock) ? FALLBACK_STAFF : usersData;
  const users: ClinicUser[] = [...raw, ...localStaff];
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ClinicUser | null>(null);
  const [alertMsg, setAlertMsg] = useState('');

  // Create user form
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRoles, setNewRoles] = useState<RoleType[]>([]);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  // Assign form
  const [editRoles, setEditRoles] = useState<RoleType[]>([]);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhoneValid = newPhone.length === 0 || newPhone.length === PHONE_MAX_LEN;
  const isEmailValid = newEmail.length === 0 || isValidEmail(newEmail);
  const hasPhone = newPhone.length === PHONE_MAX_LEN;
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
    const payload = {
      firstName: newFirstName,
      lastName: newLastName,
      phone: hasPhone ? `${PHONE_CODE}${newPhone}` : '',
      email: newEmail,
      roles: newRoles,
    };

    if (isMock) {
      // In mock auth mode, add locally since API will fail
      const newUser: ClinicUser = {
        id: `S-LOCAL-${Date.now()}`,
        firstName: newFirstName,
        lastName: newLastName,
        phone: payload.phone,
        email: newEmail,
        roles: newRoles,
        status: 'INVITED',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setLocalStaff(prev => [...prev, newUser]);
      const roleLabels = newRoles.map(r => ROLE_OPTIONS.find(o => o.value === r)?.label || r).join(', ');
      resetCreateForm();
      setAlertMsg(`Account created for ${newFirstName}.${roleLabels ? ` Assigned as ${roleLabels}.` : ''} Invite sent.`);
      return;
    }

    createStaff.mutate(payload, {
      onSuccess: () => {
        resetCreateForm();
        const roleLabels = newRoles.map(r => ROLE_OPTIONS.find(o => o.value === r)?.label || r).join(', ');
        setAlertMsg(`Account created for ${newFirstName}.${roleLabels ? ` Assigned as ${roleLabels}.` : ''} Invite sent.`);
      },
      onError: () => setAlertMsg('Failed to create user.'),
    });
  };

  const resetCreateForm = () => {
    setCreateOpen(false);
    setNewFirstName(''); setNewLastName(''); setNewPhone(''); setNewEmail('');
    setNewRoles([]);
    setPhoneTouched(false); setEmailTouched(false);
  };

  const handleSaveRoles = () => {
    if (!selectedUser) return;
    updateStaff.mutate({ id: selectedUser.id, data: { roles: editRoles } }, {
      onSuccess: () => {
        setAssignOpen(false);
        const roleLabels = editRoles.map(r => ROLE_OPTIONS.find(o => o.value === r)?.label || r).join(', ');
        setAlertMsg(`${selectedUser.firstName} updated — ${roleLabels || 'No roles'}`);
      },
      onError: () => setAlertMsg('Failed to update roles.'),
    });
  };

  const toggleRole = (role: RoleType) => {
    setEditRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const getRoleChip = (role: RoleType) => {
    const r = ROLE_OPTIONS.find(o => o.value === role);
    if (!r) return null;
    return <Chip key={role} label={`${r.icon} ${r.label}`} size="small" sx={{ background: `${r.color}15`, color: r.color, fontWeight: 700, fontSize: '10px', height: 22 }} />;
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
    <DashboardLayout pageTitle="User Management">
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
            + Add User
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth size="small" placeholder="Search by name, phone, or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        {/* Table */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: BRAND }} />
          </Box>
        ) : (
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#F8F9FA' }}>
                  {['Name', 'Phone', 'Email', 'Roles', 'Status', 'Created', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '11px', color: SUB, py: 1.25 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: SUB }}>No users found.</TableCell>
                  </TableRow>
                ) : filtered.map(u => (
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
                    <TableCell>{getStatusChip(u.status)}</TableCell>
                    <TableCell sx={{ fontSize: '11px', color: SUB }}>{u.createdAt}</TableCell>
                    <TableCell>
                      <Tooltip title="Manage Roles" arrow>
                        <Button
                          size="small" variant="outlined"
                          onClick={() => { setSelectedUser(u); setEditRoles([...u.roles]); setAssignOpen(true); }}
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
        )}
      </Box>

      {/* Add User Dialog */}
      <Dialog open={createOpen} onClose={resetCreateForm} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <Typography variant="body2" sx={{ color: SUB }}>
            User will receive an invite via SMS/Email with a default password. They must change it on first login.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField fullWidth size="small" label="First Name *" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} />
            <TextField fullWidth size="small" label="Last Name" value={newLastName} onChange={e => setNewLastName(e.target.value)} />
          </Box>

          {/* Phone with +91 India validation */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              disabled size="small" value={PHONE_CODE}
              sx={{ width: 72, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <TextField
              fullWidth size="small"
              label="Phone Number"
              placeholder={`Enter ${PHONE_MAX_LEN}-digit number`}
              value={newPhone}
              onChange={e => { setNewPhone(e.target.value.replace(/\D/g, '').slice(0, PHONE_MAX_LEN)); setPhoneTouched(true); }}
              onBlur={() => setPhoneTouched(true)}
              error={phoneTouched && newPhone.length > 0 && newPhone.length !== PHONE_MAX_LEN}
              helperText={phoneTouched && newPhone.length > 0 && newPhone.length !== PHONE_MAX_LEN ? `Enter a valid ${PHONE_MAX_LEN}-digit number` : ''}
            />
          </Box>

          {/* Email with validation */}
          <TextField
            fullWidth size="small" label="Email" type="email"
            value={newEmail}
            onChange={e => { setNewEmail(e.target.value); setEmailTouched(true); }}
            onBlur={() => setEmailTouched(true)}
            placeholder="user@example.com"
            error={emailTouched && newEmail.length > 0 && !isValidEmail(newEmail)}
            helperText={emailTouched && newEmail.length > 0 && !isValidEmail(newEmail) ? 'Enter a valid email address' : ''}
          />

          {/* Hint */}
          <Typography sx={{ fontSize: '10px', color: '#E65100' }}>
            Phone or Email is mandatory (at least one)
          </Typography>

          {/* Role assignment */}
          <Box sx={{ borderTop: `1px solid ${BORDER}`, pt: 1 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
              Assign Role (optional)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetCreateForm} sx={{ color: SUB, textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained" onClick={handleCreateUser}
            disabled={!isCreateValid}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}
          >
            Add & Send Invite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage Roles Dialog */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Manage Roles
          {selectedUser && <Typography variant="body2" sx={{ color: SUB }}>{selectedUser.firstName} {selectedUser.lastName}</Typography>}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
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
            disabled={editRoles.length === 0}
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
    </DashboardLayout>
  );
};

export default StaffManagement;
