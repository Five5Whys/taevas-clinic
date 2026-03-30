import React from 'react';
import {
  Card,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import StatusBadge from './StatusBadge';

interface ClinicCardProps {
  name: string;
  location: string;
  doctors: number;
  status: 'active' | 'pilot';
  tags: string[];
  onViewAdmin?: () => void;
  onConfig?: () => void;
}

const ClinicCard: React.FC<ClinicCardProps> = ({
  name,
  location,
  doctors,
  status,
  tags,
  onViewAdmin,
  onConfig,
}) => {
  const theme = useTheme();

  // Generate gradient avatar
  const getAvatarGradient = (text: string) => {
    const colors = ['#5519E6', '#A046F0', '#3B82F6'];
    const index = text.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Header with Avatar */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Avatar
          sx={{
            width: 56,
            height: 56,
            backgroundColor: getAvatarGradient(name),
            fontSize: '18px',
            fontWeight: 700,
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            {name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '13px',
              }}
            >
              {location}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
        {/* Status Badge */}
        <Box sx={{ mb: 2 }}>
          <StatusBadge status={status} size="small" />
        </Box>

        {/* Stats */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PersonIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
            <Typography sx={{ fontSize: '14px', color: theme.palette.text.primary, fontWeight: 500 }}>
              {doctors} Doctor{doctors !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '12px',
                  borderColor: theme.palette.divider,
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          gap: 1,
          justifyContent: 'flex-end',
        }}
      >
        {onViewAdmin && (
          <Button
            size="small"
            variant="text"
            onClick={onViewAdmin}
            sx={{
              fontSize: '12px',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            View Admin
          </Button>
        )}
        {onConfig && (
          <Button
            size="small"
            variant="contained"
            onClick={onConfig}
            sx={{
              fontSize: '12px',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Config
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default ClinicCard;
