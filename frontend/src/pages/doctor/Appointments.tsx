import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Phone, PhoneCallback, Add } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDoctorAppointments } from '@/hooks/doctor';

const Appointments: React.FC = () => {
  const { data: appointmentsData, isLoading } = useDoctorAppointments();
  const appointments = (Array.isArray(appointmentsData) ? appointmentsData : appointmentsData?.content ?? appointmentsData?.appointments ?? []) as any[];
  const queueStats = appointmentsData?.queueStats ?? {};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Consult':
        return '#5519E6';
      case 'Waiting':
        return '#FF8232';
      case 'Completed':
        return '#CDDC50';
      case 'Upcoming':
        return '#A046F0';
      default:
        return '#999';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Appointments">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: '#5519E6' }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Appointments">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#5519E6',
              color: '#fff',
              '&:hover': { backgroundColor: '#4410cc' },
            }}
          >
            + Walk-In
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#A046F0',
              color: '#fff',
              '&:hover': { backgroundColor: '#8a38c0' },
            }}
          >
            + Appointment
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Appointments Table */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Appointments
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>Token</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Patient</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((apt) => (
                        <TableRow key={apt.token}>
                          <TableCell sx={{ fontWeight: 'bold' }}>{apt.token}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                          <TableCell>{apt.patient}</TableCell>
                          <TableCell>{apt.reason}</TableCell>
                          <TableCell>
                            <Chip
                              label={apt.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(apt.status),
                                color: '#fff',
                                fontWeight: 'bold',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {apt.status === 'Waiting' || apt.status === 'Upcoming' ? (
                              <Stack direction="row" spacing={0.5}>
                                <IconButton
                                  size="small"
                                  sx={{ color: '#5519E6' }}
                                  title="Start Consultation"
                                >
                                  <PhoneCallback fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  sx={{ color: '#25D366' }}
                                  title="Call Patient"
                                >
                                  <Phone fontSize="small" />
                                </IconButton>
                              </Stack>
                            ) : (
                              <Typography variant="caption" color="textSecondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Queue Stats */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Queue Stats
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Seen Today
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#CDDC50' }}>
                      {queueStats.seen ?? appointments.filter((a: any) => a.status === 'Completed').length}
                    </Typography>
                  </Box>
                  <Box sx={{ borderTop: '1px solid #eee', pt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Waiting
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF8232' }}>
                      {queueStats.waiting ?? appointments.filter((a: any) => a.status === 'Waiting').length}
                    </Typography>
                  </Box>
                  <Box sx={{ borderTop: '1px solid #eee', pt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Average Wait Time
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#5519E6' }}>
                      {queueStats.avgWait ?? '-'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Appointments;
