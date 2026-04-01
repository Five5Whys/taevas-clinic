import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { Search, Add, Visibility as Eye } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDoctorPatients } from '@/hooks/doctor';

const BRAND = '#5519E6';

const Patients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: patientsData, isLoading } = useDoctorPatients();
  const patients = (Array.isArray(patientsData) ? patientsData : patientsData?.content ?? patientsData?.patients ?? []) as any[];

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', age: '', gender: 'M', abhaId: '', bloodGroup: 'O+', allergy: '' });
  const [snack, setSnack] = useState('');

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => { setForm({ firstName: '', lastName: '', phone: '', age: '', gender: 'M', abhaId: '', bloodGroup: 'O+', allergy: '' }); setOpen(false); };

  const handleCreate = () => {
    if (!form.firstName.trim() || !form.phone.trim()) return;
    setSnack(`Patient ${form.firstName} ${form.lastName} registered.`);
    resetForm();
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Patients">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: BRAND }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Patients">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
          <TextField
            fullWidth placeholder="Search by patient name or ID..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            variant="outlined" size="small"
          />
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}
            sx={{ backgroundColor: BRAND, color: '#fff', '&:hover': { backgroundColor: '#4410cc' }, whiteSpace: 'nowrap' }}>
            New Patient
          </Button>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Patients ({filteredPatients.length})</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Patient ID</TableCell><TableCell>Name</TableCell><TableCell>Age/Gender</TableCell>
                    <TableCell>Condition</TableCell><TableCell>ABHA ID</TableCell><TableCell>Last Visit</TableCell><TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{patient.id}</TableCell>
                      <TableCell sx={{ fontWeight: '500' }}>{patient.name}</TableCell>
                      <TableCell>{patient.age}{patient.gender}</TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}><Typography variant="caption">{patient.abhaId}</Typography></TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ color: BRAND }} title="View Patient Record"><Eye fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>

      {/* New Patient Dialog */}
      <Dialog open={open} onClose={resetForm} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Register New Patient</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField fullWidth size="small" label="First Name *" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
            <TextField fullWidth size="small" label="Last Name" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
          </Box>
          <TextField fullWidth size="small" label="Phone *" value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="10-digit number" />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField size="small" label="Age" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value.replace(/\D/g, '').slice(0, 3) }))} sx={{ width: 100 }} />
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Gender</InputLabel>
              <Select value={form.gender} label="Gender" onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                <MenuItem value="M">Male</MenuItem><MenuItem value="F">Female</MenuItem><MenuItem value="O">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Blood</InputLabel>
              <Select value={form.bloodGroup} label="Blood" onChange={e => setForm(p => ({ ...p, bloodGroup: e.target.value }))}>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <TextField fullWidth size="small" label="ABHA ID" value={form.abhaId} onChange={e => setForm(p => ({ ...p, abhaId: e.target.value }))} placeholder="Optional" />
          <TextField fullWidth size="small" label="Known Allergies" value={form.allergy} onChange={e => setForm(p => ({ ...p, allergy: e.target.value }))} placeholder="Optional" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetForm} sx={{ color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.firstName.trim() || !form.phone.trim()}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}>
            Register
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSnack('')} sx={{ fontWeight: 600 }}>{snack}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Patients;
