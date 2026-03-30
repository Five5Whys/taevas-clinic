import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Add, Delete, Print, WhatsApp, QrCode } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Prescriptions: React.FC = () => {
  const [drugs, setDrugs] = useState([
    { id: 1, name: 'Cetirizine', dose: '10mg', frequency: 'Once daily', duration: '7 days' },
    { id: 2, name: 'Fluticasone Spray', dose: '50mcg', frequency: 'Twice daily', duration: '14 days' },
    { id: 3, name: 'Montelukast', dose: '10mg', frequency: 'Once daily', duration: '30 days' },
  ]);

  const [newDrugName, setNewDrugName] = useState('');
  const [newDrugDose, setNewDrugDose] = useState('');

  const templates = [
    { name: 'Allergic Rhinitis', icd: 'J30.1', drugCount: 3 },
    { name: 'Otitis Media', icd: 'H66.0', drugCount: 4 },
    { name: 'Acute Sinusitis', icd: 'J01.0', drugCount: 3 },
    { name: 'Tonsillitis', icd: 'J03.0', drugCount: 2 },
    { name: 'BPPV/Vertigo', icd: 'H81.1', drugCount: 2 },
    { name: 'URTI', icd: 'J06.9', drugCount: 2 },
  ];

  const removeDrug = (id: number) => {
    setDrugs(drugs.filter((d) => d.id !== id));
  };

  const addDrug = () => {
    if (newDrugName && newDrugDose) {
      const newDrug = {
        id: Math.max(...drugs.map((d) => d.id), 0) + 1,
        name: newDrugName,
        dose: newDrugDose,
        frequency: 'As per dosage',
        duration: '7 days',
      };
      setDrugs([...drugs, newDrug]);
      setNewDrugName('');
      setNewDrugDose('');
    }
  };

  return (
    <DashboardLayout pageTitle="Prescriptions">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Templates */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  ENT Prescription Templates
                </Typography>
                <Grid container spacing={2}>
                  {templates.map((template, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: '1px solid #eee',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                            borderColor: '#5519E6',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {template.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {template.icd}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={`${template.drugCount} drugs`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Current Prescription */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Current Prescription for Anita Sharma
                </Typography>
                <Stack spacing={2}>
                  {drugs.map((drug) => (
                    <Card key={drug.id} variant="outlined">
                      <CardContent sx={{ pb: '16px !important' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {drug.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {drug.dose}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            sx={{ color: '#FF8232' }}
                            onClick={() => removeDrug(drug.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          <Chip
                            label={drug.frequency}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={drug.duration}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add Drug */}
                  <Box sx={{ pt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Add Drug
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Drug name"
                      value={newDrugName}
                      onChange={(e) => setNewDrugName(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Dose"
                      value={newDrugDose}
                      onChange={(e) => setNewDrugDose(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={addDrug}
                      sx={{ color: '#5519E6', borderColor: '#5519E6' }}
                    >
                      Add Drug
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#5519E6',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#4410cc' },
                }}
              >
                Finalize Rx
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<WhatsApp />}
                sx={{
                  backgroundColor: '#25D366',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#1fad55' },
                }}
              >
                WhatsApp
              </Button>
            </Stack>
          </Grid>

          {/* Right Column - Prescription Pad Preview */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                backgroundColor: '#faf8f3',
                borderRadius: 2,
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minHeight: 800,
              }}
            >
              {/* Watermark */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-45deg)',
                  fontSize: 60,
                  fontWeight: 'bold',
                  opacity: 0.05,
                  color: '#000',
                  zIndex: 0,
                }}
              >
                Rx
              </Box>

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 3, borderBottom: '2px solid #5519E6', pb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5519E6' }}>
                    Taevas Clinic
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Dr. Rajesh Kumar, MS (ENT)
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Registration: MH-123456
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    ENT Care Center, Pune
                  </Typography>
                </Box>

                {/* Date and Rx Number */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Date: 27 Mar 2026
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Rx#: 0001234
                    </Typography>
                  </Box>
                </Box>

                {/* Patient Info */}
                <Box sx={{ mb: 3, p: 1.5, backgroundColor: '#fff', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    To: Anita Sharma
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Age: 35F | ID: TC-PUN-042
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    ABHA: 123-4567-8901
                  </Typography>
                </Box>

                {/* Medicines */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ℞ Medicines:
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: '0.7rem' }}>Medicine</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>Dose</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>Frequency</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>Duration</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {drugs.map((drug) => (
                        <TableRow key={drug.id}>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{drug.name}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{drug.dose}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{drug.frequency}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem' }}>{drug.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>

                {/* Notes */}
                <Box sx={{ mb: 3, p: 1, borderTop: '1px solid #ddd', pt: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Follow-up: 1 week
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Precautions: Avoid dust and pollution exposure
                  </Typography>
                </Box>

                {/* Footer with Signature and QR */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 4, pt: 2, borderTop: '2px solid #ccc' }}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Doctor Signature
                    </Typography>
                    <Box sx={{ height: 40, width: 60, backgroundColor: '#f0f0f0', borderRadius: 1 }} />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <QrCode sx={{ fontSize: 60, color: '#5519E6' }} />
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Print Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Print />}
              sx={{
                mt: 2,
                color: '#5519E6',
                borderColor: '#5519E6',
              }}
            >
              Print Prescription
            </Button>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Prescriptions;
