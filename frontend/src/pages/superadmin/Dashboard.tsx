import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { useStats } from '@/hooks/superadmin/useDashboard';
import type { DashboardStats } from '@/types/superadmin';

const isMockMode = import.meta.env.VITE_MOCK_AUTH === 'true';

// ─── Mini Stat ─────────────────────────────────────────────────────────────────
const MiniStat: React.FC<{ icon: string; value: string | number; label: string; delta: string; accent: string }> = ({
  icon, value, label, delta, accent,
}) => (
  <Card sx={{ border: `1.5px solid ${accent}25`, background: `${accent}06`, height: '100%' }}>
    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ fontSize: 20 }}>{icon}</Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '20px', color: accent, lineHeight: 1 }}>{value}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px', display: 'block' }}>{label}</Typography>
        </Box>
      </Box>
      <Typography variant="caption" sx={{ color: '#CDDC50', fontWeight: 700, fontSize: '10px', mt: 0.5, display: 'block' }}>
        {delta}
      </Typography>
    </CardContent>
  </Card>
);

// ─── Mini KPI ─────────────────────────────────────────────────────────────────
const KPI: React.FC<{ val: string; lbl: string }> = ({ val, lbl }) => (
  <Box sx={{ flex: 1, textAlign: 'center', py: 0.75, background: '#F8F9FA', borderRadius: 1.5, border: '1px solid #E5E7EB' }}>
    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px' }}>{val}</Typography>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>{lbl}</Typography>
  </Box>
);

// ─── Mock Data (fallback when VITE_MOCK_AUTH=true) ───────────────────────────
const MOCK_STATS: DashboardStats = {
  totalCountries: 3, totalClinics: 12, totalDoctors: 47, totalPatients: 8420,
  countryDelta: 0, clinicDelta: 0, doctorDelta: 0, patientDelta: 12,
};

const buildStatCards = (stats: DashboardStats) => [
  { icon: '🌍', value: stats.totalCountries,  label: 'Active Countries', delta: stats.countryDelta ? `+${stats.countryDelta}%` : '+2 onboarding', accent: '#5519E6' },
  { icon: '🏥', value: stats.totalClinics,    label: 'Live Clinics',     delta: stats.clinicDelta ? `+${stats.clinicDelta}%` : '4 this month',   accent: '#FF8232' },
  { icon: '👨\u200D⚕️', value: stats.totalDoctors, label: 'Doctors',    delta: stats.doctorDelta ? `+${stats.doctorDelta}%` : '11 this month',  accent: '#A046F0' },
  { icon: '🩺', value: stats.totalPatients.toLocaleString(), label: 'Patient Records', delta: stats.patientDelta ? `+${stats.patientDelta}%` : '12% this week', accent: '#CDDC50' },
];

const COUNTRIES = [
  {
    flag: '🇮🇳', name: 'India',    sub: 'INR · ABDM · 8 clinics', status: 'Active', statusColor: '#6B7A00', statusBg: '#CDDC5020', borderBottom: true,
    kpis: [{ val: '31', lbl: 'Doctors' }, { val: '6,240', lbl: 'Patients' }, { val: '₹2.1L', lbl: 'Revenue' }],
  },
  {
    flag: '🇹🇭', name: 'Thailand', sub: 'THB · NHSO · 3 clinics', status: 'Active', statusColor: '#6B7A00', statusBg: '#CDDC5020', borderBottom: true,
    kpis: [{ val: '11', lbl: 'Doctors' }, { val: '1,720', lbl: 'Patients' }, { val: '฿48K', lbl: 'Revenue' }],
  },
  {
    flag: '🇲🇻', name: 'Maldives', sub: 'MVR · MOH · 1 clinic',   status: 'Pilot',  statusColor: '#B85600', statusBg: '#FF823220', borderBottom: false,
    kpis: [{ val: '5', lbl: 'Doctors' }, { val: '460', lbl: 'Patients' }, { val: 'MVR 12K', lbl: 'Revenue' }],
  },
];

const CONFIG_LEVELS = [
  { label: '🌐 Taevas Global',  sub: 'Sets defaults for ALL countries',         bg: '#5519E610', border: '#5519E630', color: '#5519E6' },
  { label: '🏥 Clinic Admin',   sub: 'Can override non-locked fields',           bg: '#FFF5EE',   border: '#FF823230', color: '#FF8232' },
  { label: '👨‍⚕️ Doctor View',  sub: 'Renders from resolved config',            bg: '#F9FFDC',   border: '#CDDC5040', color: '#6B7A00' },
];

