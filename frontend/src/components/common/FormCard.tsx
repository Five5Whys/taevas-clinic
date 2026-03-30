import React from 'react';
import {
  Card,
  Box,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface FormCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  locked?: boolean;
  lockMessage?: string;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  actions,
  locked = false,
  lockMessage = 'This form is locked',
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Lock Overlay */}
      {locked && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            backdropFilter: 'blur(2px)',
          }}
        >
          <LockIcon sx={{ fontSize: 48, color: 'white', mb: 1 }} />
          <Typography sx={{ color: 'white', fontWeight: 600, textAlign: 'center', px: 2 }}>
            {lockMessage}
          </Typography>
        </Box>
      )}

      {/* Header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon && (
          <Box
            sx={{
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        )}
        <Box>
          <Typography
            sx={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: '20px',
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: theme.palette.text.secondary,
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      <Divider />

      {/* Content */}
      <Box
        sx={{
          p: 3,
          opacity: locked ? 0.5 : 1,
          pointerEvents: locked ? 'none' : 'auto',
        }}
      >
        {children}
      </Box>

      {/* Footer Actions */}
      {actions && (
        <>
          <Divider />
          <Box
            sx={{
              p: 3,
              backgroundColor: theme.palette.background.default,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              opacity: locked ? 0.5 : 1,
              pointerEvents: locked ? 'none' : 'auto',
            }}
          >
            {actions}
          </Box>
        </>
      )}
    </Card>
  );
};

export default FormCard;
