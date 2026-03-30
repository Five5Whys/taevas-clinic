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
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';

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
  const todaysAppointments = [
    { token: 14, time: '9:40 AM',  patient: 'Anita Sharma', reason: 'Allergic Rhinitis · Follow-up', status: 'In Consult' },
    { token: 15, time: '9:55 AM',  patient: 'Rahul Mehta',  reason: 'Hearing Loss · New Patient',    status: 'Waiting'    },
    { token: 16, time: '10:10 AM', patient: 'Priya Nair',   reason: 'Tinnitus · Audiometry due',     status: 'Waiting'    },
    { token: 17, time: '10:25 AM', patient: 'Kamala Devi',  reason: 'Vertigo · VNG Report ready',    status: 'Upcoming'   },
    { token: 18, time: '10:40 AM', patient: 'Arun Sinha',   reason: 'Sinusitis · Post-op',           status: 'Upcoming'   },
  ];

  const pendingReports = [
    { icon: '🎧', type: 'Audiogram', patient: 'Priya Nair',   source: 'Audecom · 8 min ago',    badgeLabel: 'Review',   badgeColor: '#FF8232' },
    { icon: '⚖️', type: 'VNG',       patient: 'Kamala Devi',  source: 'Equipoise · 22 min ago', badgeLabel: 'Review',   badgeColor: '#FF8232' },
    { icon: '📄', type: 'CBC',       patient: 'Anita Sharma', source: 'AI-extracted · 1h ago',  badgeLabel: 'Ingested', badgeColor: '#5519E6' },
  ];

  const aiInsights = [
    { title: 'Rahul Mehta — 82% No-Show Risk', body: 'WhatsApp reminder sent automatically.', accent: '#FF8232', bg: '#FFF5EE' },
    { title: 'ABDM — ₹20 Credit Earned',       body: "Kamala Devi's VNG filed to HIE.",       accent: '#CDDC50', bg: '#F9FFDC' },
  ];

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
                  14
                </Typography>
              </Box>

              <Box sx={{ width: '1px', height: 48, bgcolor: '#E5E7EB', flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />

              {/* Up Next */}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontSize: '10px', display: 'block', mb: 0.75 }}>
                  Up Next
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {[15, 16, 17].map((t) => (
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
                  { val: '23', lbl: 'Seen' },
                  { val: '7',  lbl: 'Waiting' },
                  { val: '~18m', lbl: 'Avg Wait' },
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
          <Grid item xs={3}><MiniStat icon="🩺" value={30}       label="Today's Patients" delta="↑ 4 more than yesterday"  accent="#5519E6" /></Grid>
          <Grid item xs={3}><MiniStat icon="💰" value="₹18,400" label="Today's Revenue"   delta="↑ 12% vs last week"       accent="#FF8232" /></Grid>
          <Grid item xs={3}><MiniStat icon="🔬" value={8}        label="Device Reports"   delta="3 pending review"          accent="#A046F0" /></Grid>
          <Grid item xs={3}><MiniStat icon="💬" value={15}       label="WhatsApp Msgs"    delta="4 reports received"        accent="#25D366" /></Grid>
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
