import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const BRAND = '#5519E6';
const SUB = '#6B7280';

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  value: string | number;
  label: string;
}
const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <Card sx={{ borderRadius: '12px', p: 2 }}>
    <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND }}>
      {value}
    </Typography>
    <Typography variant="body2" sx={{ color: SUB, mt: 0.5, fontWeight: 500 }}>
      {label}
    </Typography>
  </Card>
);

// ─── Top Doctors Data ─────────────────────────────────────────────────────────
const topDoctors = [
  { name: 'Dr. Rajesh Kumar', appointments: 78, patientsSeen: 65, rating: 4.8 },
  { name: 'Dr. Meena Iyer', appointments: 52, patientsSeen: 48, rating: 4.9 },
];

// ─── Appointment Breakdown Data ───────────────────────────────────────────────
const appointmentBreakdown = [
  { type: 'Follow-up', count: 68, percentage: '44%', color: '#5519E6' },
  { type: 'New Visit', count: 42, percentage: '27%', color: '#10B981' },
  { type: 'Surgery Consult', count: 28, percentage: '18%', color: '#F59E0B' },
  { type: 'Emergency', count: 18, percentage: '11%', color: '#EF4444' },
];

// ─── Reports Page ─────────────────────────────────────────────────────────────
const Reports: React.FC = () => {
  const [period, setPeriod] = useState('This Month');

  const handlePeriodChange = (event: SelectChangeEvent<string>) => {
    setPeriod(event.target.value);
  };

  return (
    <DashboardLayout pageTitle="Reports">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Reports
        </Typography>
        <Typography variant="body2" sx={{ color: SUB }}>
          Clinic performance and analytics
        </Typography>
      </Box>

      {/* Period Filter */}
      <FormControl size="small" sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Period</InputLabel>
        <Select value={period} label="Period" onChange={handlePeriodChange}>
          <MenuItem value="This Week">This Week</MenuItem>
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="Last 3 Months">Last 3 Months</MenuItem>
          <MenuItem value="This Year">This Year</MenuItem>
        </Select>
      </FormControl>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
        <StatCard value={156} label="Total Appointments" />
        <StatCard value={34} label="New Patients" />
        <StatCard value="₹4,82,000" label="Revenue" />
        <StatCard value="8%" label="Cancellation Rate" />
      </Box>

      {/* Top Doctors Table */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
        Top Doctors
      </Typography>
      <TableContainer component={Card} sx={{ borderRadius: '12px', mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Doctor</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Appointments</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Patients Seen</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topDoctors.map((doc) => (
              <TableRow key={doc.name}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.appointments}</TableCell>
                <TableCell>{doc.patientsSeen}</TableCell>
                <TableCell>{doc.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Appointment Breakdown Table */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
        Appointment Breakdown
      </Typography>
      <TableContainer component={Card} sx={{ borderRadius: '12px', mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Count</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointmentBreakdown.map((row) => (
              <TableRow key={row.type}>
                <TableCell>
                  <Chip
                    label={row.type}
                    size="small"
                    sx={{ bgcolor: row.color, color: '#fff', fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>{row.count}</TableCell>
                <TableCell>{row.percentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Export Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" sx={{ borderColor: BRAND, color: BRAND }}>
          Export Report
        </Button>
      </Box>
    </DashboardLayout>
  );
};

export default Reports;
