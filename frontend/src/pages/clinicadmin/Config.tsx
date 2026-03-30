import React, { useState } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Config: React.FC = () => {
  const [profile, setProfile] = useState({
    clinicName: 'Taevas Clinic Pune',
    city: 'Pune',
    addressLine1: '123 Medical Plaza',
    addressLine2: 'Baner Road',
    phone: '+91 9876543210',
    email: 'clinic@taevas.in',
    website: 'https://taevas.in',
    speciality: 'Otolaryngology',
  });

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    console.log('Profile saved:', profile);
    alert('Clinic profile saved successfully!');
  };

  return (
    <DashboardLayout pageTitle="Clinic Profile">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Card>
          <CardHeader title="Clinic Information" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Clinic Name"
                  value={profile.clinicName}
                  onChange={(e) => handleChange('clinicName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={profile.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  value={profile.addressLine1}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  value={profile.addressLine2}
                  onChange={(e) => handleChange('addressLine2', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={profile.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Speciality"
                  value={profile.speciality}
                  onChange={(e) => handleChange('speciality', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                  }}
                  onClick={handleSave}
                >
                  Save Profile
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default Config;
