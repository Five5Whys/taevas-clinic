/**
 * DevRoleSwitcher — Floating bar for quickly switching roles in mock auth mode.
 * Only renders when VITE_MOCK_AUTH=true.
 */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { isMockAuthEnabled, MOCK_USERS } from '@/services/mockAuth';
import { UserRole } from '@/types';
import { ROLE_REDIRECT_MAP } from '@/utils/constants';

const ROLES: { role: UserRole; label: string; color: string; icon: string }[] = [
  { role: 'SUPERADMIN', label: 'Super Admin', color: '#A046F0', icon: '🌍' },
  { role: 'CLINIC_ADMIN', label: 'Clinic Admin', color: '#FF8232', icon: '🏥' },
  { role: 'DOCTOR', label: 'Doctor', color: '#CDDC50', icon: '🩺' },
  { role: 'PATIENT', label: 'Patient', color: '#3B82F6', icon: '👤' },
];

const DevRoleSwitcher: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  const [expanded, setExpanded] = useState(false);

  if (!isMockAuthEnabled()) return null;

  const handleSwitch = (role: UserRole) => {
    const mockUser = MOCK_USERS[role];
    login(mockUser, 'mock-jwt-token-for-dev-only');
    navigate(ROLE_REDIRECT_MAP[role] || '/login');
    setExpanded(false);
  };

  const currentRole = user?.role;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1100,
      }}
    >
      {/* Expanded panel */}
      <Collapse in={expanded}>
        <Box
          sx={{
            mb: 1,
            p: 1.5,
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            border: '1px solid',
            borderColor: theme.palette.divider,
            minWidth: 180,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              fontWeight: 700,
              color: '#A046F0',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              mb: 1,
            }}
          >
            Switch Role
          </Typography>
          {ROLES.map(({ role, label, color, icon }) => (
            <Button
              key={role}
              fullWidth
              size="small"
              onClick={() => handleSwitch(role)}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                fontWeight: currentRole === role ? 700 : 500,
                color: currentRole === role ? color : theme.palette.text.primary,
                backgroundColor: currentRole === role ? `${color}14` : 'transparent',
                borderRadius: '8px',
                mb: 0.5,
                px: 1.5,
                '&:hover': {
                  backgroundColor: `${color}10`,
                },
              }}
            >
              <span style={{ marginRight: 8, fontSize: '1.1rem' }}>{icon}</span>
              {label}
              {currentRole === role && (
                <Icons.Check sx={{ ml: 'auto', fontSize: 16, color }} />
              )}
            </Button>
          ))}
        </Box>
      </Collapse>

      {/* FAB toggle */}
      <IconButton
        onClick={() => setExpanded(!expanded)}
        sx={{
          width: 48,
          height: 48,
          backgroundColor: '#A046F0',
          color: 'white',
          boxShadow: '0 4px 16px rgba(160, 70, 240, 0.4)',
          float: 'right',
          '&:hover': {
            backgroundColor: '#5519E6',
          },
        }}
      >
        {expanded ? <Icons.Close /> : <Icons.SwapHoriz />}
      </IconButton>
    </Box>
  );
};

export default DevRoleSwitcher;
