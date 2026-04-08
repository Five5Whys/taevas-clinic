import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Snackbar,
  Alert,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useClinicConfig } from '@/hooks/clinicadmin/useConfig';

const BRAND = '#5519E6';
const SUB = '#6B7280';

const sectionTitleSx = {
  fontSize: '14px',
  fontWeight: 700,
  mb: 2,
  color: '#1F2937',
};

const cardSx = {
  p: 2.5,
  borderRadius: '12px',
  mb: 3,
};

const Config: React.FC = () => {
  const { data: configData, isLoading } = useClinicConfig();

  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [establishedYear, setEstablishedYear] = useState('');
  const [bedCount, setBedCount] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [snackOpen, setSnackOpen] = useState(false);

  const specializations: string[] = configData?.specializations ?? [];

  useEffect(() => {
    if (configData) {
      setClinicName(configData.clinicName ?? '');
      setAddress(configData.address ?? '');
      setCity(configData.city ?? '');
      setState(configData.state ?? '');
      setPincode(configData.pincode ?? '');
      setPhone(configData.phone ?? '');
      setEmail(configData.email ?? '');
      setEstablishedYear(configData.establishedYear ?? '');
      setBedCount(String(configData.bedCount ?? ''));
      setLicenseNumber(configData.licenseNumber ?? '');
    }
  }, [configData]);

  const handleSave = () => {
    setSnackOpen(true);
  };

  return (
    <DashboardLayout pageTitle="Clinic Config">
      <Alert severity="warning" variant="outlined" sx={{ mb: 2, borderRadius: '12px', fontWeight: 700, bgcolor: '#FFF8E1', color: '#B45309' }}>
        🚧 This feature is under development — coming soon!
      </Alert>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: BRAND }} />
        </Box>
      ) : (
      <Box sx={{ maxWidth: 900, mx: 'auto', py: 3, px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1F2937' }}>
          Clinic Configuration
        </Typography>

        {/* Basic Info */}
        <Card variant="outlined" sx={cardSx}>
          <Typography sx={sectionTitleSx}>Basic Info</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Clinic Name"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                multiline
                rows={2}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>
        </Card>

        {/* Specializations */}
        <Card variant="outlined" sx={cardSx}>
          <Typography sx={sectionTitleSx}>Specializations</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {specializations.map((spec) => (
              <Chip
                key={spec}
                label={spec}
                sx={{
                  backgroundColor: '#EDE9FE',
                  color: BRAND,
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              />
            ))}
          </Box>
          <Typography sx={{ fontSize: '12px', color: SUB, mt: 1.5 }}>
            Contact Super Admin to update specializations.
          </Typography>
        </Card>

        {/* Operating Info */}
        <Card variant="outlined" sx={cardSx}>
          <Typography sx={sectionTitleSx}>Operating Info</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Established Year"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bed Count"
                value={bedCount}
                onChange={(e) => setBedCount(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>
        </Card>

        {/* Save */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: BRAND,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              '&:hover': { backgroundColor: '#4313C1' },
            }}
          >
            Save Changes
          </Button>
        </Box>

        <Snackbar
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Clinic configuration saved successfully!
          </Alert>
        </Snackbar>
      </Box>
      )}
    </DashboardLayout>
  );
};

export default Config;
