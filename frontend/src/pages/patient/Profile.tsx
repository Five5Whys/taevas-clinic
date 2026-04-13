import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button, Grid, Switch,
  FormControlLabel, Snackbar, Alert, CircularProgress, Chip,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePatientProfile, useUpdatePatientProfile } from '@/hooks/patient/usePortal';
import { toTitle } from '@/utils/helpers';

const PatientProfile: React.FC = () => {
  const { data: profile, isLoading } = usePatientProfile();
  const updateProfile = useUpdatePatientProfile();
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', gender: '', bloodGroup: '',
    dateOfBirth: '', completeAddress: '', city: '', state: '', postalCode: '', country: '',
    smsNotifications: false, remarks: '',
  });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || '', lastName: profile.lastName || '',
        phone: profile.phone || '', email: profile.email || '',
        gender: profile.gender || '', bloodGroup: profile.bloodGroup || '',
        dateOfBirth: profile.dateOfBirth || '',
        completeAddress: profile.completeAddress || '', city: profile.city || '',
        state: profile.state || '', postalCode: profile.postalCode || '',
        country: profile.country || '', smsNotifications: profile.smsNotifications || false,
        remarks: profile.remarks || '',
      });
    }
  }, [profile]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    updateProfile.mutate(form, {
      onSuccess: () => setSnack({ open: true, msg: 'Profile updated', severity: 'success' }),
      onError: () => setSnack({ open: true, msg: 'Update failed', severity: 'error' }),
    });
  };

  if (isLoading) return <DashboardLayout pageTitle="My Profile"><Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box></DashboardLayout>;

  return (
    <DashboardLayout pageTitle="My Profile">
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Header with patient code */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>My Profile</Typography>
          {profile?.patientCode && <Chip label={profile.patientCode} color="primary" size="small" />}
          {profile?.status && <Chip label={toTitle(profile.status)} color={profile.status === 'ACTIVE' ? 'success' : 'default'} size="small" variant="outlined" />}
        </Box>

        <Paper sx={{ p: 2 }}>
          <Grid container spacing={1.5}>
            {/* Personal Info */}
            <Grid item xs={12}><Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Personal Information</Typography></Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="First Name" value={form.firstName} onChange={handleChange('firstName')} size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Last Name" value={form.lastName} onChange={handleChange('lastName')} size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Phone" value={form.phone} onChange={handleChange('phone')} size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Email" value={form.email} onChange={handleChange('email')} size="small" />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField fullWidth label="Gender" value={form.gender} onChange={handleChange('gender')} size="small" />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField fullWidth label="Blood Group" value={form.bloodGroup} onChange={handleChange('bloodGroup')} size="small" />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField fullWidth label="Date of Birth" value={form.dateOfBirth} onChange={handleChange('dateOfBirth')} size="small" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={<Switch size="small" checked={form.smsNotifications} onChange={(e) => setForm(prev => ({ ...prev, smsNotifications: e.target.checked }))} />}
                label={<Typography variant="body2">SMS Notifications</Typography>}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} sx={{ mt: 0.5 }}><Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Address</Typography></Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Complete Address" value={form.completeAddress} onChange={handleChange('completeAddress')} size="small" />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="City" value={form.city} onChange={handleChange('city')} size="small" />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="State" value={form.state} onChange={handleChange('state')} size="small" />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="Postal Code" value={form.postalCode} onChange={handleChange('postalCode')} size="small" />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="Country" value={form.country} onChange={handleChange('country')} size="small" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Remarks" value={form.remarks} onChange={handleChange('remarks')} size="small" />
            </Grid>

            {/* Save */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snack.severity} onClose={() => setSnack(prev => ({ ...prev, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default PatientProfile;
