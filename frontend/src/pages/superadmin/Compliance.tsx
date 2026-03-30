import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Switch, CircularProgress, Skeleton } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCountries } from '@/hooks/superadmin/useCountries';
import { useCompliance, useToggleModule } from '@/hooks/superadmin/useCompliance';
import { CountryConfig, ComplianceModuleDto } from '@/types/superadmin';

// ─── Mock fallback data ──────────────────────────────────────────────────────
const MOCK_COUNTRIES: Pick<CountryConfig, 'id' | 'name' | 'flagEmoji' | 'clinicCount' | 'doctorCount'>[] = [
  { id: 'india', name: 'India', flagEmoji: '\u{1F1EE}\u{1F1F3}', clinicCount: 0, doctorCount: 0 },
  { id: 'thailand', name: 'Thailand', flagEmoji: '\u{1F1F9}\u{1F1ED}', clinicCount: 0, doctorCount: 0 },
  { id: 'maldives', name: 'Maldives', flagEmoji: '\u{1F1F2}\u{1F1FB}', clinicCount: 0, doctorCount: 0 },
];

const MOCK_MODULES: Record<string, ComplianceModuleDto[]> = {
  india: [
    { id: 'abha', countryId: 'india', moduleKey: 'abha', moduleName: 'ABHA ID Management', description: 'ABDM \u00B7 FHIR R4', enabled: true, sortOrder: 1 },
    { id: 'fhir', countryId: 'india', moduleKey: 'fhir', moduleName: 'FHIR R4 Compliance', description: 'HL7 Standard', enabled: true, sortOrder: 2 },
    { id: 'nmc', countryId: 'india', moduleKey: 'nmc', moduleName: 'NMC Verification', description: 'Doctor registry', enabled: true, sortOrder: 3 },
    { id: 'encryption', countryId: 'india', moduleKey: 'encryption', moduleName: 'End-to-End Encryption', description: 'AES-256 at rest', enabled: true, sortOrder: 4 },
  ],
  thailand: [
    { id: 'nhso', countryId: 'thailand', moduleKey: 'nhso', moduleName: 'NHSO Claims Integration', description: 'Auto-submit', enabled: true, sortOrder: 1 },
    { id: 'pdpa', countryId: 'thailand', moduleKey: 'pdpa', moduleName: 'PDPA Compliance', description: 'Privacy law', enabled: true, sortOrder: 2 },
    { id: 'moph', countryId: 'thailand', moduleKey: 'moph', moduleName: 'MOPH Standards', description: 'Gov standard', enabled: true, sortOrder: 3 },
    { id: 'encryption', countryId: 'thailand', moduleKey: 'encryption', moduleName: 'End-to-End Encryption', description: 'AES-256 at rest', enabled: true, sortOrder: 4 },
  ],
  maldives: [
    { id: 'mohRegistry', countryId: 'maldives', moduleKey: 'mohRegistry', moduleName: 'MOH Registry Integration', description: 'Real-time sync', enabled: true, sortOrder: 1 },
    { id: 'pdpaBaseline', countryId: 'maldives', moduleKey: 'pdpaBaseline', moduleName: 'PDPA Baseline', description: 'Privacy', enabled: true, sortOrder: 2 },
    { id: 'encryption', countryId: 'maldives', moduleKey: 'encryption', moduleName: 'End-to-End Encryption', description: 'AES-256 at rest', enabled: false, sortOrder: 3 },
  ],
};

