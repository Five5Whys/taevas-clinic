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
  Alert,
  CircularProgress,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useClinicReport } from '@/hooks/clinicadmin/useReports';

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

// ─── Default colors for breakdown types ───────────────────────────────────────
const BREAKDOWN_COLORS: Record<string, string> = {
  'Follow-up': '#5519E6',
  'New Visit': '#10B981',
  'Surgery Consult': '#F59E0B',
  'Emergency': '#EF4444',
};

// ─── Reports Page ─────────────────────────────────────────────────────────────
const Reports: React.FC = () => {
  const { data: reportData, isLoading } = useClinicReport();
  const [period, setPeriod] = useState('This Month');

  const stats = reportData?.stats ?? {};
  const topDoctors: any[] = reportData?.topDoctors ?? [];
  const appointmentBreakdown: any[] = (reportData?.appointmentBreakdown ?? []).map((row: any) => ({
    ...row,
    color: row.color ?? BREAKDOWN_COLORS[row.type] ?? '#6B7280',
  }));

  const handlePeriodChange = (event: SelectChangeEvent<string>) => {
    setPeriod(event.target.value);
  };

  return (
    <DashboardLayout pageTitle="Reports">
      <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
        🚧 This feature is under development — coming soon!
      </Alert>
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
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: BRAND }} />
        </Box>
      ) : (
      <>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
        <StatCard value={stats.totalAppointments ?? 0} label="Total Appointments" />
        <StatCard value={stats.newPatients ?? 0} label="New Patients" />
        <StatCard value={stats.revenue ?? '---'} label="Revenue" />
        <StatCard value={stats.cancellationRate ?? '---'} label="Cancellation Rate" />
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
      </>
      )}
    </DashboardLayout>
  );
};

export default Reports;
