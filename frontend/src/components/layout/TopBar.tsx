import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Typography,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getFullName, getUserInitials } from '@/utils/helpers';
import { ROLE_REDIRECT_MAP } from '@/utils/constants';
import type { UserRole } from '@/types';


interface TopBarProps {
  onMenuClick?: () => void;
  pageTitle?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
}

const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: 'Super Admin',
  CLINIC_ADMIN: 'Clinic Admin',
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
  NURSE: 'Nurse',
  ASSISTANT: 'Assistant',
};

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  // Clinic switcher: build key from role+clinicId
  const assignments = user?.assignments || [];
  const hasMultipleAssignments = assignments.length > 1;
  const currentKey = `${user?.role || ''}::${user?.clinicId || ''}`;

  const handleSwitchAssignment = (event: SelectChangeEvent<string>) => {
    const key = event.target.value;
    const [role, clinicId] = key.split('::');
    const assignment = assignments.find(a => a.role === role && a.clinicId === clinicId);
    if (assignment && user) {
      setUser({ ...user, role: assignment.role, clinicId: assignment.clinicId, clinicName: assignment.clinicName });
      navigate(ROLE_REDIRECT_MAP[assignment.role as UserRole] || '/');
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          minHeight: '40px !important',
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onMenuClick}
            >
              <Icons.Menu />
            </IconButton>
          )}

          {/* Back / Forward navigation */}
          <IconButton
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
          >
            <Icons.ArrowBack sx={{ fontSize: '1.2rem' }} />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => navigate(1)}
            sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
          >
            <Icons.ArrowForward sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Box>

        {/* Clinic Switcher — shows when user has multiple role+clinic assignments */}
        {hasMultipleAssignments && (
          <Select
            value={currentKey}
            onChange={handleSwitchAssignment}
            size="small"
            variant="outlined"
            sx={{
              minWidth: 200,
              maxWidth: 280,
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: '#F8F9FC',
              '& .MuiSelect-select': { py: '6px', display: 'flex', alignItems: 'center', gap: 0.5 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
            }}
          >
            {assignments.map(a => {
              const key = `${a.role}::${a.clinicId}`;
              return (
                <MenuItem key={key} value={key} sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  {ROLE_LABELS[a.role] || a.role} @ {a.clinicName}
                </MenuItem>
              );
            })}
          </Select>
        )}

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search removed — each page has its own search */}

          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotificationOpen}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Badge badgeContent={3} color="error">
              <Icons.NotificationsOutlined />
            </Badge>
          </IconButton>

          {/* Notification Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled>No new notifications</MenuItem>
          </Menu>

          {/* User Profile Avatar */}
          <IconButton
            onClick={handleUserMenuOpen}
            sx={{
              p: 0.5,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#5519E6',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              {getUserInitials(user) || <Icons.PersonOutlined sx={{ fontSize: '1.2rem' }} />}
            </Avatar>
          </IconButton>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {getFullName(user)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {user?.phone}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem divider />
            <MenuItem>
              <Icons.PersonOutlined sx={{ mr: 1, fontSize: '1.2rem' }} />
              Profile
            </MenuItem>
            <MenuItem>
              <Icons.SettingsOutlined sx={{ mr: 1, fontSize: '1.2rem' }} />
              Settings
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={handleLogout}>
              <Icons.LogoutOutlined sx={{ mr: 1, fontSize: '1.2rem' }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
