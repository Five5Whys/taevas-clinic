import React from 'react';
import {
  Card,
  Box,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  trendLabel?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
  subtitle?: string;
}

const colorMap: Record<string, string> = {
  primary: '#5519E6',
  secondary: '#A046F0',
  success: '#CDDC50',
  warning: '#FF8232',
  info: '#3B82F6',
  error: '#F43F5E',
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  trendLabel,
  color = 'primary',
  subtitle,
}) => {
  const theme = useTheme();
  const colorValue = colorMap[color] || colorMap.primary;

  const getTrendColor = (): string => {
    if (trend === 'up') return colorMap.success ?? '#CDDC50';
    if (trend === 'down') return colorMap.warning ?? '#FF8232';
    return theme.palette.grey[500] ?? '#9e9e9e';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUpIcon sx={{ fontSize: 16 }} />;
    if (trend === 'down') return <TrendingDownIcon sx={{ fontSize: 16 }} />;
    return undefined;
  };

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Icon Box */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '8px',
            backgroundColor: `${colorValue}1A`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colorValue,
            mb: 2,
          }}
        >
          {icon}
        </Box>

        {/* Title */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        {/* Value */}
        <Typography
          sx={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: '28px',
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: subtitle ? 0.5 : 0,
          }}
        >
          {value}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: theme.palette.text.secondary,
              mb: 1.5,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Trend */}
        {trend && trendValue !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={getTrendIcon()}
              label={`${trendValue}% ${trendLabel || 'Change'}`}
              size="small"
              sx={{
                backgroundColor: `${getTrendColor()}20`,
                color: getTrendColor(),
                fontWeight: 600,
                fontSize: '12px',
              }}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default StatCard;
