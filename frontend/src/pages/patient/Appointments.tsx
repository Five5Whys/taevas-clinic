import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
  CircularProgress, Alert, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Snackbar } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePatientAppointments, useClinicDoctors, useBookAppointment } from '../../hooks/patient';
import { toTitle } from '@/utils/helpers';

const TYPES = ['CONSULTATION', 'FOLLOW_UP', 'CHECK_UP', 'EMERGENCY'];

const Appointments = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, isLoading, error } = usePatientAppointments({ page, size: rowsPerPage });
  const { data: doctors } = useClinicDoctors();
  const bookMutation = useBookAppointment();
  const [searchParams, setSearchParams] = useSearchParams();

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('book') === '1') {
      setDialogOpen(true);
      searchParams.delete('book');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const [form, setForm] = useState({ doctorId: '', appointmentDate: '', startTime: '', type: 'CONSULTATION', notes: '' });
  const [snack, setSnack] = useState('');

  const statusColor = (s: string) => ({ SCHEDULED: 'info' as const, IN_PROGRESS: 'warning' as const, COMPLETED: 'success' as const, CANCELLED: 'error' as const }[s] || 'default' as const);

  const handleBook = async () => {
    try {
      await bookMutation.mutateAsync(form);
      setSnack('Appointment booked successfully');
      setDialogOpen(false);
      setForm({ doctorId: '', appointmentDate: '', startTime: '', type: 'CONSULTATION', notes: '' });
    } catch { setSnack('Failed to book appointment'); }
  };

  const canBook = form.doctorId && form.appointmentDate && form.startTime;
  const appointments = Array.isArray(data) ? data : (data?.content || []);

  return (
    <DashboardLayout pageTitle="My Appointments">
      <Box sx={{ px: 3, py: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>My Appointments</Typography>
          <Button variant="contained" onClick={() => setDialogOpen(true)} size="small">+ Book Appointment</Button>
        </Box>

        {isLoading && <CircularProgress />}
        {error && <Alert severity="error">Failed to load appointments</Alert>}
        {!isLoading && !error && (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead><TableRow>
                <TableCell>Date</TableCell><TableCell>Time</TableCell><TableCell>Doctor</TableCell><TableCell>Type</TableCell><TableCell>Status</TableCell>
              </TableRow></TableHead>
              <TableBody>
                {appointments.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.appointmentDate}</TableCell><TableCell>{a.startTime}</TableCell>
                    <TableCell>{a.doctorName || '\u2014'}</TableCell><TableCell>{toTitle(a.type)}</TableCell>
                    <TableCell><Chip label={toTitle(a.status)} color={statusColor(a.status)} size="small" /></TableCell>
                  </TableRow>
                ))}
                {appointments.length === 0 && <TableRow><TableCell colSpan={5} align="center">No appointments found</TableCell></TableRow>}
              </TableBody>
            </Table>
            <TablePagination component="div" count={data?.totalElements || appointments.length || 0} page={page}
              onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
          </TableContainer>
        )}

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogContent>
            <TextField select label="Doctor" fullWidth margin="normal" value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required>
              {(doctors || []).map((d: any) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
            </TextField>
            <TextField label="Date" type="date" fullWidth margin="normal" value={form.appointmentDate}
              onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
              InputLabelProps={{ shrink: true }} required />
            <TextField label="Start Time" type="time" fullWidth margin="normal" value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              InputLabelProps={{ shrink: true }} required />
            <TextField select label="Type" fullWidth margin="normal" value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map(t => <MenuItem key={t} value={t}>{toTitle(t)}</MenuItem>)}
            </TextField>
            <TextField label="Notes" fullWidth margin="normal" multiline rows={2} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleBook} disabled={!canBook || bookMutation.isPending}>
              {bookMutation.isPending ? 'Booking...' : 'Book'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} message={snack} />
      </Box>
    </DashboardLayout>
  );
};
export default Appointments;
