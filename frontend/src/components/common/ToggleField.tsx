import React from 'react';
import {
  Box,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  locked?: boolean;
}

const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  locked = false,
}) => {
  const theme = useTheme();
  const isDisabled = disabled || locked;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        px: 2,
        borderRadius: '8px',
        backgroundColor: isDisabled ? theme.palette.action.disabledBackground : 'transparent',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: !isDisabled ? theme.palette.action.hover : theme.palette.action.disabledBackground,
        },
      }}
    >
      {/* Left Content */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: isDisabled ? theme.palette.text.disabled : theme.palette.text.primary,
            }}
          >
            {label}
          </Typography>
          {locked && (
            <LockIcon
              sx={{
                fontSize: 16,
                color: theme.palette.warning.main,
              }}
            />
          )}
        </Box>
        {description && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: isDisabled ? theme.palette.text.disabled : theme.palette.text.secondary,
              mt: 0.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Switch */}
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={isDisabled}
        sx={{
          ml: 2,
        }}
      />
    </Box>
  );
};

export default ToggleField;
