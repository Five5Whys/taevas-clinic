import { useState } from 'react';
import {
  Box, Typography, Paper, Chip, CircularProgress, Alert, TablePagination,
  Accordion, AccordionSummary, AccordionDetails, Stack, Divider, Grid, Tooltip, IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Medication as MedicationIcon,
  LocalHospital as DiagnosisIcon,
  StickyNote2Outlined as NotesIcon,
  Person as DoctorIcon,
  CalendarToday as DateIcon,
  LightbulbOutlined as BulbIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePatientPrescriptions } from '../../hooks/patient';
import { toTitle } from '@/utils/helpers';

type RxItem = {
  id: string;
  medicineName: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
};
type Rx = {
  id: string;
  doctorName?: string;
  diagnosis?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
  items?: RxItem[];
};

const statusColor = (s?: string): 'success' | 'default' | 'warning' | 'error' => {
  const v = (s || '').toUpperCase();
  if (v === 'ACTIVE') return 'success';
  if (v === 'EXPIRED' || v === 'CANCELLED') return 'error';
  if (v === 'PAUSED') return 'warning';
  return 'default';
};

const tips = (
  <Box sx={{ fontSize: 13, lineHeight: 1.6 }}>
    <Box sx={{ fontWeight: 600, mb: 0.5 }}>Prescription Tips</Box>
    <Box>• Tap a row to expand full drug details, dosage and instructions</Box>
    <Box>• Follow dosage timing and duration exactly as prescribed</Box>
    <Box>• Complete the full course even if you feel better</Box>
    <Box>• Contact your doctor if side effects appear</Box>
  </Box>
);

const Prescriptions = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedId, setExpandedId] = useState<string | false>(false);
  const { data, isLoading, error } = usePatientPrescriptions({ page, size: rowsPerPage });

  const list: Rx[] = Array.isArray(data) ? data : (data?.content || []);

  return (
    <DashboardLayout pageTitle="My Prescriptions">
      <Box sx={{ px: 3, py: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Tooltip title={tips} arrow placement="bottom">
            <IconButton
              size="small"
              aria-label="prescription tips"
              sx={{
                color: '#f9a825',
                bgcolor: 'rgba(249,168,37,0.08)',
                border: '1px solid rgba(249,168,37,0.35)',
                '&:hover': { bgcolor: 'rgba(249,168,37,0.15)' },
              }}
            >
              <BulbIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" fontWeight={700}>My Prescriptions</Typography>
        </Stack>

        {isLoading && <CircularProgress />}
        {error && <Alert severity="error">Failed to load prescriptions</Alert>}

        {!isLoading && !error && list.length === 0 && (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
            <Typography color="text.secondary">No prescriptions yet.</Typography>
          </Paper>
        )}

        {list.length > 0 && (
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            {list.map((rx, idx) => (
              <Accordion
                key={rx.id}
                disableGutters
                elevation={0}
                expanded={expandedId === rx.id}
                onChange={(_, isExp) => setExpandedId(isExp ? rx.id : false)}
                sx={{
                  '&:before': { display: 'none' },
                  borderBottom: idx < list.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 0.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1.2} alignItems="center" flexWrap="wrap" mb={0.4}>
                      <Typography fontWeight={600}>{rx.diagnosis || 'Prescription'}</Typography>
                      <Chip label={toTitle(rx.status)} size="small" color={statusColor(rx.status)} variant="outlined" />
                      <Chip
                        icon={<MedicationIcon sx={{ fontSize: 14 }} />}
                        label={`${rx.items?.length ?? 0} Medicine${(rx.items?.length ?? 0) === 1 ? '' : 's'}`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ color: 'text.secondary', fontSize: 13 }}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                        <DoctorIcon sx={{ fontSize: 14 }} /> {rx.doctorName || '—'}
                      </Box>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                        <DateIcon sx={{ fontSize: 14 }} /> {rx.createdAt?.split('T')[0] || '—'}
                      </Box>
                    </Stack>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5, bgcolor: 'rgba(0,0,0,0.015)' }}>
                  {(rx.items && rx.items.length > 0) && (
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={0.7} alignItems="center" mb={1}>
                        <MedicationIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight={700}>Medicines</Typography>
                      </Stack>
                      <Stack spacing={1}>
                        {rx.items.map((it, i) => (
                          <Paper key={it.id} variant="outlined" sx={{ p: 1.5, bgcolor: 'background.paper' }}>
                            <Stack direction="row" alignItems="center" spacing={1.2}>
                              <Box
                                sx={{
                                  width: 28, height: 28, borderRadius: '50%',
                                  bgcolor: 'primary.main', color: 'white',
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 12, fontWeight: 700,
                                }}
                              >{i + 1}</Box>
                              <Typography fontWeight={600}>{it.medicineName}</Typography>
                            </Stack>
                            <Grid container spacing={1.5} sx={{ mt: 0.5, pl: 5 }}>
                              {it.dosage && (
                                <Grid item xs={12} sm={4}>
                                  <Typography variant="caption" color="text.secondary">Dosage</Typography>
                                  <Typography variant="body2">{it.dosage}</Typography>
                                </Grid>
                              )}
                              {it.frequency && (
                                <Grid item xs={12} sm={4}>
                                  <Typography variant="caption" color="text.secondary">Frequency</Typography>
                                  <Typography variant="body2">{toTitle(it.frequency)}</Typography>
                                </Grid>
                              )}
                              {it.duration && (
                                <Grid item xs={12} sm={4}>
                                  <Typography variant="caption" color="text.secondary">Duration</Typography>
                                  <Typography variant="body2">{it.duration}</Typography>
                                </Grid>
                              )}
                              {it.instructions && (
                                <Grid item xs={12}>
                                  <Typography variant="caption" color="text.secondary">Instructions</Typography>
                                  <Typography variant="body2">{it.instructions}</Typography>
                                </Grid>
                              )}
                            </Grid>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {rx.diagnosis && (
                    <>
                      <Divider sx={{ my: 1.5 }} />
                      <Stack direction="row" spacing={0.7} alignItems="center" mb={0.5}>
                        <DiagnosisIcon sx={{ fontSize: 16, color: 'error.main' }} />
                        <Typography variant="subtitle2" fontWeight={700}>Diagnosis</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                        {rx.diagnosis}
                      </Typography>
                    </>
                  )}

                  {rx.notes && (
                    <>
                      <Divider sx={{ my: 1.5 }} />
                      <Stack direction="row" spacing={0.7} alignItems="center" mb={0.5}>
                        <NotesIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="subtitle2" fontWeight={700}>Doctor's Notes</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                        {rx.notes}
                      </Typography>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
            {!Array.isArray(data) && typeof data?.totalElements === 'number' && (
              <TablePagination
                component="div"
                count={data.totalElements || 0}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              />
            )}
          </Paper>
        )}
      </Box>
    </DashboardLayout>
  );
};
export default Prescriptions;
