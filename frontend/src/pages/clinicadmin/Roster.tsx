import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  Typography,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Add as Plus, MoreVert as MoreVertical } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Doctor {
  id: string;
  name: string;
  roles: string[];
  speciality: string;
  registration: string;
  avatar: string;
}

const Roster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      roles: ['Senior Consultant', 'Department Head'],
      speciality: 'Otolaryngology',
      registration: 'NMC-12345',
      avatar: 'RK',
    },
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    doctorId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoctor(doctorId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoctor(null);
  };

  const handleAddDoctor = () => {
    alert('Add Doctor dialog would open here');
  };

  const handleEditRoles = (_doctorId: string) => {
    handleMenuClose();
  };

  const handleEditSchedule = (_doctorId: string) => {
    handleMenuClose();
  };

  const handleRemoveDoctor = (doctorId: string) => {
    setDoctors(doctors.filter((d) => d.id !== doctorId));
    handleMenuClose();
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Doctor Roster">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* Search Bar and Add Button */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              placeholder="Search doctors by name or speciality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1 }}
              size="small"
            />
            <Button
              variant="contained"
              startIcon={<Plus sx={{ fontSize: 18 }} />}
              sx={{
                background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
              }}
              onClick={handleAddDoctor}
            >
              Add Doctor
            </Button>
          </Box>

          {/* Doctor Cards Grid */}
          <Grid container spacing={3}>
            {filteredDoctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #e0e0e0',
                    '&:hover': { boxShadow: 3 },
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                          marginRight: 2,
                        }}
                      >
                        {doctor.avatar}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {doctor.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {doctor.speciality}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, doctor.id)}
                      >
                        <MoreVertical sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      {doctor.roles.map((role) => (
                        <Chip
                          key={role}
                          label={role}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>

                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Reg: {doctor.registration}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleEditRoles(selectedDoctor || '')}>
              Edit Roles
            </MenuItem>
            <MenuItem onClick={() => handleEditSchedule(selectedDoctor || '')}>
              Schedule
            </MenuItem>
            <MenuItem
              onClick={() => handleRemoveDoctor(selectedDoctor || '')}
              sx={{ color: 'error.main' }}
            >
              Remove
            </MenuItem>
          </Menu>
        </Stack>
      </Container>
    </DashboardLayout>
  );
};

export default Roster;
