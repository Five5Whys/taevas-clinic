import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { usePatientHealthRecords } from '../../hooks/patient';

const HealthRecords = () => {
  const { data, isLoading, error } = usePatientHealthRecords();
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Health Records</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load health records</Alert>}
      {data && Array.isArray(data) && data.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }} elevation={0}>
          <Typography color="text.secondary">No health records yet</Typography>
        </Paper>
      )}
    </Box>
  );
};
export default HealthRecords;
