import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Typography,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { getFullName, getUserInitials } from '@/utils/helpers';

interface TopBarProps {
  onMenuClick?: () => void;
  pageTitle?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, pageTitle, breadcrumbs }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

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
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
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

          {pageTitle && !isMobile && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {pageTitle}
              </Typography>
              {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs separator="/" sx={{ fontSize: '0.75rem' }}>
                  {breadcrumbs.map((item, index) => (
                    <Typography key={index} variant="caption" color="textSecondary">
                      {item.label}
                    </Typography>
                  ))}
                </Breadcrumbs>
              )}
            </Box>
          )}
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Bar - Hidden on mobile */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme.palette.mode === 'light'
                  ? '#F1F3F7'
                  : '#252535',
                borderRadius: '8px',
                px: 1.5,
                py: 0.75,
                minWidth: 280,
              }}
            >
              <Icons.Search sx={{ fontSize: '1.2rem', mr: 1, color: theme.palette.text.secondary }} />
              <InputBase
                placeholder="Search..."
                sx={{
                  flex: 1,
                  fontSize: '0.9rem',
                  '& input::placeholder': {
                    opacity: 0.6,
                  },
                }}
              />
            </Box>
          )}

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
              {getUserInitials(user)}
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
