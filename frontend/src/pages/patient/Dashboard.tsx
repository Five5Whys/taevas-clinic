import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  List,
  ListItem,
  Button,
  Chip,
  useTheme,
  Avatar,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const PatientDashboard: React.FC = () => {
  const theme = useTheme();

  const upcomingAppointments = [
    {
      id: '1',
      doctorName: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      date: 'Tomorrow',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: '2',
      doctorName: 'Dr. Priya Sharma',
      specialty: 'Pediatrician',
      date: '28 Mar',
      time: '2:00 PM',
      status: 'confirmed',
    },
  ];

  const recentPrescriptions = [
    { id: '1', medicineCount: 5, date: '15 Mar', doctor: 'Dr. Rajesh Kumar', status: 'active' },
    { id: '2', medicineCount: 3, date: '8 Mar', doctor: 'Dr. Priya Sharma', status: 'active' },
    { id: '3', medicineCount: 2, date: '1 Mar', doctor: 'Dr. Amit Patel', status: 'expired' },
  ];

  const familyMembers = [
    { id: '1', name: 'Rajesh Singh', relation: 'Father', age: 65 },
    { id: '2', name: 'Geeta Singh', relation: 'Mother', age: 60 },
    { id: '3', name: 'Neha Singh', relation: 'Sister', age: 28 },
  ];

  return (
    <DashboardLayout pageTitle="My Health Dashboard">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Quick Actions */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2.5,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 16px rgba(10, 10, 15, 0.12)'
                    : '0 4px 16px rgba(0, 0, 0, 0.32)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '8px',
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                  }}
                >
                  <Icons.EventNote />
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Book Appointment
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Find a Doctor
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2.5,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 16px rgba(10, 10, 15, 0.12)'
                    : '0 4px 16px rgba(0, 0, 0, 0.32)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '8px',
                    backgroundColor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'success.main',
                  }}
                >
                  <Icons.Receipt />
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    My Prescriptions
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    View & Order
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2.5,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 16px rgba(10, 10, 15, 0.12)'
                    : '0 4px 16px rgba(0, 0, 0, 0.32)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '8px',
                    backgroundColor: 'info.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'info.main',
                  }}
                >
                  <Icons.HealthAndSafety />
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Health Records
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    View All
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2.5,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 16px rgba(10, 10, 15, 0.12)'
                    : '0 4px 16px rgba(0, 0, 0, 0.32)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '8px',
                    backgroundColor: 'secondary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'secondary.main',
                  }}
                >
                  <Icons.Group />
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Family Members
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Manage
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Upcoming Appointments & Recent Prescriptions */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {/* Upcoming Appointments */}
          <Grid item xs={12} md={6}>
            <Card>
              <Box
                sx={{
                  p: 2.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Upcoming Appointments
                </Typography>
                <Button size="small" color="primary">
                  View All
                </Button>
              </Box>

              <List disablePadding>
                {upcomingAppointments.map((appointment, index) => (
                  <ListItem
                    key={appointment.id}
                    sx={{
                      py: 2,
                      px: 2.5,
                      borderBottom:
                        index !== upcomingAppointments.length - 1
                          ? `1px solid ${theme.palette.divider}`
                          : 'none',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {appointment.doctorName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {appointment.specialty}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                        {appointment.date} • {appointment.time}
                      </Typography>
                    </Box>
                    <Chip label="Confirmed" size="small" color="success" />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>

          {/* Recent Prescriptions */}
          <Grid item xs={12} md={6}>
            <Card>
              <Box
                sx={{
                  p: 2.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Prescriptions
                </Typography>
                <Button size="small" color="primary">
                  View All
                </Button>
              </Box>

              <List disablePadding>
                {recentPrescriptions.map((prescription, index) => (
                  <ListItem
                    key={prescription.id}
                    sx={{
                      py: 2,
                      px: 2.5,
                      borderBottom:
                        index !== recentPrescriptions.length - 1
                          ? `1px solid ${theme.palette.divider}`
                          : 'none',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {prescription.medicineCount} Medicines
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {prescription.doctor}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                        {prescription.date}
                      </Typography>
                    </Box>
                    <Chip
                      label={prescription.status}
                      size="small"
                      color={prescription.status === 'active' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>

        {/* Family Members */}
        <Card>
          <Box
            sx={{
              p: 2.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Family Members
            </Typography>
            <Button size="small" variant="outlined" startIcon={<Icons.Add />}>
              Add Member
            </Button>
          </Box>

          <Box sx={{ p: 2.5 }}>
            <Grid container spacing={2}>
              {familyMembers.map(member => (
                <Grid item xs={12} sm={6} md={4} key={member.id}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: theme.palette.background.default,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        backgroundColor: 'primary.main',
                        mb: 1,
                        fontSize: '1.2rem',
                      }}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {member.relation}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      {member.age} years old
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default PatientDashboard;
