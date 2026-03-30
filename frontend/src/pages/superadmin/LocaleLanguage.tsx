import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCountries } from '@/hooks/superadmin/useCountries';
import { useLocaleSettings, useUpdateLocale } from '@/hooks/superadmin/useLocale';
import type { CountryConfig, LocaleSettingsDto } from '@/types/superadmin';

interface LocaleSettings {
  primaryLanguage: string;
  secondaryLanguage: string;
  dateFormat: string;
  weightUnit: string;
  heightUnit: string;
  timezone: string;
}

// Mock fallback defaults per country code
const FALLBACK_DEFAULTS: Record<string, LocaleSettings> = {
  india: {
    primaryLanguage: 'English',
    secondaryLanguage: 'Hindi',
    dateFormat: 'DD/MM/YYYY',
    weightUnit: 'kg',
    heightUnit: 'cm',
    timezone: 'Asia/Kolkata',
  },
  thailand: {
    primaryLanguage: 'English',
    secondaryLanguage: 'Thai',
    dateFormat: 'DD/MM/YYYY',
    weightUnit: 'kg',
    heightUnit: 'cm',
    timezone: 'Asia/Bangkok',
  },
  maldives: {
    primaryLanguage: 'English',
    secondaryLanguage: 'Dhivehi',
    dateFormat: 'DD/MM/YYYY',
    weightUnit: 'kg',
    heightUnit: 'cm',
    timezone: 'Indian/Maldives',
  },
};

const DEFAULT_LOCALE: LocaleSettings = {
  primaryLanguage: 'English',
  secondaryLanguage: '',
  dateFormat: 'DD/MM/YYYY',
  weightUnit: 'kg',
  heightUnit: 'cm',
  timezone: 'UTC',
};

const languages = [
  'English',
  'Hindi',
  'Thai',
  'Dhivehi',
  'Tamil',
  'Telugu',
  'Marathi',
];

const dateFormats = [
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY-MM-DD',
];

const weightUnits = ['kg', 'lbs'];
const heightUnits = ['cm', 'inches', 'feet'];

const timezones = [
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Indian/Maldives',
  'UTC',
];

// Fallback countries when API is unavailable
const FALLBACK_COUNTRIES: Pick<CountryConfig, 'id' | 'name' | 'flagEmoji'>[] = [
  { id: 'india', name: 'India', flagEmoji: '\u{1F1EE}\u{1F1F3}' },
  { id: 'thailand', name: 'Thailand', flagEmoji: '\u{1F1F9}\u{1F1ED}' },
  { id: 'maldives', name: 'Maldives', flagEmoji: '\u{1F1F2}\u{1F1FB}' },
];

