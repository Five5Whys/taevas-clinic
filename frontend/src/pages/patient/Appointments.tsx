import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert, TablePagination } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePatientAppointments } from '../../hooks/patient';

const Appointments = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, isLoading, error } = usePatientAppointments({ page, size: rowsPerPage });
  const statusColor = (s: string) => ({ SCHEDULED: 'info' as const, IN_PROGRESS: 'warning' as const, COMPLETED: 'success' as const, CANCELLED: 'error' as const }[s] || 'default' as const);

  return (
    <DashboardLayout pageTitle="My Appointments">
      <Box sx={{ px: 3, py: 2.5 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>My Appointments</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load appointments</Alert>}
      {data && (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead><TableRow>
              <TableCell>Date</TableCell><TableCell>Time</TableCell><TableCell>Doctor</TableCell><TableCell>Type</TableCell><TableCell>Status</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {(data.content || []).map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell>{a.appointmentDate}</TableCell><TableCell>{a.startTime}</TableCell>
                  <TableCell>{a.doctorName || '\u2014'}</TableCell><TableCell>{a.type}</TableCell>
                  <TableCell><Chip label={a.status} color={statusColor(a.status)} size="small" /></TableCell>
                </TableRow>
              ))}
              {(!data.content || data.content.length === 0) && <TableRow><TableCell colSpan={5} align="center">No appointments found</TableCell></TableRow>}
            </TableBody>
          </Table>
          <TablePagination component="div" count={data.totalElements || 0} page={page}
            onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
        </TableContainer>
      )}
      </Box>
    </DashboardLayout>
  );
};
export default Appointments;
