import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  pageTitle,
  breadcrumbs,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebarCollapsed') === 'true'; } catch { return false; }
  });

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem('sidebarCollapsed', String(next)); } catch {}
      return next;
    });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Sidebar */}
      {!isMobile && <Sidebar open={true} collapsed={sidebarCollapsed} onToggleCollapse={handleToggleCollapse} />}
      {isMobile && (
        <Sidebar
          open={sidebarOpen}
          onClose={handleDrawerClose}
        />
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top Bar */}
        <TopBar
          onMenuClick={handleDrawerToggle}
          pageTitle={pageTitle}
          breadcrumbs={breadcrumbs}
        />

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            pb: isMobile ? '80px' : 0,
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Bottom Navigation - Mobile Only */}
      {isMobile && <BottomNav />}
    </Box>
  );
};

export default DashboardLayout;
