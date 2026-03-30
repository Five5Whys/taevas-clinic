import React from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  useTheme,
} from '@mui/material';
import StatusBadge from './StatusBadge';

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  clinics: number;
  doctors: number;
  status: 'active' | 'pilot';
}

interface CountrySelectorProps {
  countries: Country[];
  selected: string;
  onSelect: (code: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selected,
  onSelect,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
      {countries.map((country) => {
        const isSelected = country.code === selected;
        return (
          <Card
            key={country.code}
            onClick={() => onSelect(country.code)}
            sx={{
              minWidth: 280,
              p: 2.5,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: isSelected ? `2px solid ${theme.palette.primary.main}` : `2px solid transparent`,
              backgroundColor: isSelected
                ? `${theme.palette.primary.main}10`
                : theme.palette.background.paper,
              '&:hover': {
                boxShadow: theme.shadows[4],
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            {/* Flag and Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ fontSize: '32px' }}>{country.flag}</Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: '18px',
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  }}
                >
                  {country.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  {country.currency}
                </Typography>
              </Box>
            </Box>

            {/* Status Badge */}
            <Box sx={{ mb: 2 }}>
              <StatusBadge status={country.status} size="small" />
            </Box>

            {/* Stats */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: theme.palette.text.secondary,
                      fontSize: '11px',
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    Clinics
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: '20px',
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {country.clinics}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: theme.palette.text.secondary,
                      fontSize: '11px',
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    Doctors
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: '20px',
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {country.doctors}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        );
      })}
    </Box>
  );
};

export default CountrySelector;
