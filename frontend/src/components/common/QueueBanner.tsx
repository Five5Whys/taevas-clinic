import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  useTheme,
} from '@mui/material';

interface QueueBannerProps {
  currentToken: number;
  upNext: number[];
  seen: number;
  waiting: number;
  avgWait: string;
  onManageQueue?: () => void;
}

const QueueBanner: React.FC<QueueBannerProps> = ({
  currentToken,
  upNext,
  seen,
  waiting,
  avgWait,
  onManageQueue,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#2D2D2D',
        color: '#FFFFFF',
        p: 3,
        borderRadius: '8px',
        mb: 3,
      }}
    >
      {/* Main Row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          mb: 2,
        }}
      >
        {/* Current Token */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: '#CCCCCC',
              fontWeight: 500,
              mb: 0.5,
              fontSize: '12px',
              textTransform: 'uppercase',
            }}
          >
            Current Token
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: '48px',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1,
            }}
          >
            {currentToken}
          </Typography>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            width: '1px',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        />

        {/* Up Next */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: '#CCCCCC',
              fontWeight: 500,
              mb: 1,
              fontSize: '12px',
              textTransform: 'uppercase',
            }}
          >
            Up Next
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {upNext.slice(0, 3).map((token, index) => (
              <Chip
                key={index}
                label={token}
                sx={{
                  backgroundColor: 'rgba(85, 25, 230, 0.3)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: '1px solid rgba(85, 25, 230, 0.6)',
                }}
              />
            ))}
            {upNext.length > 3 && (
              <Chip
                label={`+${upNext.length - 3}`}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#CCCCCC',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 3 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#CCCCCC',
                fontWeight: 500,
                mb: 0.5,
                fontSize: '12px',
                textTransform: 'uppercase',
              }}
            >
              Seen
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: '24px',
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              {seen}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#CCCCCC',
                fontWeight: 500,
                mb: 0.5,
                fontSize: '12px',
                textTransform: 'uppercase',
              }}
            >
              Waiting
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: '24px',
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              {waiting}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#CCCCCC',
                fontWeight: 500,
                mb: 0.5,
                fontSize: '12px',
                textTransform: 'uppercase',
              }}
            >
              Avg Wait
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: '24px',
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              {avgWait}
            </Typography>
          </Box>
        </Box>

        {/* Manage Button */}
        {onManageQueue && (
          <Button
            variant="contained"
            onClick={onManageQueue}
            sx={{
              backgroundColor: '#5519E6',
              color: '#FFFFFF',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '14px',
              '&:hover': {
                backgroundColor: '#4410D1',
              },
            }}
          >
            Manage Queue
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default QueueBanner;
