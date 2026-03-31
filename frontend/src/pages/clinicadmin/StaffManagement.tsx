import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const BRAND = '#5519E6';
const SUB = '#6B7280';
const BORDER = '#E5E7EB';

type StaffRole = 'DOCTOR' | 'NURSE' | 'ASSISTANT';
type StaffStatus = 'ACTIVE' | 'INACTIVE';

interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  specialization: string;
  phone: string;
  email: string;
  status: StaffStatus;
}

const ROLE_COLORS: Record<StaffRole, string> = {
  DOCTOR: '#5519E6',
  NURSE: '#10B981',
  ASSISTANT: '#8B5CF6',
};

const INITIAL_STAFF: StaffMember[] = [
  { id: 's-001', name: 'Dr. Rajesh Kumar', role: 'DOCTOR', specialization: 'ENT Specialist', phone: '+919876543212', email: 'rajesh@entcare.in', status: 'ACTIVE' },
  { id: 's-002', name: 'Dr. Meena Iyer', role: 'DOCTOR', specialization: 'ENT Surgeon', phone: '+919876543220', email: 'meena@entcare.in', status: 'ACTIVE' },
  { id: 's-003', name: 'Meera Nair', role: 'NURSE', specialization: 'General', phone: '+919876543214', email: 'meera@entcare.in', status: 'ACTIVE' },
  { id: 's-004', name: 'Priya Sharma', role: 'NURSE', specialization: 'ICU', phone: '+919876543221', email: 'priya@entcare.in', status: 'ACTIVE' },
  { id: 's-005', name: 'Amit Das', role: 'ASSISTANT', specialization: 'Front Desk', phone: '+919876543222', email: 'amit@entcare.in', status: 'ACTIVE' },
  { id: 's-006', name: 'Kavita Joshi', role: 'ASSISTANT', specialization: 'Lab', phone: '+919876543223', email: '', status: 'INACTIVE' },
];

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  // Add staff form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<StaffRole | ''>('');
  const [newSpecialization, setNewSpecialization] = useState('');

  const filtered = staff.filter(s =>
    `${s.name} ${s.role} ${s.specialization} ${s.phone} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleChip = (role: StaffRole) => {
    const color = ROLE_COLORS[role];
    return (
      <Chip
        label={role}
        size="small"
        sx={{ background: `${color}15`, color, fontWeight: 700, fontSize: '10px', height: 22 }}
      />
    );
  };

  const getStatusChip = (status: StaffStatus) => {
    const isActive = status === 'ACTIVE';
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          background: isActive ? '#10B98115' : '#F43F5E15',
          color: isActive ? '#047857' : '#9F1239',
          fontWeight: 700,
          fontSize: '10px',
          height: 20,
        }}
      />
    );
  };

  const resetAddForm = () => {
    setAddOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewRole('');
    setNewSpecialization('');
  };

  const handleAddStaff = () => {
    if (!newName.trim() || !newRole) return;
    const newStaff: StaffMember = {
      id: `s-${Date.now()}`,
      name: newName,
      role: newRole,
      specialization: newSpecialization,
      phone: newPhone,
      email: newEmail,
      status: 'ACTIVE',
    };
    setStaff(prev => [newStaff, ...prev]);
    resetAddForm();
    setAlertMsg(`${newName} added as ${newRole} successfully.`);
  };

  return (
    <DashboardLayout pageTitle="Staff Management">
      <Box sx={{ px: 3, py: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Staff</Typography>
            <Typography variant="body2" sx={{ color: SUB }}>
              {staff.length} total &middot; {staff.filter(s => s.status === 'ACTIVE').length} active
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setAddOpen(true)}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}
          >
            + Add Staff
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth size="small" placeholder="Search by name, role, specialization, phone, or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        {/* Table */}
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#F8F9FA' }}>
                  {['Name', 'Role', 'Specialization', 'Phone', 'Email', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '11px', color: SUB, py: 1.25 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(s => (
                  <TableRow key={s.id} sx={{ '&:hover': { background: '#F8F9FC' } }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>{s.name}</TableCell>
                    <TableCell>{getRoleChip(s.role)}</TableCell>
                    <TableCell sx={{ fontSize: '12px', color: SUB }}>{s.specialization}</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: SUB }}>{s.phone}</TableCell>
                    <TableCell sx={{ fontSize: '12px', color: SUB }}>{s.email || '\u2014'}</TableCell>
                    <TableCell>{getStatusChip(s.status)}</TableCell>
                    <TableCell>
                      <Button
                        size="small" variant="outlined"
                        sx={{ fontSize: '10px', textTransform: 'none', fontWeight: 600, borderColor: BORDER, color: BRAND, minWidth: 0, px: 1 }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Add Staff Dialog */}
      <Dialog open={addOpen} onClose={resetAddForm} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Staff</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField fullWidth size="small" label="Name *" value={newName} onChange={e => setNewName(e.target.value)} />
          <TextField fullWidth size="small" label="Phone" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
          <TextField fullWidth size="small" label="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
          <FormControl fullWidth size="small">
            <InputLabel>Role *</InputLabel>
            <Select
              value={newRole} label="Role *"
              onChange={e => setNewRole(e.target.value as StaffRole)}
            >
              <MenuItem value="DOCTOR">Doctor</MenuItem>
              <MenuItem value="NURSE">Nurse</MenuItem>
              <MenuItem value="ASSISTANT">Assistant</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth size="small" label="Specialization" value={newSpecialization} onChange={e => setNewSpecialization(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetAddForm} sx={{ color: SUB, textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained" onClick={handleAddStaff}
            disabled={!newName.trim() || !newRole}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}
          >
            Add Staff
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
