import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert, TablePagination } from '@mui/material';
import { usePatientPrescriptions } from '../../hooks/patient';

const Prescriptions = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, isLoading, error } = usePatientPrescriptions({ page, size: rowsPerPage });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>My Prescriptions</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load prescriptions</Alert>}
      {data && (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead><TableRow>
              <TableCell>Date</TableCell><TableCell>Doctor</TableCell><TableCell>Diagnosis</TableCell><TableCell>Status</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {(data.content || []).map((rx: any) => (
                <TableRow key={rx.id}>
                  <TableCell>{rx.createdAt?.split('T')[0]}</TableCell><TableCell>{rx.doctorName || '\u2014'}</TableCell>
                  <TableCell>{rx.diagnosis || '\u2014'}</TableCell>
                  <TableCell><Chip label={rx.status} color={rx.status === 'ACTIVE' ? 'success' : 'default'} size="small" /></TableCell>
                </TableRow>
              ))}
              {(!data.content || data.content.length === 0) && <TableRow><TableCell colSpan={4} align="center">No prescriptions found</TableCell></TableRow>}
            </TableBody>
          </Table>
          <TablePagination component="div" count={data.totalElements || 0} page={page}
            onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
        </TableContainer>
      )}
    </Box>
  );
};
export default Prescriptions;
