import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useClinicDashboard } from '@/hooks/clinicadmin';

const BRAND = '#5519E6';
const SUB = '#6B7280';

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
}
const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <Card sx={{ borderRadius: '8px', height: '100%' }}>
    <CardContent sx={{ p: 1.2, display: 'flex', alignItems: 'center', gap: 1.2, '&:last-child': { pb: 1.2 } }}>
      <Box sx={{ fontSize: 20 }}>{icon}</Box>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: BRAND, lineHeight: 1.1, fontSize: '1rem' }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: SUB, fontWeight: 500, fontSize: '0.7rem' }}>
          {label}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// ─── Quick Action Card ───────────────────────────────────────────────────────
interface QuickActionProps {
  icon: string;
  label: string;
}
const QuickAction: React.FC<QuickActionProps> = ({ icon, label }) => (
  <Card
    sx={{
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s, transform 0.2s',
      '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
    }}
  >
    <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
      <Box sx={{ fontSize: 32, mb: 1 }}>{icon}</Box>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

// ─── Mock Data (appointments – no list API yet) ─────────────────────────────
const APPOINTMENTS = [
  { time: '9:00 AM', patient: 'Anita Sharma', doctor: 'Dr. Rajesh', type: 'Follow-up', status: 'Confirmed' },
  { time: '9:30 AM', patient: 'Priya Das', doctor: 'Dr. Rajesh', type: 'New Visit', status: 'Waiting' },
  { time: '10:00 AM', patient: 'Vikram Singh', doctor: 'Dr. Meena', type: 'ENT Check', status: 'Confirmed' },
  { time: '10:30 AM', patient: 'Ravi Patel', doctor: 'Dr. Rajesh', type: 'Surgery Consult', status: 'Confirmed' },
  { time: '11:00 AM', patient: 'Lakshmi Iyer', doctor: 'Dr. Meena', type: 'Follow-up', status: 'Cancelled' },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Confirmed: { bg: '#E8F5E9', color: '#2E7D32' },
  Waiting: { bg: '#FFF3E0', color: '#E65100' },
  Cancelled: { bg: '#FFEBEE', color: '#C62828' },
};

const QUICK_ACTIONS = [
  { icon: '📋', label: 'Book Appointment' },
  { icon: '🧑‍🤝‍🧑', label: 'Register Patient' },
  { icon: '📊', label: 'View Reports' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { data: dashboard, isLoading, isError } = useClinicDashboard();

  const stats = dashboard
    ? [
        { icon: '📅', value: dashboard.todayAppointments, label: "Today's Appointments" },
        { icon: '🩺', value: dashboard.totalPatients, label: 'Total Patients' },
        { icon: '📋', value: dashboard.pendingAppointments, label: 'Pending Appointments' },
        { icon: '💰', value: `₹${Number(dashboard.totalRevenue).toLocaleString('en-IN')}`, label: 'Total Revenue' },
      ]
    : [];

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Clinic Overview">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout pageTitle="Clinic Overview">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <Typography color="error">Failed to load dashboard data.</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Clinic Overview">
      <Box sx={{ px: 3, py: 3 }}>

        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Clinic Overview
          </Typography>
          <Typography variant="body2" sx={{ color: SUB, mt: 0.5 }}>
            ENT Care Center, Pune
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          {QUICK_ACTIONS.map((action) => (
            <Grid item xs={12} sm={4} key={action.label}>
              <QuickAction icon={action.icon} label={action.label} />
            </Grid>
          ))}
        </Grid>

        {/* Stats Row */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {stats.map((s) => (
            <Grid item xs={6} sm={3} key={s.label}>
              <StatCard icon={s.icon} value={s.value} label={s.label} />
            </Grid>
          ))}
        </Grid>

        {/* Today's Schedule */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Today's Schedule
        </Typography>
        <Card sx={{ borderRadius: '12px', mb: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#F8F9FA' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Doctor</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {APPOINTMENTS.map((appt) => {
                  const statusStyle = STATUS_COLORS[appt.status] ?? { bg: '#F3F4F6', color: SUB };
                  return (
                    <TableRow key={appt.time + appt.patient}>
                      <TableCell>{appt.time}</TableCell>
                      <TableCell>{appt.patient}</TableCell>
                      <TableCell>{appt.doctor}</TableCell>
                      <TableCell>{appt.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={appt.status}
                          size="small"
                          sx={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 700,
                            fontSize: '12px',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
