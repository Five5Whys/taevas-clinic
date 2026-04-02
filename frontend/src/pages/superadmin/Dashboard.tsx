import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Checkbox,
  LinearProgress,
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
  <Card sx={{
    background: '#fff',
    borderRadius: '14px',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 4px 12px ${accent}18` },
    '&::before': {
      content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
      background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
    },
  }}>
    <CardContent sx={{ p: '10px 12px', '&:last-child': { pb: '10px' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '22px', color: '#1A1A2E', lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: '10px', fontWeight: 600, mt: 0.25, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</Typography>
        </Box>
        <Box sx={{
          width: 32, height: 32, borderRadius: '10px',
          background: `linear-gradient(135deg, ${accent}15, ${accent}08)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15,
        }}>{icon}</Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
        <Typography sx={{ color: '#22C55E', fontWeight: 700, fontSize: '9px' }}>{delta}</Typography>
      </Box>
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
  { icon: '🌍', value: stats.totalCountries,  label: 'Active Tenants', delta: stats.countryDelta ? `+${stats.countryDelta}%` : '+2 onboarding', accent: '#5519E6' },
  { icon: '🏥', value: stats.totalClinics,    label: 'Live Clinics',     delta: stats.clinicDelta ? `+${stats.clinicDelta}%` : '4 this month',   accent: '#FF8232' },
  { icon: '👨\u200D⚕️', value: stats.totalDoctors, label: 'Doctors',    delta: stats.doctorDelta ? `+${stats.doctorDelta}%` : '11 this month',  accent: '#A046F0' },
  { icon: '🩺', value: stats.totalPatients.toLocaleString(), label: 'Patient Records', delta: stats.patientDelta ? `+${stats.patientDelta}%` : '12% this week', accent: '#CDDC50' },
];

const TENANTS = [
  {
    flag: '🇮🇳', name: 'India',    sub: 'INR · ABDM · 8 clinics', status: 'Active', statusColor: '#6B7A00', statusBg: '#CDDC5020', borderBottom: true,
    loginType: 'Phone', loginIcon: '📱',
    kpis: [{ val: '31', lbl: 'Doctors' }, { val: '6,240', lbl: 'Patients' }, { val: '₹2.1L', lbl: 'Revenue' }],
  },
  {
    flag: '🇹🇭', name: 'Thailand', sub: 'THB · NHSO · 3 clinics', status: 'Active', statusColor: '#6B7A00', statusBg: '#CDDC5020', borderBottom: true,
    loginType: 'Email', loginIcon: '📧',
    kpis: [{ val: '11', lbl: 'Doctors' }, { val: '1,720', lbl: 'Patients' }, { val: '฿48K', lbl: 'Revenue' }],
  },
  {
    flag: '🇲🇻', name: 'Maldives', sub: 'MVR · MOH · 1 clinic',   status: 'Pilot',  statusColor: '#B85600', statusBg: '#FF823220', borderBottom: false,
    loginType: 'Both', loginIcon: '🔑',
    kpis: [{ val: '5', lbl: 'Doctors' }, { val: '460', lbl: 'Patients' }, { val: 'MVR 12K', lbl: 'Revenue' }],
  },
];

const CLINIC_ROLES = [
  { label: '👨‍⚕️ Doctor', bg: '#F9FFDC', border: '#CDDC5040', color: '#6B7A00' },
  { label: '👩‍⚕️ Nurse', bg: '#F0EEFF', border: '#5519E625', color: '#5519E6' },
  { label: '🧑‍💼 Assistant', bg: '#FFF5EE', border: '#FF823220', color: '#FF8232' },
];

const NEWS_CACHE_KEY = 'taevas_daily_news';
const NEWS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24h
const NEWS_ACCENTS = ['#FF8232', '#5519E6', '#CDDC50'];
const NEWS_BGS = ['#FFF5EE', '#F0EEFF', '#F9FFDC'];

type NewsItem = { title: string; body: string; accent: string; bg: string };

const FALLBACK_NEWS: NewsItem[] = [
  { title: 'WHO — Digital Health Guidelines', body: 'New WHO recommendations on EHR interoperability standards.', accent: '#FF8232', bg: '#FFF5EE' },
  { title: 'ABDM — FHIR R4 Mandate', body: 'India mandates FHIR R4 for all ABDM-linked EHR systems by 2027.', accent: '#5519E6', bg: '#F0EEFF' },
  { title: 'Global — AI in Diagnostics', body: 'FDA clears 3 new AI-assisted diagnostic tools this quarter.', accent: '#CDDC50', bg: '#F9FFDC' },
];

function getCachedNews(): NewsItem[] | null {
  try {
    const raw = localStorage.getItem(NEWS_CACHE_KEY);
    if (!raw) return null;
    const { items, ts } = JSON.parse(raw);
    if (Date.now() - ts > NEWS_CACHE_TTL) return null;
    return items;
  } catch { return null; }
}

