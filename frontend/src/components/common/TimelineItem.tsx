import React from 'react';
import {
  Box,
  Typography,
  useTheme,
} from '@mui/material';

interface TimelineItemProps {
  date: string;
  title: string;
  description?: string;
  color?: string;
  icon?: React.ReactNode;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  title,
  description,
  color = '#5519E6',
  icon,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        position: 'relative',
        pb: 3,
      }}
    >
      {/* Left Column - Timeline */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '40px',
          position: 'relative',
        }}
      >
        {/* Dot */}
        <Box
          sx={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: color,
            border: `3px solid ${theme.palette.background.paper}`,
            zIndex: 2,
            mt: 0.5,
            boxShadow: `0 0 0 3px ${color}30`,
          }}
        />

        {/* Vertical Line */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '30px',
            bottom: '-12px',
            width: '2px',
            backgroundColor: theme.palette.divider,
          }}
        />
      </Box>

      {/* Right Column - Content */}
      <Box sx={{ flex: 1, pt: 0.25 }}>
        {/* Date and Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {icon && (
            <Box
              sx={{
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            variant="caption"
            sx={{
              color: color,
              fontWeight: 700,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {date}
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: description ? 0.5 : 0,
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
              fontSize: '13px',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TimelineItem;
