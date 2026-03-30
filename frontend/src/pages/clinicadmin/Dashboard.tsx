import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Stack,
  Chip,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  delta?: string;
  deltaColor?: string;
  accent: string;
  bg: string;
}
const StatCard: React.FC<StatCardProps> = ({ icon, value, label, delta, deltaColor, accent, bg }) => (
  <Card sx={{ background: bg, border: `1.5px solid ${accent}30`, height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ fontSize: 26, mb: 1 }}>{icon}</Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: accent, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
      {delta && (
        <Typography variant="caption" sx={{ color: deltaColor ?? '#CDDC50', fontWeight: 700, display: 'block', mt: 0.5 }}>
          {delta}
        </Typography>
      )}
    </CardContent>
  </Card>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const [overrides, setOverrides] = useState({
    clinicDisplayName: 'ENT Care Center, Pune',
    consultationFee: '₹600',
    followupFee: '₹400',
    invoiceFooter: 'Thank you for choosing ENT Care Center',
    showLogoOnRx: true,
  });

  const inheritedConfig = [
    { label: 'Currency',    value: '₹ INR' },
    { label: 'Tax',         value: 'GST 18%' },
    { label: 'Compliance',  value: 'ABDM / ABHA' },
    { label: 'Date Format', value: 'DD/MM/YYYY' },
    { label: 'AI Voice',    value: 'Enabled', badge: true, badgeColor: '#6B7A00', badgeBg: '#CDDC5020' },
    { label: 'WhatsApp Bot',value: 'Enabled', badge: true, badgeColor: '#6B7A00', badgeBg: '#CDDC5020' },
  ];

  const handleSave = () => {
    alert('Clinic overrides saved successfully!');
  };

  return (
    <DashboardLayout pageTitle="Clinic Overview">
      <Container maxWidth="lg" sx={{ py: 3 }}>

        {/* Sub title */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ENT Care Center · Pune, India
          </Typography>
          <Chip
            label="🔒 Some fields locked by Taevas Global"
            size="small"
            sx={{ background: '#FFF5EE', color: '#FF8232', fontWeight: 600, fontSize: '11px' }}
          />
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <StatCard icon="👨‍⚕️" value={8}        label="Doctors on Roster"    accent="#FF8232" bg="#FF823208" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard icon="🩺"   value="1,240"    label="Patient Records"      delta="↑ 42 this week"       accent="#5519E6" bg="#5519E608" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard icon="💰"   value="₹2.1L"   label="This Month Revenue"   delta="↑ 8% vs last month"   accent="#CDDC50" bg="#CDDC5008" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard icon="🛡️"  value="92%"      label="Compliance Score"     delta="ABDM: 2 pending" deltaColor="#FF8232" accent="#A046F0" bg="#A046F008" />
          </Grid>
        </Grid>

        {/* Inherited Config + Clinic Overrides */}
        <Grid container spacing={2.5}>

          {/* Inherited Config */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Inherited Config from Taevas Global
                  </Typography>
                  <Chip label="India · Read-Only" size="small" sx={{ background: '#F3F4F6', color: '#6B7280', fontSize: '10px', height: 20 }} />
                </Box>

                <Stack spacing={0.75}>
                  {inheritedConfig.map((c) => (
                    <Box
                      key={c.label}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        px: 1.5, py: 1,
                        background: '#F8F9FA', borderRadius: 1.5,
                        fontSize: '12.5px',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12.5px' }}>
                        {c.label}
                      </Typography>
                      {c.badge ? (
                        <Chip
                          label={`${c.value} ✓`}
                          size="small"
                          sx={{
                            background: c.badgeBg,
                            color: c.badgeColor,
                            fontWeight: 700,
                            fontSize: '10px',
                            height: 20,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12.5px' }}>
                          {c.value}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>

                <Box
                  sx={{
                    mt: 1.5, px: 1.5, py: 1,
                    background: '#FFF5EE', borderRadius: 1.5,
                    fontSize: '12px', color: '#FF8232',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#FF8232', fontSize: '12px' }}>
                    🔒 These settings are controlled by Taevas Global. Contact Super Admin to change.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Clinic-Level Overrides */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Clinic-Level Overrides
                  </Typography>
                  <Chip label="You can edit these" size="small" sx={{ background: '#FFF5EE', color: '#FF8232', fontWeight: 600, fontSize: '10px', height: 20 }} />
                </Box>

                <Stack spacing={2}>
                  <TextField
                    fullWidth size="small"
                    label="Clinic Display Name"
                    value={overrides.clinicDisplayName}
                    onChange={(e) => setOverrides({ ...overrides, clinicDisplayName: e.target.value })}
                  />
                  <TextField
                    fullWidth size="small"
                    label="Consultation Fee (default)"
                    value={overrides.consultationFee}
                    onChange={(e) => setOverrides({ ...overrides, consultationFee: e.target.value })}
                  />
                  <TextField
                    fullWidth size="small"
                    label="Follow-up Fee"
                    value={overrides.followupFee}
                    onChange={(e) => setOverrides({ ...overrides, followupFee: e.target.value })}
                  />
                  <TextField
                    fullWidth size="small"
                    label="Invoice Footer Note"
                    value={overrides.invoiceFooter}
                    onChange={(e) => setOverrides({ ...overrides, invoiceFooter: e.target.value })}
                    multiline rows={2}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={overrides.showLogoOnRx}
                        onChange={(e) => setOverrides({ ...overrides, showLogoOnRx: e.target.checked })}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF8232' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF8232' },
                        }}
                      />
                    }
                    label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Show Clinic Logo on Prescription</Typography>}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      background: '#FF8232',
                      '&:hover': { background: '#E06020' },
                      fontWeight: 700,
                      mt: 0.5,
                    }}
                  >
                    Save Overrides
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;
