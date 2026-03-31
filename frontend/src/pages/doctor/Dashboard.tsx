import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDoctorDashboard } from '@/hooks/doctor';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Consult': return '#5519E6';
    case 'Waiting':    return '#FF8232';
    case 'Completed':  return '#6B7A00';
    case 'Upcoming':   return '#A046F0';
    default:           return '#999';
  }
};

// ─── Mini Stat ────────────────────────────────────────────────────────────────
const MiniStat: React.FC<{ icon: string; value: string | number; label: string; delta: string; accent: string }> = ({
  icon, value, label, delta, accent,
}) => (
  <Card sx={{ border: `1.5px solid ${accent}25`, background: `${accent}06`, height: '100%' }}>
    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ fontSize: 18 }}>{icon}</Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '18px', color: accent, lineHeight: 1 }}>{value}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px', display: 'block' }}>{label}</Typography>
        </Box>
      </Box>
      <Typography variant="caption" sx={{ color: '#5519E6', fontWeight: 700, fontSize: '10px', mt: 0.5, display: 'block' }}>
        {delta}
      </Typography>
    </CardContent>
  </Card>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading } = useDoctorDashboard();

  const todaysAppointments = dashboardData?.todaysAppointments ?? dashboardData?.appointments ?? [];
  const pendingReports = dashboardData?.pendingReports ?? [];
  const aiInsights = dashboardData?.aiInsights ?? [];
  const stats = dashboardData?.stats ?? {};
  const queue = dashboardData?.queue ?? {};

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Good morning, Doctor">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
          <CircularProgress sx={{ color: '#5519E6' }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Good morning, Doctor 👋">
      {/* Full-height container — no scroll */}
      <Box sx={{ px: 2.5, py: 2, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', gap: 1.5, overflow: 'hidden' }}>

        {/* Row 1 — Queue Banner */}
        <Card sx={{ border: '1.5px solid #5519E625', background: '#F8F9FF', flexShrink: 0 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>

              {/* Now Serving */}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontSize: '10px', display: 'block' }}>
                  Now Serving
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1, color: '#5519E6' }}>
                  {queue.nowServing ?? todaysAppointments[0]?.token ?? '-'}
                </Typography>
              </Box>

              <Box sx={{ width: '1px', height: 48, bgcolor: '#E5E7EB', flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />

              {/* Up Next */}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontSize: '10px', display: 'block', mb: 0.75 }}>
                  Up Next
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {(queue.upNext ?? todaysAppointments.slice(1, 4).map((a: any) => a.token) ?? []).map((t: any) => (
                    <Box
                      key={t}
                      sx={{
                        width: 34, height: 34,
                        borderRadius: 1.5,
                        background: '#5519E615',
                        border: '1.5px solid #5519E630',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '13px', color: '#5519E6',
                      }}
                    >
                      {t}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ width: '1px', height: 48, bgcolor: '#E5E7EB', flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />

              {/* Stats */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                {[
                  { val: queue.seen ?? stats.seenToday ?? '-', lbl: 'Seen' },
                  { val: queue.waiting ?? stats.waiting ?? '-',  lbl: 'Waiting' },
                  { val: queue.avgWait ?? stats.avgWait ?? '-', lbl: 'Avg Wait' },
                ].map((s) => (
                  <Box key={s.lbl} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, color: '#0A0A0F' }}>{s.val}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>{s.lbl}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Actions */}
              <Box sx={{ ml: 'auto', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: '#5519E6', '&:hover': { backgroundColor: '#4410C0' }, fontWeight: 700 }}
                >
                  Manage Queue
                </Button>
                <Button
                  variant="text"
                  size="small"
                  sx={{ color: 'text.secondary', fontSize: '10px', p: 0 }}
                >
                  📺 TV Display ↗
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Row 2 — Stat Cards */}
        <Grid container spacing={1.5} sx={{ flexShrink: 0 }}>
          <Grid item xs={3}><MiniStat icon="🩺" value={stats.todaysPatients ?? 0}       label="Today's Patients" delta={stats.patientsDelta ?? ''}  accent="#5519E6" /></Grid>
          <Grid item xs={3}><MiniStat icon="💰" value={stats.todaysRevenue ?? '-'} label="Today's Revenue"   delta={stats.revenueDelta ?? ''}       accent="#FF8232" /></Grid>
          <Grid item xs={3}><MiniStat icon="🔬" value={stats.deviceReports ?? 0}        label="Device Reports"   delta={stats.deviceReportsDelta ?? ''}          accent="#A046F0" /></Grid>
          <Grid item xs={3}><MiniStat icon="💬" value={stats.whatsappMsgs ?? 0}       label="WhatsApp Msgs"    delta={stats.whatsappDelta ?? ''}        accent="#25D366" /></Grid>
        </Grid>

        {/* Row 3 — Schedule + Right Column */}
        <Grid container spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>

          {/* Today's Schedule */}
          <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Card sx={{ flex: 1, overflow: 'hidden' }}>
              <CardContent sx={{ p: 2, pb: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25, flexShrink: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Today's Schedule</Typography>
                  <Button variant="text" size="small" sx={{ color: 'text.secondary', fontSize: '11px', minWidth: 0, p: 0.5 }}>
                    View All →
                  </Button>
                </Box>
                <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
                        {['Token', 'Time', 'Patient', 'Reason', 'Status'].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', py: 1 }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {todaysAppointments.map((apt) => (
                        <TableRow
                          key={apt.token}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#F8F9FA' },
                            ...(apt.status === 'In Consult' ? { backgroundColor: '#5519E608' } : {}),
                          }}
                        >
                          <TableCell sx={{ fontWeight: 800, color: '#5519E6', fontSize: '13px' }}>{apt.token}</TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '12px' }}>{apt.time}</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>{apt.patient}</TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '11px' }}>{apt.reason}</TableCell>
                          <TableCell>
                            <Chip
                              label={apt.status}
                              size="small"
                              sx={{
                                backgroundColor: `${getStatusColor(apt.status)}20`,
                                color: getStatusColor(apt.status),
                                fontWeight: 700, fontSize: '10px', height: 20,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Stack spacing={1.5} sx={{ height: '100%' }}>

              {/* Pending Device Reports */}
              <Card sx={{ flex: 1, overflow: 'hidden' }}>
                <CardContent sx={{ p: 2, pb: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexShrink: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>🔴 Pending Device Reports</Typography>
                    <Button variant="text" size="small" sx={{ color: 'text.secondary', fontSize: '11px', minWidth: 0, p: 0.5 }}>All →</Button>
                  </Box>
                  <Stack spacing={0.75} sx={{ flex: 1 }}>
                    {pendingReports.map((r, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 1.25,
                          p: 1, borderRadius: 1.5,
                          background: '#F8F9FA', border: '1px solid #E5E7EB',
                          cursor: 'pointer', '&:hover': { background: '#F0F0F0' },
                        }}
                      >
                        <Box sx={{ width: 30, height: 30, borderRadius: 1.5, background: '#fff', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                          {r.icon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px' }}>
                            {r.type} — {r.patient}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>
                            {r.source}
                          </Typography>
                        </Box>
                        <Chip label={r.badgeLabel} size="small" sx={{ backgroundColor: `${r.badgeColor}20`, color: r.badgeColor, fontWeight: 700, fontSize: '10px', height: 18, flexShrink: 0 }} />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card sx={{ background: '#F8F9FF', border: '1.5px solid #5519E625', flex: 1, overflow: 'hidden' }}>
                <CardContent sx={{ p: 2, pb: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#5519E6', mb: 1, flexShrink: 0 }}>
                    ✨ AI Insights
                  </Typography>
                  <Stack spacing={0.75} sx={{ flex: 1 }}>
                    {aiInsights.map((ins, i) => (
                      <Box
                        key={i}
                        sx={{ p: 1.25, background: ins.bg, borderRadius: 1.5, borderLeft: `3px solid ${ins.accent}`, flex: 1 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px', mb: 0.25 }}>{ins.title}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>{ins.body}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

            </Stack>
          </Grid>

        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
