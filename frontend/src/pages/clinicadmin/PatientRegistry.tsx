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
import { Add as Plus } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const BRAND = '#5519E6';
const SUB = '#6B7280';
const BORDER = '#E5E7EB';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  bloodGroup: string;
  lastVisit: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const MOCK_PATIENTS: Patient[] = [
  { id: '1', firstName: 'Anita', lastName: 'Sharma', phone: '+919876543213', email: 'anita@gmail.com', gender: 'Female', bloodGroup: 'B+', lastVisit: '2026-03-28', status: 'ACTIVE' },
  { id: '2', firstName: 'Vikram', lastName: 'Singh', phone: '+919876543230', email: 'vikram@yahoo.com', gender: 'Male', bloodGroup: 'O+', lastVisit: '2026-03-25', status: 'ACTIVE' },
  { id: '3', firstName: 'Priya', lastName: 'Das', phone: '+919876543215', email: '', gender: 'Female', bloodGroup: 'A+', lastVisit: '2026-03-20', status: 'ACTIVE' },
  { id: '4', firstName: 'Ravi', lastName: 'Patel', phone: '+919876543231', email: 'ravi@gmail.com', gender: 'Male', bloodGroup: 'AB+', lastVisit: '2026-03-18', status: 'ACTIVE' },
  { id: '5', firstName: 'Lakshmi', lastName: 'Iyer', phone: '+919876543232', email: 'lakshmi@gmail.com', gender: 'Female', bloodGroup: 'O-', lastVisit: '2026-03-15', status: 'ACTIVE' },
  { id: '6', firstName: 'Suresh', lastName: 'Kumar', phone: '+919876543233', email: '', gender: 'Male', bloodGroup: 'B-', lastVisit: '2026-02-28', status: 'INACTIVE' },
  { id: '7', firstName: 'Meena', lastName: 'Devi', phone: '+919876543234', email: 'meena.d@gmail.com', gender: 'Female', bloodGroup: 'A-', lastVisit: '2026-03-10', status: 'ACTIVE' },
  { id: '8', firstName: 'Arjun', lastName: 'Reddy', phone: '+919876543235', email: 'arjun@outlook.com', gender: 'Male', bloodGroup: 'AB-', lastVisit: '2026-03-05', status: 'ACTIVE' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientRegistry: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: '',
    bloodGroup: '',
    dob: '',
  });

  const filteredPatients = patients.filter(
    (p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = () => {
    setForm({ firstName: '', lastName: '', phone: '', email: '', gender: '', bloodGroup: '', dob: '' });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.gender) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }
    const newPatient: Patient = {
      id: String(patients.length + 1),
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      lastVisit: '',
      status: 'ACTIVE',
    };
    setPatients((prev) => [newPatient, ...prev]);
    setDialogOpen(false);
    setSnackbar({ open: true, message: 'Patient registered successfully', severity: 'success' });
  };

  return (
    <DashboardLayout pageTitle="Patient Registry">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
              Patients
            </Typography>
            <Typography variant="body2" sx={{ color: SUB }}>
              {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} registered
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus sx={{ fontSize: 18 }} />}
            onClick={handleOpenDialog}
            sx={{
              background: `linear-gradient(135deg, ${BRAND} 0%, #A046F0 100%)`,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            + Register Patient
          </Button>
        </Box>

        {/* Search */}
        <TextField
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          fullWidth
          sx={{ mb: 3, maxWidth: 400 }}
        />

        {/* Patient Table */}
        <Card sx={{ border: `1px solid ${BORDER}`, boxShadow: 'none' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Blood Group</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Last Visit</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{patient.phone}</TableCell>
                    <TableCell sx={{ color: patient.email ? 'inherit' : SUB }}>
                      {patient.email || '\u2014'}
                    </TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.bloodGroup}</TableCell>
                    <TableCell>{patient.lastVisit || '\u2014'}</TableCell>
                    <TableCell>
                      <Chip
                        label={patient.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          backgroundColor: patient.status === 'ACTIVE' ? '#DEF7EC' : '#FDE8E8',
                          color: patient.status === 'ACTIVE' ? '#03543F' : '#9B1C1C',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPatients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: SUB }}>
                      No patients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Register Patient Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Register Patient</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="First Name"
                  value={form.firstName}
                  onChange={(e) => handleFormChange('firstName', e.target.value)}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  label="Last Name"
                  value={form.lastName}
                  onChange={(e) => handleFormChange('lastName', e.target.value)}
                  fullWidth
                  required
                  size="small"
                />
              </Box>
              <TextField
                label="Phone"
                value={form.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                fullWidth
                required
                size="small"
                inputProps={{ style: { fontFamily: 'monospace' } }}
              />
              <TextField
                label="Email"
                value={form.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                fullWidth
                size="small"
              />
              <FormControl fullWidth size="small" required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={form.gender}
                  label="Gender"
                  onChange={(e) => handleFormChange('gender', e.target.value)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Blood Group</InputLabel>
                <Select
                  value={form.bloodGroup}
                  label="Blood Group"
                  onChange={(e) => handleFormChange('bloodGroup', e.target.value)}
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <MenuItem key={bg} value={bg}>
                      {bg}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Date of Birth"
                type="date"
                value={form.dob}
                onChange={(e) => handleFormChange('dob', e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ color: SUB }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleRegister}
              sx={{
                background: `linear-gradient(135deg, ${BRAND} 0%, #A046F0 100%)`,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Register
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default PatientRegistry;
