import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { Phone, PhoneCallback, Add } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDoctorAppointments } from '@/hooks/doctor';

const BRAND = '#5519E6';

const Appointments: React.FC = () => {
  const { data: appointmentsData, isLoading } = useDoctorAppointments();
  const appointments = (Array.isArray(appointmentsData) ? appointmentsData : appointmentsData?.content ?? appointmentsData?.appointments ?? []) as any[];
  const queueStats = appointmentsData?.queueStats ?? {};

  const [walkInOpen, setWalkInOpen] = useState(false);
  const [apptOpen, setApptOpen] = useState(false);
  const [snack, setSnack] = useState('');

  // Walk-In form
  const [wi, setWi] = useState({ patientName: '', phone: '', reason: '', notes: '' });
  const resetWi = () => { setWi({ patientName: '', phone: '', reason: '', notes: '' }); setWalkInOpen(false); };
  const handleWalkIn = () => {
    if (!wi.patientName.trim()) return;
    setSnack(`Walk-in registered for ${wi.patientName}.`);
    resetWi();
  };

  // Appointment form
  const [appt, setAppt] = useState({ patientName: '', phone: '', date: '', time: '', reason: '', type: 'Follow-up' });
  const resetAppt = () => { setAppt({ patientName: '', phone: '', date: '', time: '', reason: '', type: 'Follow-up' }); setApptOpen(false); };
  const handleAppt = () => {
    if (!appt.patientName.trim() || !appt.date || !appt.time) return;
    setSnack(`Appointment booked for ${appt.patientName} on ${appt.date} at ${appt.time}.`);
    resetAppt();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Consult': return BRAND;
      case 'Waiting': return '#FF8232';
      case 'Completed': return '#CDDC50';
      case 'Upcoming': return '#A046F0';
      default: return '#999';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Appointments">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: BRAND }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Appointments">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => setWalkInOpen(true)}
            sx={{ backgroundColor: BRAND, color: '#fff', '&:hover': { backgroundColor: '#4410cc' } }}>
            + Walk-In
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setApptOpen(true)}
            sx={{ backgroundColor: '#A046F0', color: '#fff', '&:hover': { backgroundColor: '#8a38c0' } }}>
            + Appointment
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Appointments</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>Token</TableCell><TableCell>Time</TableCell><TableCell>Patient</TableCell>
                        <TableCell>Reason</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((apt) => (
                        <TableRow key={apt.token}>
                          <TableCell sx={{ fontWeight: 'bold' }}>{apt.token}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                          <TableCell>{apt.patient}</TableCell>
                          <TableCell>{apt.reason}</TableCell>
                          <TableCell>
                            <Chip label={apt.status} size="small"
                              sx={{ backgroundColor: getStatusColor(apt.status), color: '#fff', fontWeight: 'bold' }} />
                          </TableCell>
                          <TableCell>
                            {apt.status === 'Waiting' || apt.status === 'Upcoming' ? (
                              <Stack direction="row" spacing={0.5}>
                                <IconButton size="small" sx={{ color: BRAND }} title="Start Consultation"><PhoneCallback fontSize="small" /></IconButton>
                                <IconButton size="small" sx={{ color: '#25D366' }} title="Call Patient"><Phone fontSize="small" /></IconButton>
                              </Stack>
                            ) : (
                              <Typography variant="caption" color="textSecondary">-</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Queue Stats</Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Seen Today</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#CDDC50' }}>
                      {queueStats.seen ?? appointments.filter((a: any) => a.status === 'Completed').length}
                    </Typography>
                  </Box>
                  <Box sx={{ borderTop: '1px solid #eee', pt: 2 }}>
                    <Typography variant="body2" color="textSecondary">Waiting</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF8232' }}>
                      {queueStats.waiting ?? appointments.filter((a: any) => a.status === 'Waiting').length}
                    </Typography>
                  </Box>
                  <Box sx={{ borderTop: '1px solid #eee', pt: 2 }}>
                    <Typography variant="body2" color="textSecondary">Average Wait Time</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: BRAND }}>
                      {queueStats.avgWait ?? '-'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Walk-In Dialog */}
      <Dialog open={walkInOpen} onClose={resetWi} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Walk-In</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField fullWidth size="small" label="Patient Name *" value={wi.patientName} onChange={e => setWi(p => ({ ...p, patientName: e.target.value }))} />
          <TextField fullWidth size="small" label="Phone" value={wi.phone}
            onChange={e => setWi(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="10-digit number" />
          <TextField fullWidth size="small" label="Reason" value={wi.reason} onChange={e => setWi(p => ({ ...p, reason: e.target.value }))} />
          <TextField fullWidth size="small" label="Notes" multiline rows={2} value={wi.notes} onChange={e => setWi(p => ({ ...p, notes: e.target.value }))} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetWi} sx={{ color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleWalkIn} disabled={!wi.patientName.trim()}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Appointment Dialog */}
      <Dialog open={apptOpen} onClose={resetAppt} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Book Appointment</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField fullWidth size="small" label="Patient Name *" value={appt.patientName} onChange={e => setAppt(p => ({ ...p, patientName: e.target.value }))} />
          <TextField fullWidth size="small" label="Phone" value={appt.phone}
            onChange={e => setAppt(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField fullWidth size="small" label="Date *" type="date" value={appt.date}
              onChange={e => setAppt(p => ({ ...p, date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth size="small" label="Time *" type="time" value={appt.time}
              onChange={e => setAppt(p => ({ ...p, time: e.target.value }))} InputLabelProps={{ shrink: true }} />
          </Box>
          <FormControl size="small" fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={appt.type} label="Type" onChange={e => setAppt(p => ({ ...p, type: e.target.value }))}>
              <MenuItem value="Follow-up">Follow-up</MenuItem><MenuItem value="New Visit">New Visit</MenuItem>
              <MenuItem value="ENT Check">ENT Check</MenuItem><MenuItem value="Surgery Consult">Surgery Consult</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth size="small" label="Reason" value={appt.reason} onChange={e => setAppt(p => ({ ...p, reason: e.target.value }))} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetAppt} sx={{ color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAppt} disabled={!appt.patientName.trim() || !appt.date || !appt.time}
            sx={{ background: '#A046F0', '&:hover': { background: '#8a38c0' }, fontWeight: 700, textTransform: 'none' }}>
            Book
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSnack('')} sx={{ fontWeight: 600 }}>{snack}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Appointments;
