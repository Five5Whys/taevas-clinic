import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Switch,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useScheduleConfig, useDoctorSchedules, useUpdateScheduleConfig } from '@/hooks/clinicadmin/useConfig';

const BRAND = '#5519E6';
const SUB = '#6B7280';

interface ClinicHoursRow {
  day: string;
  open: string;
  close: string;
  enabled: boolean;
}

interface DoctorOverride {
  name: string;
  slotDuration: number;
  maxPatients: number;
  availableDays: string;
}

const DEFAULT_HOURS: ClinicHoursRow[] = [
  { day: 'Monday', open: '09:00', close: '18:00', enabled: true },
  { day: 'Tuesday', open: '09:00', close: '18:00', enabled: true },
  { day: 'Wednesday', open: '09:00', close: '18:00', enabled: true },
  { day: 'Thursday', open: '09:00', close: '18:00', enabled: true },
  { day: 'Friday', open: '09:00', close: '18:00', enabled: true },
  { day: 'Saturday', open: '09:00', close: '14:00', enabled: true },
  { day: 'Sunday', open: '09:00', close: '18:00', enabled: false },
];

const ScheduleConfig: React.FC = () => {
  const { data: scheduleData, isLoading: scheduleLoading } = useScheduleConfig();
  const { data: doctorData, isLoading: doctorsLoading } = useDoctorSchedules();
  const updateSchedule = useUpdateScheduleConfig();
  const isLoading = scheduleLoading || doctorsLoading;

  const [clinicHours, setClinicHours] = useState<ClinicHoursRow[]>(DEFAULT_HOURS);
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [maxPatientsPerSlot, setMaxPatientsPerSlot] = useState<number>(1);
  const [bufferBetweenSlots, setBufferBetweenSlots] = useState<number>(5);

  const doctorOverrides: DoctorOverride[] = doctorData ?? [];

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (scheduleData) {
      if (scheduleData.clinicHours) setClinicHours(scheduleData.clinicHours);
      if (scheduleData.slotDuration != null) setSlotDuration(scheduleData.slotDuration);
      if (scheduleData.maxPatientsPerSlot != null) setMaxPatientsPerSlot(scheduleData.maxPatientsPerSlot);
      if (scheduleData.bufferBetweenSlots != null) setBufferBetweenSlots(scheduleData.bufferBetweenSlots);
    }
  }, [scheduleData]);

  const handleHoursChange = (
    index: number,
    field: keyof ClinicHoursRow,
    value: string | boolean
  ) => {
    const updated = [...clinicHours];
    updated[index] = { ...updated[index]!, [field]: value } as ClinicHoursRow;
    setClinicHours(updated);
  };

  const handleSave = () => {
    updateSchedule.mutate({ clinicHours, slotDuration, maxPatientsPerSlot, bufferBetweenSlots }, {
      onSuccess: () => setSnackbarOpen(true),
    });
  };

  return (
    <DashboardLayout pageTitle="Schedule Config">
      <Alert severity="warning" variant="outlined" sx={{ mb: 2, borderRadius: '12px', fontWeight: 700, bgcolor: '#FFF8E1', color: '#B45309' }}>
        🚧 This feature is under development — coming soon!
      </Alert>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: BRAND }} />
        </Box>
      ) : (
      <Box sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>
        {/* Header */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: BRAND, mb: 3 }}>
          Operating Hours &amp; Slots
        </Typography>

        {/* Clinic Hours Section */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Clinic Hours
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Day</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Open</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Close</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">
                    Enabled
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clinicHours.map((row, index) => (
                  <TableRow key={row.day}>
                    <TableCell sx={{ fontWeight: 600, color: row.enabled ? 'inherit' : SUB }}>
                      {row.day}
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="time"
                        value={row.open}
                        onChange={(e) => handleHoursChange(index, 'open', e.target.value)}
                        disabled={!row.enabled}
                        size="small"
                        sx={{ width: 140 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="time"
                        value={row.close}
                        onChange={(e) => handleHoursChange(index, 'close', e.target.value)}
                        disabled={!row.enabled}
                        size="small"
                        sx={{ width: 140 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={row.enabled}
                        onChange={(e) => handleHoursChange(index, 'enabled', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: BRAND,
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Slot Configuration Section */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Slot Configuration
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Default Slot Duration</InputLabel>
              <Select
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value as number)}
                label="Default Slot Duration"
              >
                <MenuItem value={15}>15 min</MenuItem>
                <MenuItem value={20}>20 min</MenuItem>
                <MenuItem value={30}>30 min</MenuItem>
                <MenuItem value={45}>45 min</MenuItem>
                <MenuItem value={60}>60 min</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Max Patients Per Slot"
              type="number"
              value={maxPatientsPerSlot}
              onChange={(e) => setMaxPatientsPerSlot(Number(e.target.value))}
              size="small"
              sx={{ width: 200 }}
              inputProps={{ min: 1 }}
            />

            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Buffer Between Slots</InputLabel>
              <Select
                value={bufferBetweenSlots}
                onChange={(e) => setBufferBetweenSlots(e.target.value as number)}
                label="Buffer Between Slots"
              >
                <MenuItem value={0}>0 min</MenuItem>
                <MenuItem value={5}>5 min</MenuItem>
                <MenuItem value={10}>10 min</MenuItem>
                <MenuItem value={15}>15 min</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Card>

        {/* Doctor-specific Overrides Section */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Doctor-specific Overrides
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Doctor Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Custom Slot Duration</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Max Patients</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Available Days</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctorOverrides.map((doc) => (
                  <TableRow key={doc.name}>
                    <TableCell sx={{ fontWeight: 600 }}>{doc.name}</TableCell>
                    <TableCell>{doc.slotDuration} min</TableCell>
                    <TableCell>{doc.maxPatients}</TableCell>
                    <TableCell sx={{ color: SUB }}>{doc.availableDays}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: BRAND,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.2,
              '&:hover': { backgroundColor: '#4414B8' },
            }}
          >
            Save Configuration
          </Button>
        </Box>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            Schedule configuration saved successfully!
          </Alert>
        </Snackbar>
      </Box>
      )}
    </DashboardLayout>
  );
};

export default ScheduleConfig;
