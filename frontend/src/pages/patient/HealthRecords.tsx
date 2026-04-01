import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText, Chip } from '@mui/material';
import { usePatientHealthRecords } from '../../hooks/patient';

const HealthRecords = () => {
  const { data, isLoading, error } = usePatientHealthRecords();
  const records = Array.isArray(data) ? data : [];
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Health Records</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load health records</Alert>}
      {!isLoading && !error && records.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }} elevation={0}>
          <Typography color="text.secondary">No health records yet</Typography>
        </Paper>
      )}
      {records.length > 0 && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <List disablePadding>
            {records.map((record: { id: string; type?: string; date?: string; doctor?: string; notes?: string }, idx: number) => (
              <ListItem key={record.id ?? idx} divider={idx < records.length - 1}>
                <ListItemText
                  primary={record.type ?? 'Record'}
                  secondary={[record.doctor, record.date].filter(Boolean).join(' · ') || 'No details'}
                />
                {record.notes && <Chip label={record.notes} size="small" variant="outlined" />}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};
export default HealthRecords;