const Compliance: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('');

  // Fetch countries from API, fall back to mock
  const { data: countriesData, isLoading: countriesLoading } = useCountries();
  const countries = countriesData ?? MOCK_COUNTRIES;

  // Auto-select first country when countries load
  useEffect(() => {
    if (!selectedId && countries.length > 0) {
      setSelectedId(countries[0].id);
    }
  }, [countries, selectedId]);

  // Fetch compliance modules for selected country
  const { data: modulesData, isLoading: modulesLoading } = useCompliance(selectedId);
  const modules: ComplianceModuleDto[] = modulesData ?? MOCK_MODULES[selectedId] ?? [];

  // Toggle mutation
  const toggleModule = useToggleModule();

  const handleToggle = (moduleId: string) => {
    toggleModule.mutate({ countryId: selectedId, moduleId });
  };

  const activeCount = modules.filter((m) => m.enabled).length;
  const selectedCountry = countries.find((c) => c.id === selectedId);

  return (
    <DashboardLayout pageTitle="Compliance">
      <Box sx={{ px: 3, py: 2, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', gap: 1.5, overflow: 'hidden' }}>

        {/* Country pill tabs */}
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          {countriesLoading ? (
            <>
              <Skeleton variant="rounded" width={120} height={34} sx={{ borderRadius: '20px' }} />
              <Skeleton variant="rounded" width={120} height={34} sx={{ borderRadius: '20px' }} />
              <Skeleton variant="rounded" width={120} height={34} sx={{ borderRadius: '20px' }} />
            </>
          ) : (
            countries.map((c) => {
              const sel = selectedId === c.id;
              return (
                <Box
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 2, py: 0.75, borderRadius: '20px',
                    border: '1.5px solid',
                    borderColor: sel ? '#5519E6' : '#E5E7EB',
                    background: sel ? '#5519E6' : '#fff',
                    cursor: 'pointer', transition: 'all 0.15s',
                    '&:hover': { borderColor: '#5519E6', background: sel ? '#4410C0' : '#F5F0FF' },
                  }}
                >
                  <Typography sx={{ fontSize: '14px', lineHeight: 1 }}>{c.flagEmoji}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '13px', color: sel ? '#fff' : '#374151', lineHeight: 1 }}>{c.name}</Typography>
                </Box>
              );
            })
          )}
        </Box>

        {/* Modules card */}
        <Card sx={{ flex: 1, overflow: 'hidden' }}>
          <CardContent sx={{ p: 2, pb: '16px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {modulesLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <CircularProgress size={32} sx={{ color: '#5519E6' }} />
              </Box>
            ) : (
              <>
                {/* Header row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexShrink: 0 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {selectedCountry?.flagEmoji} {selectedCountry?.name} — Compliance Modules
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                      {activeCount} of {modules.length} active
                    </Typography>
                  </Box>
                  <Box sx={{
                    px: 1.5, py: 0.4, borderRadius: '12px',
                    background: activeCount === modules.length ? '#CDDC5018' : '#FF823218',
                    border: `1px solid ${activeCount === modules.length ? '#CDDC5040' : '#FF823440'}`,
                  }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: activeCount === modules.length ? '#6B7A00' : '#B85600' }}>
                      {activeCount === modules.length ? '\u2713 All Active' : `${modules.length - activeCount} Inactive`}
                    </Typography>
                  </Box>
                </Box>

                {/* Module rows */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1 }}>
                  {modules.map((m) => (
                    <Box
                      key={m.id}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        px: 1.5, py: 0.875,
                        borderRadius: 1.5,
                        background: m.enabled ? '#F9FFDC' : '#F8F9FA',
                        border: `1px solid ${m.enabled ? '#CDDC5050' : '#E5E7EB'}`,
                        transition: 'all 0.15s',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: m.enabled ? '#6B7A00' : '#D1D5DB',
                          boxShadow: m.enabled ? '0 0 0 3px #CDDC5030' : 'none',
                        }} />
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.2, color: '#0A0A0F' }}>
                            {m.moduleName}
                          </Typography>
                          <Typography sx={{ fontSize: '11px', color: 'text.secondary', lineHeight: 1 }}>{m.description}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{
                          fontSize: '10px', fontWeight: 600,
                          color: m.enabled ? '#6B7A00' : '#9CA3AF',
                          fontFamily: '"DM Mono", monospace',
                        }}>
                          {m.enabled ? 'ACTIVE' : 'OFF'}
                        </Typography>
                        <Switch
                          checked={m.enabled}
                          onChange={() => handleToggle(m.id)}
                          size="small"
                          disabled={toggleModule.isPending}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#5519E6' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5519E6' },
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Footer note */}
                <Box sx={{ mt: 1.5, px: 1.5, py: 1, background: '#F8F9FF', border: '1px solid #5519E620', borderRadius: 1.5, flexShrink: 0 }}>
                  <Typography sx={{ fontSize: '11px', color: '#5519E6' }}>
                    {'\uD83D\uDD12'} Changes propagate to all clinics in this country. All data uses AES-256 encryption.
                  </Typography>
                </Box>
              </>
            )}

          </CardContent>
        </Card>

      </Box>
    </DashboardLayout>
  );
};

export default Compliance;
