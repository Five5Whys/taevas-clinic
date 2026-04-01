import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCountries } from '@/hooks/superadmin/useCountries';
import {
  useIdFormats,
  useUpdateIdFormat,
  useToggleIdFormatLock,
} from '@/hooks/superadmin/useIdFormats';
import type { CountryConfig, IdFormatTemplateDto } from '@/types/superadmin';

// ---- Types ------------------------------------------------------------------
interface IDFormat {
  id: string;
  entity: string;
  entityType: string;
  prefix: string;
  entityCode: string;
  separator: string;
  padding: number;
  startsAt: number;
  locked: boolean;
}

const genPreview = (f: IDFormat) =>
  `${f.prefix}${f.separator}${f.entityCode}${f.separator}${String(f.startsAt).padStart(f.padding, '0')}`;

// ---- Mock fallback data -----------------------------------------------------
const INITIAL: Record<string, IDFormat[]> = {
  india: [
    { id: 'patient',   entity: 'Patient',   entityType: 'patient',   prefix: 'PT', entityCode: 'EC', separator: '-', padding: 5, startsAt: 42,   locked: true  },
    { id: 'doctor',    entity: 'Doctor',    entityType: 'doctor',    prefix: 'DR', entityCode: 'IN', separator: '-', padding: 4, startsAt: 156,  locked: true  },
    { id: 'encounter', entity: 'Encounter', entityType: 'encounter', prefix: 'EN', entityCode: 'IN', separator: '-', padding: 6, startsAt: 1234, locked: false },
    { id: 'clinic',    entity: 'Clinic',    entityType: 'clinic',    prefix: 'CL', entityCode: 'IN', separator: '-', padding: 3, startsAt: 8,    locked: true  },
  ],
  thailand: [
    { id: 'patient',   entity: 'Patient',   entityType: 'patient',   prefix: 'PT', entityCode: 'TH', separator: '-', padding: 5, startsAt: 28,  locked: true  },
    { id: 'doctor',    entity: 'Doctor',    entityType: 'doctor',    prefix: 'DR', entityCode: 'TH', separator: '-', padding: 4, startsAt: 42,  locked: true  },
    { id: 'encounter', entity: 'Encounter', entityType: 'encounter', prefix: 'EN', entityCode: 'TH', separator: '-', padding: 6, startsAt: 892, locked: false },
    { id: 'clinic',    entity: 'Clinic',    entityType: 'clinic',    prefix: 'CL', entityCode: 'TH', separator: '-', padding: 3, startsAt: 3,   locked: true  },
  ],
  maldives: [
    { id: 'patient',   entity: 'Patient',   entityType: 'patient',   prefix: 'PT', entityCode: 'MV', separator: '-', padding: 5, startsAt: 18,  locked: true  },
    { id: 'doctor',    entity: 'Doctor',    entityType: 'doctor',    prefix: 'DR', entityCode: 'MV', separator: '-', padding: 4, startsAt: 12,  locked: true  },
    { id: 'encounter', entity: 'Encounter', entityType: 'encounter', prefix: 'EN', entityCode: 'MV', separator: '-', padding: 6, startsAt: 234, locked: false },
    { id: 'clinic',    entity: 'Clinic',    entityType: 'clinic',    prefix: 'CL', entityCode: 'MV', separator: '-', padding: 3, startsAt: 1,   locked: true  },
  ],
};

// Fallback countries when API is unavailable
const FALLBACK_COUNTRIES: Pick<CountryConfig, 'id' | 'name' | 'flagEmoji'>[] = [
  { id: 'india', name: 'India', flagEmoji: '\u{1F1EE}\u{1F1F3}' },
  { id: 'thailand', name: 'Thailand', flagEmoji: '\u{1F1F9}\u{1F1ED}' },
  { id: 'maldives', name: 'Maldives', flagEmoji: '\u{1F1F2}\u{1F1FB}' },
];

