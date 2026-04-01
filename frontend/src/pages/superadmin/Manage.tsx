import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { People, LocationCity } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserManagement from './UserManagement';
import Clinics from './Clinics';

const BRAND = '#5519E6';

const Manage: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <DashboardLayout pageTitle="Manage">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '14px', minHeight: 44 },
            '& .Mui-selected': { color: BRAND },
            '& .MuiTabs-indicator': { backgroundColor: BRAND },
          }}
        >
          <Tab icon={<People sx={{ fontSize: 18 }} />} iconPosition="start" label="Users" />
          <Tab icon={<LocationCity sx={{ fontSize: 18 }} />} iconPosition="start" label="Clinics" />
        </Tabs>
      </Box>
      <Box sx={{ display: tab === 0 ? 'block' : 'none' }}>
        <UserManagement />
      </Box>
      <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
        <Clinics />
      </Box>
    </DashboardLayout>
  );
};

export default Manage;