const AI_INSIGHTS = [
  { title: 'Thailand — NHSO Token Expiry',   body: '3 clinic NHSO tokens expire in 14 days.',    accent: '#FF8232', bg: '#FFF5EE' },
  { title: 'Maldives — Voice AI not enabled', body: 'Dhivehi STT model ready. Enable in flags.',  accent: '#5519E6', bg: '#F0EEFF' },
  { title: 'India — ABDM Credits',            body: '₹4,200 DHIS credits earned this week.',      accent: '#CDDC50', bg: '#F9FFDC' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const SuperAdminDashboard: React.FC = () => {
  // Use real API when not in mock mode; fall back to mock data
  const { data: apiStats, isLoading, error, refetch } = useStats();
  const stats = isMockMode ? MOCK_STATS : (apiStats ?? MOCK_STATS);
  const STATS = buildStatCards(stats);

  if (!isMockMode && isLoading) return <DashboardLayout pageTitle="Control Center"><LoadingSkeleton /></DashboardLayout>;
  if (!isMockMode && error) return <DashboardLayout pageTitle="Control Center"><ErrorState onRetry={refetch} /></DashboardLayout>;

  return (
  <DashboardLayout pageTitle="Control Center">
    {/* Full-height container — no scroll */}
    <Box sx={{ px: 2.5, py: 2, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', gap: 1.5, overflow: 'hidden' }}>

      {/* Row 1 — 4 Mini Stats */}
      <Grid container spacing={1.5} sx={{ flexShrink: 0 }}>
        {STATS.map((s, i) => (
          <Grid item xs={3} key={i}>
            <MiniStat {...s} />
          </Grid>
        ))}
      </Grid>

      {/* Row 2 — Country Status + Config Inheritance (equal height) */}
      <Grid container spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>

        {/* Country Status */}
        <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ flex: 1, overflow: 'hidden' }}>
            <CardContent sx={{ p: 2, pb: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Country Status</Typography>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {COUNTRIES.map((c) => (
                  <Box key={c.name} sx={{ pb: 1, borderBottom: c.borderBottom ? '1px solid #F3F4F6' : 'none', mb: c.borderBottom ? 1 : 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography sx={{ fontSize: 16 }}>{c.flag}</Typography>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px', lineHeight: 1 }}>{c.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>{c.sub}</Typography>
                        </Box>
                      </Box>
                      <Chip label={c.status} size="small"
                        sx={{ background: c.statusBg, color: c.statusColor, fontWeight: 700, fontSize: '10px', height: 18 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                      {c.kpis.map((k) => <KPI key={k.lbl} val={k.val} lbl={k.lbl} />)}
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Config Inheritance */}
        <Grid item xs={12} md={3.5} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ flex: 1, overflow: 'hidden' }}>
            <CardContent sx={{ p: 2, pb: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Config Inheritance</Typography>

              {/* Level 1 — Global */}
              <Box sx={{ p: 1.25, background: '#5519E610', border: '1.5px solid #5519E630', borderRadius: 1.5, textAlign: 'center', mb: 0.75 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>
                  Level 1 — You are here
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#5519E6', fontSize: '13px' }}>🌐 Taevas Global</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>Sets defaults for ALL countries</Typography>
              </Box>

              <Typography sx={{ textAlign: 'center', color: '#D1D5DB', fontSize: 16, lineHeight: 1 }}>↓</Typography>

              {/* Level 2 — Countries */}
              <Grid container spacing={0.5} sx={{ my: 0.5 }}>
                {[{ flag: '🇮🇳', name: 'India', sub: 'ABDM' }, { flag: '🇹🇭', name: 'Thailand', sub: 'NHSO' }, { flag: '🇲🇻', name: 'Maldives', sub: 'MOH' }].map((c) => (
                  <Grid item xs={4} key={c.name}>
                    <Box sx={{ p: 0.75, background: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: 1.5, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: 14 }}>{c.flag}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '10px', display: 'block', lineHeight: 1.2 }}>{c.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '9px' }}>{c.sub}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Typography sx={{ textAlign: 'center', color: '#D1D5DB', fontSize: 16, lineHeight: 1 }}>↓</Typography>

              {/* Levels 3-4 */}
              {CONFIG_LEVELS.slice(1).map((lvl) => (
                <Box key={lvl.label}>
                  <Box sx={{ p: 1, background: lvl.bg, border: `1px solid ${lvl.border}`, borderRadius: 1.5, textAlign: 'center', mt: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: lvl.color, fontSize: '12px' }}>{lvl.label}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>{lvl.sub}</Typography>
                  </Box>
                  {lvl.label.includes('Clinic') && <Typography sx={{ textAlign: 'center', color: '#D1D5DB', fontSize: 16, lineHeight: 1 }}>↓</Typography>}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Ops Insights */}
        <Grid item xs={12} md={3.5} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ flex: 1, background: '#F8F9FF', border: '1.5px solid #5519E625', overflow: 'hidden' }}>
            <CardContent sx={{ p: 2, pb: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#5519E6', mb: 1.25 }}>✨ AI Ops Insights</Typography>
              <Stack spacing={1} sx={{ flex: 1, justifyContent: 'space-between' }}>
                {AI_INSIGHTS.map((ins, i) => (
                  <Box key={i} sx={{ p: 1.25, background: ins.bg, borderRadius: 1.5, borderLeft: `3px solid ${ins.accent}`, flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px', mb: 0.25 }}>{ins.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>{ins.body}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  </DashboardLayout>
  );
};

export default SuperAdminDashboard;
