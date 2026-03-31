import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Search, Add, Visibility as Eye } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDoctorPatients } from '@/hooks/doctor';

const Patients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: patientsData, isLoading } = useDoctorPatients();
  const patients = (Array.isArray(patientsData) ? patientsData : patientsData?.content ?? patientsData?.patients ?? []) as any[];

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Patients">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: '#5519E6' }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Patients">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Search and Action Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search by patient name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: '#5519E6',
              color: '#fff',
              '&:hover': { backgroundColor: '#4410cc' },
              whiteSpace: 'nowrap',
            }}
          >
            New Patient
          </Button>
        </Box>

        {/* Patients Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Patients ({filteredPatients.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Patient ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Age/Gender</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>ABHA ID</TableCell>
                    <TableCell>Last Visit</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {patient.id}
                      </TableCell>
                      <TableCell sx={{ fontWeight: '500' }}>{patient.name}</TableCell>
                      <TableCell>
                        {patient.age}{patient.gender}
                      </TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>
                        <Typography variant="caption">{patient.abhaId}</Typography>
                      </TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          sx={{ color: '#5519E6' }}
                          title="View Patient Record"
                        >
                          <Eye fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default Patients;
