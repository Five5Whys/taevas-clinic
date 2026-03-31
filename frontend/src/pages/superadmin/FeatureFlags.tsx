import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Chip,
  Grid,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  useFeatureFlags,
  useToggleFlag,
  useToggleFlagLock,
} from '@/hooks/superadmin/useFeatureFlags';
import { useCountries } from '@/hooks/superadmin/useCountries';
import type { FeatureFlagDto, CountryConfig } from '@/types/superadmin';

// Mock fallback data
const FALLBACK_FLAGS: FeatureFlagDto[] = [
  {
    id: '1',
    key: 'voiceAI',
    name: 'Voice AI',
    description: 'Voice AI transcription for consultations',
    locked: false,
    countries: { india: true, thailand: true, maldives: false },
  },
  {
    id: '2',
    key: 'aiRx',
    name: 'AI Rx Generation',
    description: 'AI-powered prescription generation',
    locked: false,
    countries: { india: true, thailand: false, maldives: false },
  },
  {
    id: '3',
    key: 'abdm',
    name: 'ABDM Integration',
    description: 'Ayushman Bharat Digital Mission integration',
    locked: true,
    countries: { india: true, thailand: false, maldives: false },
  },
  {
    id: '4',
    key: 'nhso',
    name: 'NHSO Claims',
    description: 'National Health Security Office claims',
    locked: true,
    countries: { india: false, thailand: true, maldives: false },
  },
  {
    id: '5',
    key: 'mohMv',
    name: 'MOH Registry (MV)',
    description: 'Ministry of Health Maldives registry',
    locked: true,
    countries: { india: false, thailand: false, maldives: true },
  },
  {
    id: '6',
    key: 'deviceCapture',
    name: 'Device Capture',
    description: 'Medical device data capture',
    locked: false,
    countries: { india: true, thailand: true, maldives: true },
  },
  {
    id: '7',
    key: 'whatsapp',
    name: 'WhatsApp Integration',
    description: 'WhatsApp messaging for patient communication',
    locked: false,
    countries: { india: true, thailand: true, maldives: false },
  },
  {
    id: '8',
    key: 'familyEHR',
    name: 'Family EHR',
    description: 'Family-linked electronic health records',
    locked: false,
    countries: { india: false, thailand: false, maldives: false },
  },
];

const FALLBACK_COUNTRIES: Pick<CountryConfig, 'id' | 'name' | 'flagEmoji' | 'clinicCount' | 'doctorCount'>[] = [
  { id: 'india', name: 'India', flagEmoji: '🇮🇳', clinicCount: 8, doctorCount: 31 },
  { id: 'thailand', name: 'Thailand', flagEmoji: '🇹🇭', clinicCount: 3, doctorCount: 11 },
  { id: 'maldives', name: 'Maldives', flagEmoji: '🇲🇻', clinicCount: 1, doctorCount: 5 },
];

const COUNTRY_CHIP_COLORS: Record<string, string> = {
  india: '#5519E6',
  thailand: '#A046F0',
  maldives: '#FF8232',
};

const FeatureFlags: React.FC = () => {
  const theme = useTheme();

  const { data: flagsData, isLoading: flagsLoading } = useFeatureFlags();
  const { data: countriesData, isLoading: countriesLoading } = useCountries();
  const toggleFlag = useToggleFlag();
  const toggleLock = useToggleFlagLock();

  const flags: FeatureFlagDto[] = flagsData ?? FALLBACK_FLAGS;
  const countries = countriesData ?? FALLBACK_COUNTRIES;

  const isLoading = flagsLoading || countriesLoading;

  // Build a lookup of country id -> { doctorCount, clinicCount } for impact calculation
  const countryLookup = useMemo(() => {
    const map: Record<string, { doctorCount: number; clinicCount: number }> = {};
    for (const c of countries) {
      map[c.id] = { doctorCount: c.doctorCount, clinicCount: c.clinicCount };
    }
    return map;
  }, [countries]);

  const handleToggle = (flag: FeatureFlagDto, countryId: string) => {
    if (flag.locked) return;
    const current = flag.countries[countryId] ?? false;
    toggleFlag.mutate({ flagId: flag.id, countryId, enabled: !current });
  };

  const handleLockToggle = (flag: FeatureFlagDto) => {
    toggleLock.mutate(flag.id);
  };

  const calculateImpact = (flag: FeatureFlagDto) => {
    let enabledCount = 0;
    let affectedDoctors = 0;
    let affectedClinics = 0;

    for (const country of countries) {
      if (flag.countries[country.id]) {
        enabledCount++;
        const lookup = countryLookup[country.id];
        if (lookup) {
          affectedDoctors += lookup.doctorCount;
          affectedClinics += lookup.clinicCount;
        }
      }
    }

    return { enabledCount, affectedDoctors, affectedClinics };
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Features">
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Features">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Manage feature availability by country. Click lock icons to prevent
          accidental changes.
        </Typography>

        {/* Feature Flags Table */}
        <Card sx={{ mb: 4, overflowX: 'auto' }}>
          <TableContainer>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead sx={{ backgroundColor: theme.palette.background.default }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: '20%' }}>
                    Feature
                  </TableCell>
                  {countries.map((country) => (
                    <TableCell
                      key={country.id}
                      align="center"
                      sx={{ fontWeight: 700, width: '15%' }}
                    >
                      {country.flagEmoji} {country.name}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: 700, width: '10%' }}>
                    Lock
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flags.map((flag) => (
                  <TableRow
                    key={flag.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {flag.name}
                    </TableCell>
                    {countries.map((country) => (
                      <TableCell key={country.id} align="center">
                        <Switch
                          checked={flag.countries[country.id] ?? false}
                          onChange={() => handleToggle(flag, country.id)}
                          disabled={flag.locked}
                          size="small"
                        />
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <Box
                        onClick={() => handleLockToggle(flag)}
                        sx={{
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: '6px',
                          backgroundColor: flag.locked
                            ? '#FF823215'
                            : theme.palette.action.hover,
                          color: flag.locked ? '#FF8232' : 'inherit',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: flag.locked
                              ? '#FF823225'
                              : theme.palette.action.selected,
                          },
                        }}
                      >
                        {flag.locked ? (
                          <Lock sx={{ fontSize: 18 }} />
                        ) : (
                          <LockOpen sx={{ fontSize: 18 }} />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* AI Impact Preview */}
        <Card sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 3 }}
          >
            AI Impact Preview
          </Typography>

          <Grid container spacing={3}>
            {flags.map((flag) => {
              const hasEnabledCountry = countries.some(
                (c) => flag.countries[c.id]
              );
              if (!hasEnabledCountry) {
                return null; // Skip disabled features
              }

              const impact = calculateImpact(flag);

              return (
                <Grid item xs={12} sm={6} md={4} key={flag.id}>
                  <Box
                    sx={{
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '8px',
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 1.5 }}
                    >
                      {flag.name}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                      {countries.map((country) =>
                        flag.countries[country.id] ? (
                          <Chip
                            key={country.id}
                            label={country.name}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: COUNTRY_CHIP_COLORS[country.id] ?? theme.palette.primary.main,
                              color: COUNTRY_CHIP_COLORS[country.id] ?? theme.palette.primary.main,
                            }}
                          />
                        ) : null
                      )}
                    </Box>

                    <Typography variant="caption" color="textSecondary">
                      Affected: {impact.affectedDoctors} doctors,{' '}
                      {impact.affectedClinics} clinics
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default FeatureFlags;
