import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const BRAND = '#5519E6';
const SUB = '#6B7280';

type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ASSIGN' | 'CONFIG';

const ACTION_COLORS: Record<ActionType, { bg: string; color: string }> = {
  CREATE: { bg: '#10B98120', color: '#059669' },
  UPDATE: { bg: '#3B82F620', color: '#2563EB' },
  DELETE: { bg: '#EF444420', color: '#DC2626' },
  LOGIN:  { bg: '#8B5CF620', color: '#7C3AED' },
  LOGOUT: { bg: '#6B728020', color: '#4B5563' },
  ASSIGN: { bg: '#F59E0B20', color: '#D97706' },
  CONFIG: { bg: '#06B6D420', color: '#0891B2' },
};

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  loginVia: string;
  action: ActionType;
  resource: string;
  details: string;
  ip: string;
  country: string;
}

const COUNTRIES = [
  { code: '', label: 'All Countries' },
  { code: 'IN', label: '🇮🇳 India' },
  { code: 'TH', label: '🇹🇭 Thailand' },
  { code: 'MV', label: '🇲🇻 Maldives' },
];

const MOCK_ENTRIES: AuditEntry[] = [
  { id: 'a-001', timestamp: '2026-03-31 09:15:22', user: 'Taevas Admin', role: 'SUPERADMIN', loginVia: '+919876543210', action: 'LOGIN', resource: 'Auth', details: 'Logged in via phone', ip: '192.168.1.10 (Pune, IN)', country: 'IN' },
  { id: 'a-002', timestamp: '2026-03-31 09:18:05', user: 'Taevas Admin', role: 'SUPERADMIN', loginVia: '+919876543210', action: 'CREATE', resource: 'User', details: 'Created user Priya Das with phone +919876543215', ip: '192.168.1.10 (Pune, IN)', country: 'IN' },
  { id: 'a-003', timestamp: '2026-03-31 09:20:12', user: 'Taevas Admin', role: 'SUPERADMIN', loginVia: '+919876543210', action: 'ASSIGN', resource: 'User', details: 'Assigned DOCTOR role to Dr. Rajesh Kumar @ ENT Care Center, Pune', ip: '192.168.1.10 (Pune, IN)', country: 'IN' },
  { id: 'a-004', timestamp: '2026-03-31 09:25:30', user: 'Taevas Admin', role: 'SUPERADMIN', loginVia: '+919876543210', action: 'CONFIG', resource: 'Country', details: 'Updated Thailand login config: enabled email login', ip: '192.168.1.10 (Pune, IN)', country: 'TH' },
  { id: 'a-005', timestamp: '2026-03-31 09:30:45', user: 'Taevas Admin', role: 'SUPERADMIN', loginVia: '+919876543210', action: 'UPDATE', resource: 'Clinic', details: 'Updated ENT Care Center, Pune — changed operating hours', ip: '192.168.1.10 (Pune, IN)', country: 'IN' },
  { id: 'a-006', timestamp: '2026-03-30 14:10:00', user: 'Sunita Rao', role: 'CLINIC_ADMIN', loginVia: 'sunita@entcare.in', action: 'LOGIN', resource: 'Auth', details: 'Logged in via email', ip: '10.0.0.55 (Mumbai, IN)', country: 'IN' },
  { id: 'a-007', timestamp: '2026-03-30 14:15:33', user: 'Sunita Rao', role: 'CLINIC_ADMIN', loginVia: 'sunita@entcare.in', action: 'CREATE', resource: 'Patient', details: 'Registered patient Anita Sharma', ip: '10.0.0.55 (Mumbai, IN)', country: 'IN' },
  { id: 'a-008', timestamp: '2026-03-30 11:00:00', user: 'Dr. Rajesh Kumar', role: 'DOCTOR', loginVia: '+919876543212', action: 'UPDATE', resource: 'Prescription', details: 'Updated prescription #RX-2026-0042 for Anita Sharma', ip: '10.0.0.88 (Pune, IN)', country: 'IN' },
  { id: 'a-009', timestamp: '2026-03-29 16:45:00', user: 'Taevas Admin', role: 'SUPERADMIN', loginVia: '+919876543210', action: 'DELETE', resource: 'Feature Flag', details: 'Deleted feature flag: beta_telemedicine', ip: '192.168.1.10 (Pune, IN)', country: 'IN' },
  { id: 'a-010', timestamp: '2026-03-29 10:30:00', user: 'Meera Nair', role: 'NURSE', loginVia: '+669876543214', action: 'LOGIN', resource: 'Auth', details: 'Logged in via phone', ip: '10.0.0.72 (Bangkok, TH)', country: 'TH' },
  { id: 'a-011', timestamp: '2026-03-29 09:00:00', user: 'Somchai Patel', role: 'DOCTOR', loginVia: '+66812345678', action: 'CREATE', resource: 'Encounter', details: 'Created encounter for patient Niran W.', ip: '10.0.0.80 (Bangkok, TH)', country: 'TH' },
  { id: 'a-012', timestamp: '2026-03-28 15:20:00', user: 'Ahmed Hassan', role: 'CLINIC_ADMIN', loginVia: '+9607654321', action: 'CONFIG', resource: 'Clinic', details: 'Updated Male Central Clinic schedule', ip: '10.0.0.90 (Male, MV)', country: 'MV' },
];

