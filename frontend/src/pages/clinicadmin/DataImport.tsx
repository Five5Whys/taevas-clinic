import React, { useState } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Link,
} from '@mui/material';
import {
  CloudUpload as Upload,
  CheckCircle as Check,
  Error as ErrorIcon,
  Download,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const DataImport: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<'taevas' | 'custom' | ''>('');
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [fileRows, setFileRows] = useState(142);
  const [validationProgress, setValidationProgress] = useState(74);

  const steps = ['Select Format', 'Upload Files', 'Validation', 'Review'];

  const handleNext = () => {
    if (activeStep === 0 && !selectedFormat) {
      alert('Please select a format');
      return;
    }
    setActiveStep(Math.min(activeStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep(Math.max(activeStep - 1, 0));
  };

  const handleImport = (validOnly: boolean) => {
    alert(`Importing ${validOnly ? 'valid records only' : 'all records'}...`);
    setActiveStep(0);
    setSelectedFormat('');
    setUploadedFile('');
  };

  const handleCancel = () => {
    setActiveStep(0);
    setSelectedFormat('');
    setUploadedFile('');
  };

  return (
    <DashboardLayout pageTitle="Data Import">
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Card>
          <CardHeader title="Patient Data Import Wizard" />
          <CardContent>
            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel sx={{ fontSize: '0.75rem' }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step 1: Select Import Format */}
            {activeStep === 0 && (
              <Box>
                <Typography sx={{ fontSize: '0.85rem', mb: 2, fontWeight: 500 }}>
                  Choose your import format:
                </Typography>
                <RadioGroup
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as 'taevas' | 'custom')}
                  sx={{ mb: 3 }}
                >
                  <FormControlLabel
                    value="taevas"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          Taevas Standard Format (CSV)
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
                          Pre-mapped columns for faster import
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="custom"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          Custom Format (upload mapping)
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
                          Map your own columns manually
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>

                <Paper sx={{ p: 2, backgroundColor: '#e3f2fd', mb: 3 }}>
                  <Link
                    href="#"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                    }}
                  >
                    <Download sx={{ fontSize: 16 }} />
                    Download CSV Template
                  </Link>
                </Paper>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" disabled size="small">
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                    }}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 2: Upload Files */}
            {activeStep === 1 && (
              <Box>
                {/* Data Upload Section */}
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, mb: 2 }}>
                  Data Files (Excel/CSV)
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    border: '2px dashed #ccc',
                    textAlign: 'center',
                    cursor: 'pointer',
                    mb: 3,
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                  onClick={() => setUploadedFile('file.xlsx')}
                >
                  <Upload sx={{ fontSize: 28, mb: 1, color: '#5519E6' }} />
                  <Typography sx={{ fontSize: '0.85rem' }}>
                    Drag and drop your file here
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
                    Supports Excel (.xlsx), CSV (.csv)
                  </Typography>
                </Paper>

                {uploadedFile && (
                  <Paper sx={{ p: 1.5, mb: 3, backgroundColor: '#f5f5f5' }}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
                      {uploadedFile} loaded · {fileRows} rows detected
                    </Typography>
                  </Paper>
                )}

                {/* Column Mapper */}
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, mb: 1.5 }}>
                  Column Mapping
                </Typography>
                <TableContainer sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, p: 1 }}>
                          Source Column
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, p: 1 }}>
                          Target Field
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {['patient_name', 'dob', 'email', 'phone'].map((col) => (
                        <TableRow key={col}>
                          <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{col}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>
                            <Select
                              value="auto"
                              size="small"
                              sx={{ fontSize: '0.8rem', height: 28 }}
                            >
                              <MenuItem value="auto">Auto-mapped</MenuItem>
                              <MenuItem value="manual">Manual mapping</MenuItem>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Medical Files Section */}
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, mb: 2 }}>
                  Medical Files (PDF, JPG, PNG, MP4, DICOM)
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    border: '2px dashed #ccc',
                    textAlign: 'center',
                    backgroundColor: '#fafafa',
                    mb: 3,
                  }}
                >
                  <Upload sx={{ fontSize: 24, mb: 1, color: '#999' }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
                    Drag and drop medical files here
                  </Typography>
                </Paper>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" size="small" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                    }}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 3: Validation */}
            {activeStep === 2 && (
              <Box>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, mb: 1 }}>
                  Validation Progress
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
                    {validationProgress}% Complete
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={validationProgress} sx={{ mb: 3 }} />

                {/* Validation Log */}
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, mb: 1.5 }}>
                  Validation Results
                </Typography>
                <Paper sx={{ maxHeight: 200, overflow: 'auto', p: 2, mb: 3, border: '1px solid #e0e0e0' }}>
                  {[
                    { status: 'pass', text: 'Row 1-142: All records loaded successfully' },
                    { status: 'pass', text: 'Row 5: Email validated' },
                    { status: 'pass', text: 'Row 10-25: Date formats normalized' },
                    { status: 'error', text: 'Row 32: Invalid phone number format' },
                    { status: 'error', text: 'Row 48: Missing required field (Name)' },
                    { status: 'pass', text: 'Row 50-142: All remaining records valid' },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                        fontSize: '0.8rem',
                      }}
                    >
                      {item.status === 'pass' ? (
                        <Check sx={{ fontSize: 16, color: '#4caf50' }} />
                      ) : (
                        <ErrorIcon sx={{ fontSize: 16, color: '#f44336' }} />
                      )}
                      <Typography sx={{ fontSize: '0.8rem', color: item.status === 'error' ? '#d32f2f' : '#333' }}>
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Paper>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" size="small" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                    }}
                    onClick={handleNext}
                  >
                    View Summary
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 4: Review Summary */}
            {activeStep === 3 && (
              <Box>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, mb: 2 }}>
                  Import Summary
                </Typography>

                {/* Summary Stats */}
                <Table size="small" sx={{ mb: 3 }}>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500, p: 1 }}>
                        Total Rows
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>142</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500, p: 1 }}>
                        Valid
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', p: 1, color: '#4caf50', fontWeight: 500 }}>
                        138
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500, p: 1 }}>
                        Warnings
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', p: 1, color: '#ff9800' }}>
                        2
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500, p: 1 }}>
                        Errors
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', p: 1, color: '#f44336' }}>
                        2
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                      fontSize: '0.8rem',
                    }}
                    onClick={() => handleImport(false)}
                  >
                    Import All
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: '0.8rem' }}
                    onClick={() => handleImport(true)}
                  >
                    Import Valid Only
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{ fontSize: '0.8rem' }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ fontSize: '0.8rem' }}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default DataImport;
