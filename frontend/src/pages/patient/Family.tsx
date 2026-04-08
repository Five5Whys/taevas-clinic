import { Box, Typography, Paper, Card, CardContent, Chip, CircularProgress, Alert, Grid } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePatientFamily } from '../../hooks/patient';

const Family = () => {
  const { data, isLoading, error } = usePatientFamily();
  return (
    <DashboardLayout pageTitle="My Family">
      <Box sx={{ px: 3, py: 2.5 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>My Family</Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load family data</Alert>}
      {data && Array.isArray(data) && data.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }} elevation={0}>
          <Typography color="text.secondary">No family groups found</Typography>
        </Paper>
      )}
      {data && Array.isArray(data) && data.length > 0 && (
        <Grid container spacing={2}>
          {data.map((g: any) => (
            <Grid item xs={12} md={6} key={g.id}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{g.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>Primary: {g.primaryPatientName || '\u2014'}</Typography>
                  {(g.members || []).map((m: any) => <Chip key={m.id} label={`${m.patientName} (${m.relationship})`} sx={{ mr: 1, mb: 1 }} />)}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      </Box>
    </DashboardLayout>
  );
};
export default Family;
