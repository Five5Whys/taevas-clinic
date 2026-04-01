import React from 'react';
import { Chip } from '@mui/material';

type StatusType = 'active' | 'pilot' | 'operational' | 'warning' | 'error' | 'pending' | 'paid' | 'success' | 'failed' | 'processing';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'small' | 'medium';
}

const statusColorMap: Record<StatusType, { bg: string; text: string }> = {
  active: { bg: '#CDDC50', text: '#4A5D1F' },
  pilot: { bg: '#A046F0', text: '#FFFFFF' },
  operational: { bg: '#3B82F6', text: '#FFFFFF' },
  warning: { bg: '#FF8232', text: '#FFFFFF' },
  error: { bg: '#F43F5E', text: '#FFFFFF' },
  pending: { bg: '#FFA500', text: '#FFFFFF' },
  paid: { bg: '#CDDC50', text: '#4A5D1F' },
  success: { bg: '#CDDC50', text: '#4A5D1F' },
  failed: { bg: '#F43F5E', text: '#FFFFFF' },
  processing: { bg: '#3B82F6', text: '#FFFFFF' },
};

const statusLabelMap: Record<StatusType, string> = {
  active: 'Active',
  pilot: 'Pilot',
  operational: 'Operational',
  warning: 'Warning',
  error: 'Error',
  pending: 'Pending',
  paid: 'Paid',
  success: 'Success',
  failed: 'Failed',
  processing: 'Processing',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'medium',
}) => {
  const colors = statusColorMap[status] || statusColorMap.operational;
  const displayLabel = label || statusLabelMap[status];

  return (
    <Chip
      label={displayLabel}
      size={size === 'small' ? 'small' : 'medium'}
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: 600,
        fontSize: size === 'small' ? '11px' : '12px',
        height: size === 'small' ? '24px' : '32px',
        '& .MuiChip-label': {
          px: size === 'small' ? 1 : 1.5,
        },
      }}
    />
  );
};

export default StatusBadge;
