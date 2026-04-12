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
  CircularProgress,
  IconButton,
  Tooltip,
  Switch,
} from '@mui/material';
import { Add as Plus, PersonAdd as PersonAddIcon, PersonRemove as PersonRemoveIcon } from '@mui/icons-material';
import { usePatientList, useCreatePatient, useClinicDoctors, useCAAssignPatient, useCAUnassignPatient } from '@/hooks/clinicadmin';

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
  completeAddress: string;
  postalCode: string;
  country: string;
  state: string;
  city: string;
  smsNotifications: boolean;
  remarks: string;
  lastVisit: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedDoctorId: string | null;
  assignedDoctorName: string | null;
}

interface ClinicDoctor {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  doctorCode: string;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientRegistry: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [unassignDialogOpen, setUnassignDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const { data: patientData, isLoading, isError } = usePatientList({ search: searchQuery || undefined });
  const createPatient = useCreatePatient();
  const { data: doctorsData } = useClinicDoctors();
  const assignPatient = useCAAssignPatient();
  const unassignPatient = useCAUnassignPatient();
  const doctors: ClinicDoctor[] = Array.isArray(doctorsData) ? doctorsData : [];

  const FALLBACK_PATIENTS: Patient[] = [
    { id: 'P-001', firstName: 'Anita', lastName: 'Sharma', phone: '9876500001', email: 'anita@email.com', gender: 'Female', bloodGroup: 'B+', lastVisit: '2026-03-28', status: 'ACTIVE', assignedDoctorId: null, assignedDoctorName: null, completeAddress: '', postalCode: '', country: '', state: '', city: '', smsNotifications: false, remarks: '' },
  ];

  const isMock = localStorage.getItem('authToken') === 'mock-jwt-token-for-dev-only';
  const [localPatients, setLocalPatients] = useState<Patient[]>([]);
  const raw = patientData?.content ?? patientData;
  const patients: Patient[] = [
    ...((Array.isArray(raw) && raw.length > 0 ? raw : (isError || isMock) ? FALLBACK_PATIENTS : raw ?? []) as Patient[]),
    ...localPatients,
  ];

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: '',
    bloodGroup: '',
    dob: '',
    completeAddress: '',
    postalCode: '',
    country: '',
    state: '',
    city: '',
    smsNotifications: false,
    remarks: '',
  });
  const [contactError, setContactError] = useState(false);

  const filteredPatients = searchQuery
    ? patients.filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone?.includes(searchQuery) ||
          (p.email ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patients;

  const handleOpenAssign = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedDoctorId('');
    setAssignDialogOpen(true);
  };

  const handleOpenUnassign = (patient: Patient) => {
    setSelectedPatient(patient);
    setUnassignDialogOpen(true);
  };

  const handleAssignConfirm = () => {
    if (!selectedPatient || !selectedDoctorId) return;
    assignPatient.mutate(
      { patientId: selectedPatient.id, doctorId: selectedDoctorId },
      {
        onSuccess: () => {
          setAssignDialogOpen(false);
          setSelectedPatient(null);
          setSnackbar({ open: true, message: 'Patient assigned successfully', severity: 'success' });
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Failed to assign patient', severity: 'error' });
        },
      }
    );
  };

  const handleUnassignConfirm = () => {
    if (!selectedPatient) return;
    unassignPatient.mutate(selectedPatient.id, {
      onSuccess: () => {
        setUnassignDialogOpen(false);
        setSelectedPatient(null);
        setSnackbar({ open: true, message: 'Patient unassigned successfully', severity: 'success' });
      },
      onError: () => {
        setSnackbar({ open: true, message: 'Failed to unassign patient', severity: 'error' });
      },
    });
  };

  const handleOpenDialog = () => {
    setForm({ firstName: '', lastName: '', phone: '', email: '', gender: '', bloodGroup: '', dob: '', completeAddress: '', postalCode: '', country: '', state: '', city: '', smsNotifications: false, remarks: '' });
    setContactError(false);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    if (!form.firstName || !form.lastName || !form.gender) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }
    if (!form.phone && !form.email) {
      setContactError(true);
      setSnackbar({ open: true, message: 'At least one of phone or email must be provided', severity: 'error' });
      return;
    }
    setContactError(false);

    if (isMock) {
      const newPatient: Patient = {
        id: `P-LOCAL-${Date.now()}`,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        completeAddress: form.completeAddress,
        postalCode: form.postalCode,
        country: form.country,
        state: form.state,
        city: form.city,
        smsNotifications: form.smsNotifications,
        remarks: form.remarks,
        lastVisit: new Date().toISOString().split('T')[0] ?? '',
        status: 'ACTIVE',
        assignedDoctorId: null,
        assignedDoctorName: null,
      };
      setLocalPatients(prev => [...prev, newPatient]);
      setDialogOpen(false);
      setSnackbar({ open: true, message: 'Patient registered successfully', severity: 'success' });
      return;
    }

    createPatient.mutate(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        email: form.email || undefined,
        gender: form.gender,
        bloodGroup: form.bloodGroup || undefined,
        dateOfBirth: form.dob || undefined,
        completeAddress: form.completeAddress || undefined,
        postalCode: form.postalCode || undefined,
        country: form.country || undefined,
        state: form.state || undefined,
        city: form.city || undefined,
        smsNotifications: form.smsNotifications,
        remarks: form.remarks || undefined,
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setSnackbar({ open: true, message: 'Patient registered successfully', severity: 'success' });
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Failed to register patient', severity: 'error' });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
            Add New Patient
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
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Actions</TableCell>
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
                    <TableCell>
                      {patient.assignedDoctorId ? (
                        <Tooltip title={`Assigned to Dr. ${patient.assignedDoctorName || 'Unknown'}`} arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenUnassign(patient)}
                            sx={{ color: '#DC2626', '&:hover': { backgroundColor: 'rgba(220,38,38,0.08)' } }}
                          >
                            <PersonRemoveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Assign to doctor" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenAssign(patient)}
                            sx={{ color: BRAND, '&:hover': { backgroundColor: 'rgba(85,25,230,0.08)' } }}
                          >
                            <PersonAddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPatients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: SUB }}>
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
                onChange={(e) => { handleFormChange('phone', e.target.value); setContactError(false); }}
                fullWidth
                size="small"
                error={contactError}
                helperText={contactError ? 'At least one of phone or email is required' : ''}
                inputProps={{ style: { fontFamily: 'monospace' } }}
              />
              <TextField
                label="Email"
                value={form.email}
                onChange={(e) => { handleFormChange('email', e.target.value); setContactError(false); }}
                fullWidth
                size="small"
                error={contactError}
                helperText={contactError ? 'At least one of phone or email is required' : ''}
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
              <TextField
                fullWidth
                size="small"
                label="Address"
                value={form.completeAddress}
                onChange={e => setForm(p => ({ ...p, completeAddress: e.target.value }))}
                multiline
                rows={2}
              />
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField fullWidth size="small" label="City" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                <TextField fullWidth size="small" label="State" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} />
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField fullWidth size="small" label="Postal Code" value={form.postalCode} onChange={e => setForm(p => ({ ...p, postalCode: e.target.value }))} />
                <TextField fullWidth size="small" label="Country" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '13px' }}>SMS Notifications</Typography>
                <Switch size="small" checked={form.smsNotifications} onChange={e => setForm(p => ({ ...p, smsNotifications: e.target.checked }))} />
              </Box>
              <TextField
                fullWidth
                size="small"
                label="Remarks"
                value={form.remarks}
                onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))}
                multiline
                rows={2}
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
              disabled={createPatient.isPending}
              sx={{
                background: `linear-gradient(135deg, ${BRAND} 0%, #A046F0 100%)`,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {createPatient.isPending ? 'Registering...' : 'Register'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assign Patient Dialog */}
        <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Assign {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : ''} to Doctor
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  value={selectedDoctorId}
                  label="Select Doctor"
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                >
                  {doctors.map((doc) => (
                    <MenuItem key={doc.id} value={doc.id}>
                      <Box>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                          Dr. {doc.firstName} {doc.lastName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: SUB }}>
                          {doc.department} &middot; {doc.doctorCode}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setAssignDialogOpen(false)} sx={{ color: SUB }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAssignConfirm}
              disabled={!selectedDoctorId || assignPatient.isPending}
              sx={{
                background: `linear-gradient(135deg, ${BRAND} 0%, #A046F0 100%)`,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {assignPatient.isPending ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Unassign Confirmation Dialog */}
        <Dialog open={unassignDialogOpen} onClose={() => setUnassignDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Unassign Patient</DialogTitle>
          <DialogContent>
            <Typography>
              Unassign {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : ''} from Dr. {selectedPatient?.assignedDoctorName || 'Unknown'}?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setUnassignDialogOpen(false)} sx={{ color: SUB }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUnassignConfirm}
              disabled={unassignPatient.isPending}
              sx={{
                backgroundColor: '#DC2626',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#B91C1C' },
              }}
            >
              {unassignPatient.isPending ? 'Unassigning...' : 'Confirm'}
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
  );
};

export default PatientRegistry;