const AuditLog: React.FC = () => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<ActionType | ''>('');
  const [countryFilter, setCountryFilter] = useState('');

  const filtered = MOCK_ENTRIES.filter(e => {
    const matchesSearch = `${e.user} ${e.resource} ${e.details} ${e.ip}`.toLowerCase().includes(search.toLowerCase());
    const matchesAction = !actionFilter || e.action === actionFilter;
    const matchesCountry = !countryFilter || e.country === countryFilter;
    return matchesSearch && matchesAction && matchesCountry;
  });

  return (
    <DashboardLayout pageTitle="Audit Log">
      <Box sx={{ px: 3, py: 2.5 }}>
        {/* Header */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Audit Log</Typography>
          <Typography variant="body2" sx={{ color: SUB }}>Track all actions across the platform</Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          <TextField
            size="small" placeholder="Search by user, resource, details, IP..."
            value={search} onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Country</InputLabel>
            <Select value={countryFilter} label="Country" onChange={e => setCountryFilter(e.target.value)}>
              {COUNTRIES.map(c => (
                <MenuItem key={c.code} value={c.code}>{c.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Action</InputLabel>
            <Select value={actionFilter} label="Action" onChange={e => setActionFilter(e.target.value as ActionType | '')}>
              <MenuItem value="">All</MenuItem>
              {(Object.keys(ACTION_COLORS) as ActionType[]).map(a => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Table */}
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#F8F9FA' }}>
                  {['Timestamp', 'Country', 'User', 'Login Via', 'Role', 'Action', 'Resource', 'Details', 'IP'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '11px', color: SUB, py: 1.25 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(e => {
                  const ac = ACTION_COLORS[e.action];
                  return (
                    <TableRow key={e.id} sx={{ '&:hover': { background: '#F8F9FC' } }}>
                      <TableCell sx={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: SUB, whiteSpace: 'nowrap' }}>
                        <Tooltip title={e.timestamp} arrow placement="top">
                          <span>{e.timestamp.split(' ')[0]?.slice(5)} {e.timestamp.split(' ')[1]?.slice(0, 5)}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ fontSize: '12px' }}>
                        {COUNTRIES.find(c => c.code === e.country)?.label.slice(0, 4) || e.country}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>{e.user}</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: SUB, whiteSpace: 'nowrap' }}>{e.loginVia}</TableCell>
                      <TableCell>
                        <Chip label={e.role} size="small" sx={{ fontWeight: 700, fontSize: '9px', height: 20, background: `${BRAND}15`, color: BRAND }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={e.action} size="small" sx={{ fontWeight: 700, fontSize: '10px', height: 22, background: ac.bg, color: ac.color }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>{e.resource}</TableCell>
                      <TableCell sx={{ fontSize: '11px', color: SUB, maxWidth: 300 }}>{e.details}</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: SUB }}>{e.ip}</TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4, color: SUB }}>No audit entries found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default AuditLog;