function setCachedNews(items: NewsItem[]) {
  localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({ items, ts: Date.now() }));
}

// ─── Pending Tasks (dynamic via localStorage) ──────────────────────────────
const PENDING_STORAGE_KEY = 'taevas_sa_pending';

type PendingItem = { id: string; label: string; done: boolean };

const DEFAULT_PENDING: PendingItem[] = [
  { id: 'templates', label: 'Templates — wire save to API', done: false },
  { id: 'user-mgmt', label: 'User Management — API persistence', done: false },
  { id: 'data-import', label: 'Data Import — Start Import handler', done: false },
  { id: 'audit-log', label: 'Audit Log — connect to BE API', done: false },
  { id: 'roster-add', label: 'Global Roster — Add Doctor flow', done: false },
  { id: 'equidor-ts', label: 'Equidor — fix 42 TS errors', done: false },
];

function loadPending(): PendingItem[] {
  try {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PENDING;
  } catch { return DEFAULT_PENDING; }
}

function savePending(items: PendingItem[]) {
  localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(items));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const SuperAdminDashboard: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(getCachedNews() ?? FALLBACK_NEWS);
  const [pending, setPending] = useState<PendingItem[]>(loadPending);
  const doneCount = pending.filter(p => p.done).length;
  const togglePending = (id: string) => {
    const next = pending.map(p => p.id === id ? { ...p, done: !p.done } : p);
    setPending(next);
    savePending(next);
  };

  useEffect(() => {
    if (getCachedNews()) return;
    fetch('https://newsapi.org/v2/everything?q=EHR+OR+%22electronic+health+record%22+OR+%22digital+health%22+OR+%22medical+regulation%22&pageSize=3&sortBy=publishedAt&apiKey=demo')
      .then(r => r.json())
      .then(data => {
        if (data.articles?.length) {
          const items: NewsItem[] = data.articles.slice(0, 3).map((a: { title: string; description: string }, i: number) => ({
            title: a.title?.slice(0, 50) ?? 'Health News',
            body: a.description?.slice(0, 80) ?? '',
            accent: NEWS_ACCENTS[i % 3]!,
            bg: NEWS_BGS[i % 3]!,
          }));
          setNewsItems(items);
          setCachedNews(items);
        }
      })
      .catch(() => { /* use fallback */ });
  }, []);

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

      {/* Row 2 — 4-panel: Tenants | Config | News | Pending */}
      <Grid container spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>

        {/* Tenant Status — compact */}
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ flex: 1, overflow: 'hidden', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 1.5, pb: '12px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '12px', color: '#1A1A2E', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tenants</Typography>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {TENANTS.map((c) => (
                  <Box key={c.name} sx={{
                    p: 1, borderRadius: '10px', background: '#FAFAFA', border: '1px solid #F0F0F0',
                    transition: 'all 0.15s', '&:hover': { background: '#F5F3FF', borderColor: '#5519E620' },
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontSize: 13 }}>{c.flag}</Typography>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '11px', lineHeight: 1, color: '#1A1A2E' }}>{c.name}</Typography>
                          <Typography sx={{ color: '#9CA3AF', fontSize: '9px' }}>{c.sub}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <Box sx={{ px: 0.5, py: 0.15, borderRadius: '4px', background: '#F3F4F6', fontSize: '8px', color: '#6B7280', fontWeight: 600 }}>
                          {c.loginIcon} {c.loginType}
                        </Box>
                        <Box sx={{ px: 0.6, py: 0.15, borderRadius: '4px', background: c.statusBg, fontSize: '8px', color: c.statusColor, fontWeight: 700 }}>
                          {c.status}
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      {c.kpis.map((k) => (
                        <Box key={k.lbl} sx={{ flex: 1, textAlign: 'center', py: 0.3, background: '#fff', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '10px', color: '#1A1A2E' }}>{k.val}</Typography>
                          <Typography sx={{ fontSize: '7px', color: '#9CA3AF', textTransform: 'uppercase' }}>{k.lbl}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Config Inheritance */}
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ flex: 1, overflow: 'hidden', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 1.5, pb: '12px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '12px', color: '#1A1A2E', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Config Inheritance</Typography>

              {/* Level 1 — Global */}
              <Box sx={{ p: 1, background: '#5519E610', border: '1.5px solid #5519E630', borderRadius: 1.5, textAlign: 'center', mb: 0.5 }}>
                <Typography sx={{ color: '#9CA3AF', fontSize: '8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Level 1 — You are here
                </Typography>
                <Typography sx={{ fontWeight: 800, color: '#5519E6', fontSize: '12px' }}>TaevasClinic</Typography>
                <Typography sx={{ color: '#9CA3AF', fontSize: '9px' }}>Sets defaults for ALL tenants</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}><Box sx={{ width: '2px', height: '14px', background: 'linear-gradient(180deg, #5519E640, #5519E615)', borderRadius: 1 }} /></Box>

              {/* Level 2 — Tenants */}
              <Grid container spacing={0.5} sx={{ my: 0.25 }}>
                {[{ flag: '🇮🇳', name: 'India', sub: 'ABDM' }, { flag: '🇹🇭', name: 'Thailand', sub: 'NHSO' }, { flag: '🇲🇻', name: 'Maldives', sub: 'MOH' }].map((c) => (
                  <Grid item xs={4} key={c.name}>
                    <Box sx={{ p: 0.5, background: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: 1.5, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: 12 }}>{c.flag}</Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '9px', lineHeight: 1.2 }}>{c.name}</Typography>
                      <Typography sx={{ color: '#9CA3AF', fontSize: '8px' }}>{c.sub}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}><Box sx={{ width: '2px', height: '14px', background: 'linear-gradient(180deg, #5519E640, #5519E615)', borderRadius: 1 }} /></Box>

              {/* Level 3 — Clinic Admin */}
              <Box sx={{ p: 0.75, background: '#FFF5EE', border: '1px solid #FF823230', borderRadius: 1.5, textAlign: 'center', mt: 0.25 }}>
                <Typography sx={{ fontWeight: 700, color: '#FF8232', fontSize: '11px' }}>Clinic Admin</Typography>
                <Typography sx={{ color: '#9CA3AF', fontSize: '8px' }}>Can override non-locked fields</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}><Box sx={{ width: '2px', height: '14px', background: 'linear-gradient(180deg, #5519E640, #5519E615)', borderRadius: 1 }} /></Box>

              {/* Level 4 — Roles under Clinic */}
              <Grid container spacing={0.5}>
                {CLINIC_ROLES.map((role) => (
                  <Grid item xs={4} key={role.label}>
                    <Box sx={{ p: 0.5, background: role.bg, border: `1px solid ${role.border}`, borderRadius: 1.5, textAlign: 'center' }}>
                      <Typography sx={{ fontWeight: 700, color: role.color, fontSize: '9px', lineHeight: 1.3 }}>{role.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Health & Regulatory News */}
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ flex: 1, overflow: 'hidden', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', background: '#FAFAFF', border: '1px solid #5519E612' }}>
            <CardContent sx={{ p: 1.5, pb: '12px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '12px', color: '#5519E6', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>News</Typography>
              <Stack spacing={0.75} sx={{ flex: 1 }}>
                {newsItems.map((ins, i) => (
                  <Box key={i} sx={{ p: 1, background: ins.bg, borderRadius: '10px', borderLeft: `3px solid ${ins.accent}`, flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '10px', mb: 0.25, color: '#1A1A2E' }}>{ins.title}</Typography>
                    <Typography sx={{ color: '#6B7280', fontSize: '9px' }}>{ins.body}</Typography>
                  </Box>
                ))}
              </Stack>
              <Typography sx={{ color: '#9CA3AF', fontSize: '8px', textAlign: 'right', mt: 0.5 }}>
                Updated: {new Date(JSON.parse(localStorage.getItem(NEWS_CACHE_KEY) ?? '{"ts":0}').ts || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Tasks — last */}
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ flex: 1, overflow: 'hidden', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 1.5, pb: '12px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '12px', color: '#1A1A2E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending</Typography>
                <Chip label={`${doneCount}/${pending.length}`} size="small"
                  sx={{ height: 18, fontSize: '10px', fontWeight: 700, background: doneCount === pending.length ? '#DCFCE7' : '#FEF3C7', color: doneCount === pending.length ? '#16A34A' : '#D97706' }}
                />
              </Box>
              <LinearProgress variant="determinate" value={(doneCount / pending.length) * 100}
                sx={{ height: 3, borderRadius: 2, mb: 1, backgroundColor: '#F3F4F6', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #5519E6, #A046F0)', borderRadius: 2 } }}
              />
              <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                {pending.map((item) => (
                  <Box key={item.id} onClick={() => togglePending(item.id)} sx={{
                    display: 'flex', alignItems: 'center', gap: 0.25, py: 0.4, px: 0.5, borderRadius: '8px',
                    cursor: 'pointer', transition: 'all 0.15s',
                    '&:hover': { background: '#F5F3FF' },
                    opacity: item.done ? 0.5 : 1,
                  }}>
                    <Checkbox checked={item.done} size="small"
                      sx={{ p: 0.25, color: '#D1D5DB', '&.Mui-checked': { color: '#5519E6' } }}
                    />
                    <Typography sx={{
                      fontSize: '10px', fontWeight: 500, color: '#374151', flex: 1,
                      textDecoration: item.done ? 'line-through' : 'none',
                    }}>{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  </DashboardLayout>
  );
};

export default SuperAdminDashboard;
