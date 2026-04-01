import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_CONFIG } from '@/utils/constants';

const BottomNav: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const navigationItems = (userRole ? NAVIGATION_CONFIG[userRole] : undefined) ?? [];

  // Get the current path index
  const currentPathIndex = navigationItems.findIndex(
    item => item.path === location.pathname || location.pathname.startsWith(item.path + '/')
  );
  const value = currentPathIndex !== -1 ? currentPathIndex : 0;

  const handleNavigation = (newValue: number) => {
    const item = navigationItems[newValue];
    if (item) {
      navigate(item.path);
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.drawer,
        backgroundColor: theme.palette.background.paper,
      }}
      elevation={1}
    >
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => handleNavigation(newValue)}
        sx={{
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            py: 1,
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: '#5519E6',
            },
          },
        }}
      >
        {navigationItems.slice(0, 5).map(item => {
          const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ElementType;
          return (
            <BottomNavigationAction
              key={item.id}
              label={item.label}
              icon={IconComponent && <IconComponent />}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
