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
} from '@mui/material';
import { Search, Add, Visibility as Eye } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Patients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const patients = [
    {
      id: 'PT-001',
      name: 'Anita Sharma',
      age: 35,
      gender: 'F',
      condition: 'Allergic Rhinitis',
      abhaId: '123-4567-8901',
      lastVisit: '27 Mar 2026',
    },
    {
      id: 'PT-002',
      name: 'Rajiv Kumar',
      age: 48,
      gender: 'M',
      condition: 'Otitis Media',
      abhaId: '234-5678-9012',
      lastVisit: '26 Mar 2026',
    },
    {
      id: 'PT-003',
      name: 'Priya Singh',
      age: 42,
      gender: 'F',
      condition: 'Hearing Loss',
      abhaId: '345-6789-0123',
      lastVisit: '25 Mar 2026',
    },
    {
      id: 'PT-004',
      name: 'Amit Patel',
      age: 56,
      gender: 'M',
      condition: 'Sinusitis',
      abhaId: '456-7890-1234',
      lastVisit: '24 Mar 2026',
    },
    {
      id: 'PT-005',
      name: 'Neha Sharma',
      age: 29,
      gender: 'F',
      condition: 'Tonsillitis',
      abhaId: '567-8901-2345',
      lastVisit: '23 Mar 2026',
    },
    {
      id: 'PT-006',
      name: 'Vijay Desai',
      age: 62,
      gender: 'M',
      condition: 'BPPV',
      abhaId: '678-9012-3456',
      lastVisit: '22 Mar 2026',
    },
    {
      id: 'PT-007',
      name: 'Kamala Devi',
      age: 71,
      gender: 'F',
      condition: 'Vertigo',
      abhaId: '789-0123-4567',
      lastVisit: '21 Mar 2026',
    },
    {
      id: 'PT-008',
      name: 'Deepak Kumar',
      age: 45,
      gender: 'M',
      condition: 'Deviated Septum',
      abhaId: '890-1234-5678',
      lastVisit: '20 Mar 2026',
    },
  ];

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
