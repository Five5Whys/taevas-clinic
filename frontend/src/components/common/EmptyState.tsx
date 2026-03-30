import React from 'react';
import {
  Box,
  Typography,
  useTheme,
} from '@mui/material';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
      }}
    >
      {/* Icon */}
      {icon && (
        <Box
          sx={{
            fontSize: '64px',
            mb: 2,
            opacity: 0.6,
          }}
        >
          {icon}
        </Box>
      )}

      {/* Title */}
      <Typography
        sx={{
          fontFamily: "'Clash Display', sans-serif",
          fontSize: '24px',
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1,
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
            maxWidth: '400px',
            textAlign: 'center',
          }}
        >
          {description}
        </Typography>
      )}

      {/* Action */}
      {action && (
        <Box>
          {action}
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;
