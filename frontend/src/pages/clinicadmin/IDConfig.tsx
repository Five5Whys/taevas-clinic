import React, { useState } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Stack,
} from '@mui/material';
import { Warning as AlertTriangle } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const IDConfig: React.FC = () => {
  const [overrides, setOverrides] = useState({
    patient: 'CLIN-',
    doctor: 'DOC-',
    encounter: 'ENC-',
    clinic: 'CLI-',
  });

  const entities = [
    {
      name: 'Patient',
      inherited: 'PAT-YYYYMMDD-{seq:5}',
      key: 'patient',
      preview: 'CLIN-20260327-00001',
      nextSeq: '00142',
    },
    {
      name: 'Doctor',
      inherited: 'DOC-{clinic}-{seq:3}',
      key: 'doctor',
      preview: 'DOC-PUN-045',
      nextSeq: '046',
    },
    {
      name: 'Encounter',
      inherited: 'ENC-{patient}-{seq:4}',
      key: 'encounter',
      preview: 'ENC-CLIN-20260327-00001-0001',
      nextSeq: '0215',
    },
    {
      name: 'Clinic',
      inherited: 'CLI-{name:3}-{seq:2}',
      key: 'clinic',
      preview: 'CLI-PUN-01',
      nextSeq: '02',
    },
  ];

  const handleOverrideChange = (key: string, value: string) => {
    setOverrides({ ...overrides, [key]: value });
  };

  const handleSave = () => {
    console.log('ID config saved:', overrides);
    alert('ID configuration saved successfully!');
  };

  const handleReset = () => {
    setOverrides({
      patient: 'CLIN-',
      doctor: 'DOC-',
      encounter: 'ENC-',
      clinic: 'CLI-',
    });
    alert('Configuration reset to defaults');
  };

  return (
    <DashboardLayout pageTitle="ID Configuration">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Alert severity="warning" icon={<AlertTriangle />}>
            <AlertTitle>Global Settings</AlertTitle>
            Entity codes, separators, and padding are set by Taevas Global. You can
            customize your clinic prefix below.
          </Alert>

          <Card>
            <CardHeader title="Entity ID Formats" />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Entity</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        Inherited Format
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        Your Prefix Override
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Live Preview</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Next Sequence
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entities.map((entity) => (
                      <TableRow key={entity.key}>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {entity.name}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem' }}>
                          {entity.inherited}
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            value={overrides[entity.key as keyof typeof overrides]}
                            onChange={(e) =>
                              handleOverrideChange(entity.key, e.target.value)
                            }
                            size="small"
                            sx={{ width: 140 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                          {entity.preview}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {entity.nextSeq}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                  }}
                  onClick={handleSave}
                >
                  Save Configuration
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                  Reset to Defaults
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </DashboardLayout>
  );
};

export default IDConfig;
