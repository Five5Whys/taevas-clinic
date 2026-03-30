import React from 'react';
import {
  Card,
  Box,
  Typography,
  Avatar,
  Chip,
  useTheme,
} from '@mui/material';

interface PersonCardProps {
  name: string;
  id?: string;
  avatar?: string;
  roles?: string[];
  speciality?: string;
  clinic?: string;
  registration?: string;
  country?: { flag: string; name: string };
  actions?: React.ReactNode;
}

const PersonCard: React.FC<PersonCardProps> = ({
  name,
  id,
  avatar,
  roles,
  speciality,
  clinic,
  registration,
  country,
  actions,
}) => {
  const theme = useTheme();

  // Generate initials from name
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {/* Header Section */}
      <Box sx={{ p: 3 }}>
        {/* Avatar and Name */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar
            src={avatar}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: theme.palette.primary.main,
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            {getInitials(name)}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {name}
            </Typography>
            {id && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontFamily: "'Courier New', monospace",
                  color: theme.palette.text.secondary,
                  fontSize: '11px',
                  mt: 0.5,
                }}
              >
                ID: {id}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Role Chips */}
        {roles && roles.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {roles.map((role, index) => (
              <Chip
                key={index}
                label={role}
                size="small"
                sx={{
                  backgroundColor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  fontSize: '12px',
                }}
              />
            ))}
          </Box>
        )}

        {/* Metadata Rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {speciality && (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  mb: 0.25,
                }}
              >
                Speciality
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                }}
              >
                {speciality}
              </Typography>
            </Box>
          )}

          {clinic && (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  mb: 0.25,
                }}
              >
                Clinic
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                }}
              >
                {clinic}
              </Typography>
            </Box>
          )}

          {registration && (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  mb: 0.25,
                }}
              >
                Registration
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {registration}
              </Typography>
            </Box>
          )}

          {country && (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  mb: 0.25,
                }}
              >
                Country
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '18px' }}>{country.flag}</Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {country.name}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer Actions */}
      {actions && (
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            display: 'flex',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          {actions}
        </Box>
      )}
    </Card>
  );
};

export default PersonCard;
