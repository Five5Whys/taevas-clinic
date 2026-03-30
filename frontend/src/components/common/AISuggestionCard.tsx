import React from 'react';
import {
  Card,
  Box,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AISuggestionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  confidence?: number;
}

const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
  title,
  description,
  children,
  actions,
  confidence,
}) => {
  const theme = useTheme();
  const secondaryColor = '#A046F0';

  return (
    <Card
      sx={{
        position: 'relative',
        backgroundColor: `${secondaryColor}08`,
        borderLeft: `3px solid ${secondaryColor}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Sparkle Icon */}
        <Box
          sx={{
            color: secondaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 0.5,
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 24 }} />
        </Box>

        {/* Title and Meta */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
            <Typography
              sx={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
            {confidence !== undefined && (
              <Chip
                label={`${Math.round(confidence)}% confident`}
                size="small"
                sx={{
                  backgroundColor: `${secondaryColor}20`,
                  color: secondaryColor,
                  fontWeight: 600,
                  fontSize: '11px',
                  height: '24px',
                }}
              />
            )}
          </Box>
          {description && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: theme.palette.text.secondary,
                fontSize: '13px',
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, pb: actions ? 2 : 3 }}>
        {children}
      </Box>

      {/* Footer Actions */}
      {actions && (
        <Box
          sx={{
            p: 3,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          {actions}
        </Box>
      )}
    </Card>
  );
};

export default AISuggestionCard;
