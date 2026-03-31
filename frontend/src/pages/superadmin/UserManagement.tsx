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
import DashboardLayout from '@/components/layout/DashboardLayout';

const BRAND = '#5519E6';
const SUB = '#6B7280';
const BORDER = '#E5E7EB';

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
  role: RoleType | '';
  clinicId: string;
  clinicName: string;
  status: 'ACTIVE' | 'INVITED' | 'INACTIVE';
  createdAt: string;
}

const INITIAL_USERS: MockUser[] = [
  { id: 'u-001', firstName: 'Sunita', lastName: 'Rao', phone: '+919876543211', email: 'sunita@entcare.in', role: 'CLINIC_ADMIN', clinicId: 'clinic-pune-001', clinicName: 'ENT Care Center, Pune', status: 'ACTIVE', createdAt: '2026-03-15' },
  { id: 'u-002', firstName: 'Dr. Rajesh', lastName: 'Kumar', phone: '+919876543212', email: 'rajesh@entcare.in', role: 'DOCTOR', clinicId: 'clinic-pune-001', clinicName: 'ENT Care Center, Pune', status: 'ACTIVE', createdAt: '2026-03-16' },
  { id: 'u-003', firstName: 'Anita', lastName: 'Sharma', phone: '+919876543213', email: 'anita@gmail.com', role: 'PATIENT', clinicId: 'clinic-pune-001', clinicName: 'ENT Care Center, Pune', status: 'ACTIVE', createdAt: '2026-03-18' },
  { id: 'u-004', firstName: 'Meera', lastName: 'Nair', phone: '+919876543214', email: 'meera@entcare.in', role: 'NURSE', clinicId: 'clinic-pune-001', clinicName: 'ENT Care Center, Pune', status: 'ACTIVE', createdAt: '2026-03-20' },
  { id: 'u-005', firstName: 'Priya', lastName: 'Das', phone: '+919876543215', email: '', role: '', clinicId: '', clinicName: '', status: 'INVITED', createdAt: '2026-03-28' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [alertMsg, setAlertMsg] = useState('');

  // Create user form
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Assign form
  const [assignRole, setAssignRole] = useState<RoleType | ''>('');
  const [assignClinic, setAssignClinic] = useState('');

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.phone} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = () => {
    if (!newFirstName.trim() || (!newPhone.trim() && !newEmail.trim())) return;
    const newUser: MockUser = {
      id: `u-${Date.now()}`,
      firstName: newFirstName,
      lastName: newLastName,
      phone: newPhone,
      email: newEmail,
      role: '',
      clinicId: '',
      clinicName: '',
      status: 'INVITED',
      createdAt: new Date().toISOString().split('T')[0]!,
    };
    setUsers(prev => [newUser, ...prev]);
    setCreateOpen(false);
    setNewFirstName(''); setNewLastName(''); setNewPhone(''); setNewEmail('');
    setAlertMsg(`Account created for ${newFirstName}. Invite sent with default password.`);
  };

  const handleAssign = () => {
    if (!selectedUser || !assignRole) return;
    const clinic = CLINICS.find(c => c.id === assignClinic);
    setUsers(prev => prev.map(u =>
      u.id === selectedUser.id
        ? { ...u, role: assignRole, clinicId: assignClinic, clinicName: clinic?.name || '', status: 'ACTIVE' as const }
        : u
    ));
    setAssignOpen(false);
    setSelectedUser(null);
    setAssignRole('');
    setAssignClinic('');
    setAlertMsg(`${selectedUser.firstName} assigned as ${assignRole}${clinic ? ` at ${clinic.name}` : ''}`);
  };

  const getRoleChip = (role: string) => {
    const r = ROLE_OPTIONS.find(o => o.value === role);
    if (!r) return <Chip label="Unassigned" size="small" sx={{ background: '#F3F4F6', color: SUB, fontWeight: 600, fontSize: '10px', height: 22 }} />;
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
                  {['Name', 'Phone', 'Email', 'Role', 'Clinic', 'Status', 'Created', 'Actions'].map(h => (
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
                    <TableCell>{getRoleChip(u.role)}</TableCell>
                    <TableCell sx={{ fontSize: '11px', color: SUB }}>{u.clinicName || '\u2014'}</TableCell>
                    <TableCell>{getStatusChip(u.status)}</TableCell>
                    <TableCell sx={{ fontSize: '11px', color: SUB }}>{u.createdAt}</TableCell>
                    <TableCell>
                      <Tooltip title="Assign Role & Clinic" arrow>
                        <Button
                          size="small" variant="outlined"
                          onClick={() => { setSelectedUser(u); setAssignRole(u.role as RoleType || ''); setAssignClinic(u.clinicId); setAssignOpen(true); }}
                          sx={{ fontSize: '10px', textTransform: 'none', fontWeight: 600, borderColor: BORDER, color: BRAND, minWidth: 0, px: 1 }}
                        >
                          Assign
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
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <Typography variant="body2" sx={{ color: SUB }}>
            User will receive an invite via SMS/email with a default password. They must change it on first login.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField fullWidth size="small" label="First Name *" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} />
            <TextField fullWidth size="small" label="Last Name" value={newLastName} onChange={e => setNewLastName(e.target.value)} />
          </Box>
          <TextField fullWidth size="small" label="Phone Number" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+91XXXXXXXXXX" />
          <TextField fullWidth size="small" label="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="user@example.com" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateOpen(false)} sx={{ color: SUB, textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained" onClick={handleCreateUser}
            disabled={!newFirstName.trim() || (!newPhone.trim() && !newEmail.trim())}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}
          >
            Create & Send Invite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Role + Clinic Dialog */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Assign Role & Clinic
          {selectedUser && <Typography variant="body2" sx={{ color: SUB }}>{selectedUser.firstName} {selectedUser.lastName}</Typography>}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <FormControl fullWidth size="small">
            <InputLabel>Role *</InputLabel>
            <Select value={assignRole} label="Role *" onChange={e => setAssignRole(e.target.value as RoleType)}>
              {ROLE_OPTIONS.map(r => (
                <MenuItem key={r.value} value={r.value}>
                  {r.icon} {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Clinic</InputLabel>
            <Select value={assignClinic} label="Clinic" onChange={e => setAssignClinic(e.target.value)}>
              <MenuItem value="">No clinic (global)</MenuItem>
              {CLINICS.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAssignOpen(false)} sx={{ color: SUB, textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained" onClick={handleAssign}
            disabled={!assignRole}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}
          >
            Assign
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

export default UserManagement;
