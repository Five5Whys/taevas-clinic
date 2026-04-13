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
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePatientDashboard, usePatientAppointments, usePatientPrescriptions, usePatientFamily } from '@/hooks/patient/usePortal';
import { toTitle } from '@/utils/helpers';

const PatientDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  usePatientDashboard();
  const { data: appointmentsRaw } = usePatientAppointments({ page: 0, size: 5 });
  const { data: prescriptionsRaw } = usePatientPrescriptions({ page: 0, size: 5 });
  const { data: familyData } = usePatientFamily();

  const upcomingAppointments = (appointmentsRaw?.content ?? appointmentsRaw ?? []) as Array<{ id: string; doctorName: string; type?: string; appointmentDate: string; startTime: string; status: string }>;
  const recentPrescriptions = (prescriptionsRaw?.content ?? prescriptionsRaw ?? []) as Array<{ id: string; doctorName: string; diagnosis?: string; status: string; items?: Array<unknown>; createdAt?: string }>;
  const familyGroups = (familyData ?? []) as Array<{ id: string; name: string; members: Array<{ id: string; patientId: string; relationship: string }> }>;

  return (
    <DashboardLayout pageTitle="My Health Dashboard">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Quick Actions */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              onClick={() => navigate('/patient/appointments?book=1')}
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
              onClick={() => navigate('/patient/prescriptions')}
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
              onClick={() => navigate('/patient/health-records')}
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
              onClick={() => navigate('/patient/family')}
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
                {upcomingAppointments.length === 0 && (
                  <ListItem sx={{ py: 3, justifyContent: 'center' }}>
                    <Typography variant="body2" color="textSecondary">No upcoming appointments</Typography>
                  </ListItem>
                )}
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
                        {toTitle(appointment.type) || 'Consultation'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                        {appointment.appointmentDate} • {appointment.startTime}
                      </Typography>
                    </Box>
                    <Chip label={toTitle(appointment.status)} size="small" color="success" />
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
                {recentPrescriptions.length === 0 && (
                  <ListItem sx={{ py: 3, justifyContent: 'center' }}>
                    <Typography variant="body2" color="textSecondary">No prescriptions</Typography>
                  </ListItem>
                )}
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
                        {prescription.items?.length ?? 0} Medicines
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {prescription.doctorName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                        {prescription.createdAt ?? ''}
                      </Typography>
                    </Box>
                    <Chip
                      label={toTitle(prescription.status)}
                      size="small"
                      color={prescription.status === 'ACTIVE' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>

        {/* Family Groups */}
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
          </Box>

          <Box sx={{ p: 2.5 }}>
            {familyGroups.length === 0 ? (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                No family members linked
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {familyGroups.flatMap((g) => g.members).map((member) => (
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
                        {member.relationship.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {member.relationship}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {member.patientId.slice(0, 8)}...
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default PatientDashboard;
