import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { People, PersonSearch } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StaffManagement from './StaffManagement';
import PatientRegistry from './PatientRegistry';

const BRAND = '#5519E6';

const UserManagement: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <DashboardLayout pageTitle="User Management">
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
          <Tab icon={<People sx={{ fontSize: 18 }} />} iconPosition="start" label="Staff" />
          <Tab icon={<PersonSearch sx={{ fontSize: 18 }} />} iconPosition="start" label="Patients" />
        </Tabs>
      </Box>
      <Box sx={{ display: tab === 0 ? 'block' : 'none' }}>
        <StaffManagement />
      </Box>
      <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
        <PatientRegistry />
      </Box>
    </DashboardLayout>
  );
};

export default UserManagement;