/** Map API DTO to local IDFormat */
const mapDtoToFormat = (dto: IdFormatTemplateDto): IDFormat => ({
  id: dto.id,
  entity: dto.entityType.charAt(0).toUpperCase() + dto.entityType.slice(1),
  entityType: dto.entityType,
  prefix: dto.prefix,
  entityCode: dto.entityCode,
  separator: dto.separator,
  padding: dto.padding,
  startsAt: dto.startsAt,
  locked: dto.locked,
});

// ---- Main -------------------------------------------------------------------
const IDManagement: React.FC = () => {
  // --- API hooks ---
  const { data: countriesData, isLoading: countriesLoading } = useCountries();
  const countries = (countriesData ?? FALLBACK_COUNTRIES) as Array<
    Pick<CountryConfig, 'id' | 'name' | 'flagEmoji'>
  >;

  const [activeTab, setActiveTab] = useState('');

  // Auto-select first country when countries load
  useEffect(() => {
    if (countries.length > 0 && !activeTab) {
      setActiveTab(countries[0]!.id);
    }
  }, [countries, activeTab]);

  const {
    data: apiFormats,
    isLoading: formatsLoading,
  } = useIdFormats(activeTab);

  const updateIdFormat = useUpdateIdFormat();
  const toggleIdFormatLock = useToggleIdFormatLock();

  // --- Local form state ---
  const [formats, setFormats] = useState<Record<string, IDFormat[]>>(INITIAL);

  // Sync API data into local state when it arrives
  useEffect(() => {
    if (apiFormats && Array.isArray(apiFormats) && apiFormats.length > 0) {
      setFormats((prev) => ({
        ...prev,
        [activeTab]: (apiFormats as IdFormatTemplateDto[]).map(mapDtoToFormat),
      }));
    }
  }, [apiFormats, activeTab]);

  const current = formats[activeTab] ?? [];
  const countryObj = countries.find((c) => c.id === activeTab);
  const countryLabel = countryObj
    ? `${countryObj.flagEmoji ?? ''} ${countryObj.name}`
    : '';

  const updateField = (fmtId: string, key: keyof IDFormat, val: any) => {
    setFormats((prev) => ({
      ...prev,
      [activeTab]: (prev[activeTab] ?? []).map((f) =>
        f.id === fmtId ? { ...f, [key]: val } : f
      ),
    }));
  };

  /** Save a single format row on blur */
  const handleBlurSave = (fmt: IDFormat) => {
    updateIdFormat.mutate({
      countryId: activeTab,
      entityType: fmt.entityType,
      data: {
        prefix: fmt.prefix,
        entityCode: fmt.entityCode,
        separator: fmt.separator,
        padding: fmt.padding,
        startsAt: fmt.startsAt,
      },
    });
  };

  const toggleLock = (fmt: IDFormat) => {
    // Optimistic local toggle
    setFormats((prev) => ({
      ...prev,
      [activeTab]: (prev[activeTab] ?? []).map((f) =>
        f.id === fmt.id ? { ...f, locked: !f.locked } : f
      ),
    }));
    // Fire mutation
    toggleIdFormatLock.mutate({
      countryId: activeTab,
      entityType: fmt.entityType,
    });
  };

  return (
    <DashboardLayout pageTitle="ID Config">
      <Container maxWidth="lg" sx={{ py: 3 }}>

        {/* Info notice */}
        <Box
          sx={{
            p: 1.5, mb: 2.5, background: '#FFF5EE',
            border: '1px solid #FF823230', borderRadius: 1.5,
            fontSize: '12px', color: '#FF8232',
          }}
        >
          <Typography variant="caption" sx={{ color: '#FF8232', fontSize: '12px' }}>
            Entity codes, separators and padding are set by Taevas Global for each country. You can only customise the <strong>clinic prefix</strong> per entity. Changes apply to all new IDs -- existing IDs are never changed.
          </Typography>
        </Box>

        {/* Pill Tabs */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2.5, alignItems: 'center' }}>
          {countriesLoading && <CircularProgress size={18} sx={{ color: '#5519E6' }} />}
          {countries.map((c) => (
            <Box
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              sx={{
                px: 2, py: 0.75, borderRadius: 2,
                border: '1.5px solid',
                borderColor: activeTab === c.id ? '#5519E6' : '#E5E7EB',
                background: activeTab === c.id ? '#5519E6' : '#fff',
                color: activeTab === c.id ? '#fff' : '#374151',
                fontWeight: 700, fontSize: '13px',
                cursor: 'pointer', transition: 'all 0.15s',
                '&:hover': {
                  borderColor: '#5519E6',
                  background: activeTab === c.id ? '#4410C0' : '#F5F0FF',
                },
              }}
            >
              {c.flagEmoji ?? ''} {c.name}
            </Box>
          ))}
        </Box>

        {/* ID Formats Table */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {countryLabel} -- Default ID Formats
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Country defaults - Clinic Admin can override prefix only
              </Typography>
            </Box>

            {formatsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={28} sx={{ color: '#5519E6' }} />
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ background: '#F8F9FA' }}>
                    <TableRow>
                      {['Entity', 'Prefix', 'Entity Code', 'Separator', 'Padding', 'Starts At', 'Example Preview', 'Lock'].map((h) => (
                        <TableCell key={h} sx={{ fontWeight: 700, fontSize: '11.5px', color: 'text.secondary', py: 1.25 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {current.map((fmt) => (
                      <TableRow key={fmt.id} sx={{ '&:hover': { background: '#F8F9FA' } }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: '13px' }}>{fmt.entity}</TableCell>
                        <TableCell>
                          <TextField
                            size="small" value={fmt.prefix} disabled={fmt.locked}
                            onChange={(e) => updateField(fmt.id, 'prefix', e.target.value)}
                            onBlur={() => handleBlurSave(fmt)}
                            sx={{ width: 70 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small" value={fmt.entityCode} disabled={fmt.locked}
                            onChange={(e) => updateField(fmt.id, 'entityCode', e.target.value)}
                            onBlur={() => handleBlurSave(fmt)}
                            sx={{ width: 70 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small" value={fmt.separator} disabled={fmt.locked}
                            onChange={(e) => updateField(fmt.id, 'separator', e.target.value)}
                            onBlur={() => handleBlurSave(fmt)}
                            sx={{ width: 56 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small" type="number" value={fmt.padding} disabled={fmt.locked}
                            onChange={(e) => updateField(fmt.id, 'padding', parseInt(e.target.value) || fmt.padding)}
                            onBlur={() => handleBlurSave(fmt)}
                            sx={{ width: 56 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small" type="number" value={fmt.startsAt} disabled={fmt.locked}
                            onChange={(e) => updateField(fmt.id, 'startsAt', parseInt(e.target.value) || fmt.startsAt)}
                            onBlur={() => handleBlurSave(fmt)}
                            sx={{ width: 72 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              px: 1, py: 0.5, background: '#F0EEFF',
                              borderRadius: 1, fontFamily: '"DM Mono", monospace',
                              fontSize: '12px', fontWeight: 700, color: '#5519E6',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {genPreview(fmt)}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => toggleLock(fmt)}
                            sx={{ color: fmt.locked ? '#FF8232' : '#9CA3AF' }}
                          >
                            {fmt.locked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* AI Format Guide */}
        <Card sx={{ background: '#F8F9FF', border: '1.5px solid #5519E625' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#5519E6', mb: 1 }}>
              Format Guide
            </Typography>
            <Typography variant="body2" sx={{ color: '#374151', fontSize: '12.5px', lineHeight: 1.7 }}>
              Final ID = <strong style={{ color: '#0A0A0F' }}>PREFIX + SEPARATOR + ENTITY_CODE + SEPARATOR + PADDED_SEQUENCE</strong>
              <br />
              Example: <strong style={{ color: '#5519E6' }}>EC-PT-00042</strong> -- Clinic "EC", Patient, record #42 with 5-digit padding.
            </Typography>
          </CardContent>
        </Card>

      </Container>
    </DashboardLayout>
  );
};

export default IDManagement;