const LocaleLanguage: React.FC = () => {
  const theme = useTheme();

  // --- API hooks ---
  const { data: countriesData, isLoading: countriesLoading } = useCountries();
  const updateLocale = useUpdateLocale();

  // Resolve countries: API data or fallback
  const countries = (countriesData ?? FALLBACK_COUNTRIES).slice(0, 3);

  // --- Locale fetch for up to 3 countries ---
  const locale0 = useLocaleSettings(countries[0]?.id ?? '');
  const locale1 = useLocaleSettings(countries[1]?.id ?? '');
  const locale2 = useLocaleSettings(countries[2]?.id ?? '');
  const localeQueries = [locale0, locale1, locale2];

  // --- Local form state ---
  const [localeSettings, setLocaleSettings] = useState<Record<string, LocaleSettings>>({});
  const [savingCountry, setSavingCountry] = useState<string | null>(null);

  // Initialize form state from API data or fallback defaults
  useEffect(() => {
    const newSettings: Record<string, LocaleSettings> = {};
    countries.forEach((country, idx) => {
      const apiData = localeQueries[idx]?.data as LocaleSettingsDto | undefined;
      if (apiData) {
        newSettings[country.id] = {
          primaryLanguage: apiData.primaryLanguage,
          secondaryLanguage: apiData.secondaryLanguage,
          dateFormat: apiData.dateFormat,
          weightUnit: apiData.weightUnit,
          heightUnit: apiData.heightUnit,
          timezone: apiData.timezone,
        };
      } else if (!localeSettings[country.id]) {
        // Only set fallback if we don't already have local state for this country
        const key = country.id.toLowerCase();
        newSettings[country.id] = FALLBACK_DEFAULTS[key] ?? DEFAULT_LOCALE;
      }
    });
    if (Object.keys(newSettings).length > 0) {
      setLocaleSettings((prev) => ({ ...prev, ...newSettings }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale0.data, locale1.data, locale2.data, countries.length]);

  const handleChange = (
    countryId: string,
    field: string,
    value: string
  ) => {
    setLocaleSettings((prev) => ({
      ...prev,
      [countryId]: {
        ...prev[countryId],
        [field]: value,
      },
    }));
  };

  const handleSave = (countryId: string) => {
    const settings = localeSettings[countryId];
    if (!settings) return;

    setSavingCountry(countryId);
    updateLocale.mutate(
      { countryId, data: settings },
      {
        onSuccess: () => {
          setSavingCountry(null);
        },
        onError: () => {
          setSavingCountry(null);
          console.error(`Failed to save locale settings for ${countryId}`);
        },
      }
    );
  };

  const isAnyLocaleLoading = localeQueries.some((q) => q.isLoading);

  return (
    <DashboardLayout pageTitle="Locale & Language Settings">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Configure language, date formats, and measurement units for each country.
        </Typography>

        {(countriesLoading || isAnyLocaleLoading) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: '#5519E6' }} />
          </Box>
        )}

        <Grid container spacing={3}>
          {countries.map((country, idx) => {
            const settings = localeSettings[country.id];
            if (!settings) return null;
            const isSaving = savingCountry === country.id;

            return (
              <Grid item xs={12} md={6} lg={4} key={country.id}>
                <Card sx={{ p: 3, height: '100%' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography sx={{ fontSize: '28px', mr: 1.5 }}>
                      {(country as any).flagEmoji ?? (country as any).flag ?? ''}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700 }}
                    >
                      {country.name}
                    </Typography>
                  </Box>

                  {/* Form Fields */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {/* Primary Language */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Primary Language</InputLabel>
                      <Select
                        value={settings.primaryLanguage}
                        label="Primary Language"
                        onChange={(e) =>
                          handleChange(country.id, 'primaryLanguage', e.target.value)
                        }
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang} value={lang}>
                            {lang}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Secondary Language */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Secondary Language</InputLabel>
                      <Select
                        value={settings.secondaryLanguage}
                        label="Secondary Language"
                        onChange={(e) =>
                          handleChange(country.id, 'secondaryLanguage', e.target.value)
                        }
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang} value={lang}>
                            {lang}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Date Format */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Date Format</InputLabel>
                      <Select
                        value={settings.dateFormat}
                        label="Date Format"
                        onChange={(e) =>
                          handleChange(country.id, 'dateFormat', e.target.value)
                        }
                      >
                        {dateFormats.map((format) => (
                          <MenuItem key={format} value={format}>
                            {format}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Weight Unit */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Weight Unit</InputLabel>
                      <Select
                        value={settings.weightUnit}
                        label="Weight Unit"
                        onChange={(e) =>
                          handleChange(country.id, 'weightUnit', e.target.value)
                        }
                      >
                        {weightUnits.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Height Unit */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Height Unit</InputLabel>
                      <Select
                        value={settings.heightUnit}
                        label="Height Unit"
                        onChange={(e) =>
                          handleChange(country.id, 'heightUnit', e.target.value)
                        }
                      >
                        {heightUnits.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Timezone */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={settings.timezone}
                        label="Timezone"
                        onChange={(e) =>
                          handleChange(country.id, 'timezone', e.target.value)
                        }
                      >
                        {timezones.map((tz) => (
                          <MenuItem key={tz} value={tz}>
                            {tz}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Save Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={isSaving}
                      sx={{
                        backgroundColor: '#5519E6',
                        '&:hover': { backgroundColor: '#3d0fa3' },
                        mt: 1,
                      }}
                      onClick={() => handleSave(country.id)}
                    >
                      {isSaving ? (
                        <CircularProgress size={20} sx={{ color: '#fff' }} />
                      ) : (
                        'Save Settings'
                      )}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Quick Reference */}
        <Card sx={{ p: 3, mt: 3, backgroundColor: theme.palette.background.default }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 2.5 }}
          >
            Current Settings Summary
          </Typography>

          <Grid container spacing={3}>
            {countries.map((country) => {
              const settings = localeSettings[country.id];
              if (!settings) return null;
              return (
                <Grid item xs={12} md={6} lg={4} key={country.id}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 1.5 }}
                    >
                      {country.name}
                    </Typography>

                    <Box sx={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <Typography variant="caption">
                        <strong>Primary:</strong> {settings.primaryLanguage}
                      </Typography>
                      <Typography variant="caption">
                        <strong>Secondary:</strong> {settings.secondaryLanguage}
                      </Typography>
                      <Typography variant="caption">
                        <strong>Date:</strong> {settings.dateFormat}
                      </Typography>
                      <Typography variant="caption">
                        <strong>Weight:</strong> {settings.weightUnit}
                      </Typography>
                      <Typography variant="caption">
                        <strong>Height:</strong> {settings.heightUnit}
                      </Typography>
                      <Typography variant="caption">
                        <strong>Timezone:</strong> {settings.timezone}
                      </Typography>
                    </Box>
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

export default LocaleLanguage;
