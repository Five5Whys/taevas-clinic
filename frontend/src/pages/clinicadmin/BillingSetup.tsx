import React, { useState } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const BillingSetup: React.FC = () => {
  const [consultationFees, setConsultationFees] = useState({
    newPatient: 600,
    followUp: 400,
    earCleaning: 250,
    nasalEndoscopy: 800,
    audiometry: 350,
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    prefix: 'EC-PUN-',
    footerNote: 'Thank you for choosing us',
    gstNumber: '27AABCT1234H1Z0',
    autoGenerateGST: true,
    emailInvoice: true,
  });

  const handleFeeChange = (field: string, value: number) => {
    setConsultationFees({ ...consultationFees, [field]: value });
  };

  const handleInvoiceChange = (field: string, value: string | boolean) => {
    setInvoiceSettings({ ...invoiceSettings, [field]: value });
  };

  const handleSaveFees = () => {
    console.log('Fees saved:', consultationFees);
    alert('Consultation fees saved successfully!');
  };

  const handleSaveInvoice = () => {
    console.log('Invoice settings saved:', invoiceSettings);
    alert('Invoice settings saved successfully!');
  };

  const feesList = [
    { label: 'New Patient', key: 'newPatient' },
    { label: 'Follow-up', key: 'followUp' },
    { label: 'Ear Cleaning', key: 'earCleaning' },
    { label: 'Nasal Endoscopy', key: 'nasalEndoscopy' },
    { label: 'Audiometry', key: 'audiometry' },
  ];

  return (
    <DashboardLayout pageTitle="Billing Setup">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Consultation Fees */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Consultation Fees" />
              <CardContent>
                <TableContainer sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>Service</TableCell>
                        <TableCell align="right">Fee (₹)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {feesList.map((fee) => (
                        <TableRow key={fee.key}>
                          <TableCell>{fee.label}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={
                                consultationFees[
                                  fee.key as keyof typeof consultationFees
                                ]
                              }
                              onChange={(e) =>
                                handleFeeChange(fee.key, Number(e.target.value))
                              }
                              size="small"
                              sx={{ width: 120 }}
                              inputProps={{ style: { textAlign: 'right' } }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                  }}
                  onClick={handleSaveFees}
                >
                  Save Fees
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Invoice Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Invoice Settings" />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Invoice Prefix"
                    value={invoiceSettings.prefix}
                    onChange={(e) => handleInvoiceChange('prefix', e.target.value)}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Footer Note"
                    value={invoiceSettings.footerNote}
                    onChange={(e) =>
                      handleInvoiceChange('footerNote', e.target.value)
                    }
                    multiline
                    rows={2}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="GST Number"
                    value={invoiceSettings.gstNumber}
                    onChange={(e) =>
                      handleInvoiceChange('gstNumber', e.target.value)
                    }
                    size="small"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={invoiceSettings.autoGenerateGST}
                        onChange={(e) =>
                          handleInvoiceChange('autoGenerateGST', e.target.checked)
                        }
                      />
                    }
                    label="Auto-generate GST Invoice"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={invoiceSettings.emailInvoice}
                        onChange={(e) =>
                          handleInvoiceChange('emailInvoice', e.target.checked)
                        }
                      />
                    }
                    label="Email Invoice to Patient"
                  />
                  <Button
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                      mt: 2,
                    }}
                    onClick={handleSaveInvoice}
                  >
                    Save Invoice Settings
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default BillingSetup;
