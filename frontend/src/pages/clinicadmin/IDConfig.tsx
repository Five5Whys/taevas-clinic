import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Warning as AlertTriangle } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useIdConfig, useUpdateIdConfig } from '@/hooks/clinicadmin/useConfig';

const DEFAULT_ENTITIES = [
  { name: 'Patient', inherited: 'PAT-YYYYMMDD-{seq:5}', key: 'patient', preview: '', nextSeq: '' },
  { name: 'Doctor', inherited: 'DOC-{clinic}-{seq:3}', key: 'doctor', preview: '', nextSeq: '' },
  { name: 'Encounter', inherited: 'ENC-{patient}-{seq:4}', key: 'encounter', preview: '', nextSeq: '' },
  { name: 'Clinic', inherited: 'CLI-{name:3}-{seq:2}', key: 'clinic', preview: '', nextSeq: '' },
];

const IDConfig: React.FC = () => {
  const { data: idConfigData, isLoading } = useIdConfig();
  const updateIdConfig = useUpdateIdConfig();

  const [overrides, setOverrides] = useState({
    patient: '',
    doctor: '',
    encounter: '',
    clinic: '',
  });

  const [entities, setEntities] = useState(DEFAULT_ENTITIES);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (idConfigData) {
      if (idConfigData.overrides) setOverrides(idConfigData.overrides);
      if (idConfigData.entities) setEntities(idConfigData.entities);
    }
  }, [idConfigData]);

  const handleOverrideChange = (key: string, value: string) => {
    setOverrides({ ...overrides, [key]: value });
  };

  const handleSave = () => {
    updateIdConfig.mutate({ overrides }, {
      onSuccess: () => setSnackbar({ open: true, message: 'ID configuration saved successfully!', severity: 'success' }),
      onError: () => setSnackbar({ open: true, message: 'Failed to save — please try again', severity: 'error' }),
    });
  };

  const handleReset = () => {
    const defaults = { patient: 'CLIN-', doctor: 'DOC-', encounter: 'ENC-', clinic: 'CLI-' };
    setOverrides(defaults);
    updateIdConfig.mutate({ overrides: defaults }, {
      onSuccess: () => setSnackbar({ open: true, message: 'Configuration reset to defaults', severity: 'success' }),
      onError: () => setSnackbar({ open: true, message: 'Failed to reset — please try again', severity: 'error' }),
    });
  };

  return (
    <DashboardLayout pageTitle="ID Configuration">
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
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
      )}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default IDConfig;
