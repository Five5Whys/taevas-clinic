import React, { useState } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Checkbox,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ScheduleRow {
  day: string;
  morningStart: string;
  morningEnd: string;
  eveningStart: string;
  eveningEnd: string;
  closed: boolean;
}

const ScheduleConfig: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleRow[]>([
    {
      day: 'Monday',
      morningStart: '09:00',
      morningEnd: '12:00',
      eveningStart: '15:00',
      eveningEnd: '18:00',
      closed: false,
    },
    {
      day: 'Tuesday',
      morningStart: '09:00',
      morningEnd: '12:00',
      eveningStart: '15:00',
      eveningEnd: '18:00',
      closed: false,
    },
    {
      day: 'Wednesday',
      morningStart: '09:00',
      morningEnd: '12:00',
      eveningStart: '15:00',
      eveningEnd: '18:00',
      closed: false,
    },
    {
      day: 'Thursday',
      morningStart: '09:00',
      morningEnd: '12:00',
      eveningStart: '15:00',
      eveningEnd: '18:00',
      closed: false,
    },
    {
      day: 'Friday',
      morningStart: '09:00',
      morningEnd: '12:00',
      eveningStart: '15:00',
      eveningEnd: '18:00',
      closed: false,
    },
    {
      day: 'Saturday',
      morningStart: '10:00',
      morningEnd: '13:00',
      eveningStart: '16:00',
      eveningEnd: '19:00',
      closed: false,
    },
    {
      day: 'Sunday',
      morningStart: '00:00',
      morningEnd: '00:00',
      eveningStart: '00:00',
      eveningEnd: '00:00',
      closed: true,
    },
  ]);

  const [slotDuration, setSlotDuration] = useState(30);
  const [maxTokens, setMaxTokens] = useState(40);

  const handleScheduleChange = (
    index: number,
    field: keyof ScheduleRow,
    value: string | boolean
  ) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  const handleSave = () => {
    console.log('Schedule saved:', { schedule, slotDuration, maxTokens });
    alert('Schedule configuration saved successfully!');
  };

  return (
    <DashboardLayout pageTitle="Schedule Configuration">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* Clinic Hours Grid */}
          <Card>
            <CardHeader title="Clinic Hours" />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Day</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        Morning Start
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        Morning End
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        Evening Start
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        Evening End
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="center">
                        Closed
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedule.map((row, index) => (
                      <TableRow key={row.day}>
                        <TableCell sx={{ fontWeight: 600 }}>{row.day}</TableCell>
                        <TableCell>
                          <TextField
                            type="time"
                            value={row.morningStart}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                'morningStart',
                                e.target.value
                              )
                            }
                            disabled={row.closed}
                            size="small"
                            sx={{ width: 120 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="time"
                            value={row.morningEnd}
                            onChange={(e) =>
                              handleScheduleChange(index, 'morningEnd', e.target.value)
                            }
                            disabled={row.closed}
                            size="small"
                            sx={{ width: 120 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="time"
                            value={row.eveningStart}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                'eveningStart',
                                e.target.value
                              )
                            }
                            disabled={row.closed}
                            size="small"
                            sx={{ width: 120 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="time"
                            value={row.eveningEnd}
                            onChange={(e) =>
                              handleScheduleChange(index, 'eveningEnd', e.target.value)
                            }
                            disabled={row.closed}
                            size="small"
                            sx={{ width: 120 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={row.closed}
                            onChange={(e) =>
                              handleScheduleChange(index, 'closed', e.target.checked)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Slot Configuration */}
          <Card>
            <CardHeader title="Slot Configuration" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Slot Duration</InputLabel>
                  <Select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value as number)}
                    label="Slot Duration"
                  >
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={20}>20 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Max Tokens per Day"
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  sx={{ minWidth: 200 }}
                />
              </Box>

              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                  mt: 3,
                }}
                onClick={handleSave}
              >
                Save Schedule
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </DashboardLayout>
  );
};

export default ScheduleConfig;
