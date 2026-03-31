import React, { useState, useEffect } from 'react';
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
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useBillingConfig, useUpdateBillingConfig } from '@/hooks/clinicadmin/useConfig';

const BillingSetup: React.FC = () => {
  const { data: billingData, isLoading } = useBillingConfig();
  const updateBilling = useUpdateBillingConfig();

  const [consultationFees, setConsultationFees] = useState({
    newPatient: 0,
    followUp: 0,
    earCleaning: 0,
    nasalEndoscopy: 0,
    audiometry: 0,
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    prefix: '',
    footerNote: '',
    gstNumber: '',
    autoGenerateGST: false,
    emailInvoice: false,
  });

  useEffect(() => {
    if (billingData) {
      if (billingData.consultationFees) setConsultationFees(billingData.consultationFees);
      if (billingData.invoiceSettings) setInvoiceSettings(billingData.invoiceSettings);
    }
  }, [billingData]);

  const handleFeeChange = (field: string, value: number) => {
    setConsultationFees({ ...consultationFees, [field]: value });
  };

  const handleInvoiceChange = (field: string, value: string | boolean) => {
    setInvoiceSettings({ ...invoiceSettings, [field]: value });
  };

  const handleSaveFees = () => {
    updateBilling.mutate({ consultationFees }, {
      onSuccess: () => alert('Consultation fees saved successfully!'),
    });
  };

  const handleSaveInvoice = () => {
    updateBilling.mutate({ invoiceSettings }, {
      onSuccess: () => alert('Invoice settings saved successfully!'),
    });
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
      <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
        🚧 This feature is under development — coming soon!
      </Alert>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
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
      )}
    </DashboardLayout>
  );
};

export default BillingSetup;
