import React, { useState, useRef } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Tabs,
  Tab,
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Slider,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  CloudUpload as Upload,
  Clear,
  Undo as UndoIcon,
  Visibility,
  Info as InfoIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Templates: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [logoSettings, setLogoSettings] = useState({
    watermarkOpacity: 15,
    showOnHeader: true,
    showAsWatermark: true,
    showOnInvoice: false,
  });

  const [signatureSettings, setSignatureSettings] = useState({
    applyToAllDoctors: true,
    showOnRx: true,
    showOnInvoice: false,
    penColor: '#000000',
    penSize: 2,
    uploadMode: false,
  });

  const [qrConfig, setQrConfig] = useState({
    doctorName: 'Dr. Rajesh Kumar',
    clinicName: 'Taevas Clinic',
    nmcRegistration: 'A1234567',
    prescriptionHash: 'abc123def456',
  });

  const [stickerConfig, setStickerConfig] = useState({
    title: 'Taevas Clinic',
    line1: '123 Medical Plaza',
    line2: 'Baner Road, Pune',
    phone: '+91 9876543210',
    website: 'taevas.in',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLogoSave = () => {
    console.log('Global logo settings saved:', logoSettings);
  };

  const handleSignatureSave = () => {
    console.log('Global signature settings saved:', signatureSettings);
  };

  const handleQRSave = () => {
    console.log('Global QR config saved:', qrConfig);
  };

  const handleStickerSave = () => {
    console.log('Global sticker config saved:', stickerConfig);
  };

  return (
    <DashboardLayout pageTitle="Global Templates">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Info Banner */}
        <Alert
          severity="info"
          icon={<InfoIcon />}
          sx={{
            mb: 2,
            borderLeft: '4px solid #5519E6',
            '& .MuiAlert-icon': { color: '#5519E6' },
          }}
        >
          These are global defaults. Clinics can override with their own settings.
        </Alert>

        <Card>
          <CardHeader
            title="Global Templates"
            subheader="Default templates inherited by all clinics"
          />
          <CardContent>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                mb: 3,
                '& .MuiTab-root.Mui-selected': { color: '#5519E6' },
                '& .MuiTabs-indicator': { backgroundColor: '#5519E6' },
              }}
            >
              <Tab label="Clinic Logo" />
              <Tab label="Digital Signature" />
              <Tab label="Prescription QR Code" />
              <Tab label="Address QR" />
            </Tabs>

            {/* Tab 1: Clinic Logo */}
            {activeTab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1.5}>
                    {/* Upload Zone */}
                    <Paper
                      sx={{
                        p: 2,
                        border: '2px dashed #ccc',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#fafafa',
                        '&:hover': { backgroundColor: '#f5f5f5', borderColor: '#999' },
                        transition: 'all 0.2s',
                      }}
                    >
                      <Upload sx={{ fontSize: 28, color: '#999', mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        Drag & drop logo
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>
                        PNG, JPG, max 2MB
                      </Typography>
                    </Paper>

                    {/* Logo Display Settings */}
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                        Display Settings
                      </Typography>
                      <Box sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontSize: '0.75rem', mb: 0.5 }}>
                          Watermark Opacity: {logoSettings.watermarkOpacity}%
                        </Typography>
                        <Slider
                          value={logoSettings.watermarkOpacity}
                          onChange={(_, value) =>
                            setLogoSettings({
                              ...logoSettings,
                              watermarkOpacity: value as number,
                            })
                          }
                          min={5}
                          max={25}
                          marks={[
                            { value: 5, label: '5%' },
                            { value: 25, label: '25%' },
                          ]}
                          sx={{ fontSize: '0.75rem', color: '#5519E6' }}
                        />
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={logoSettings.showOnHeader}
                            onChange={(e) =>
                              setLogoSettings({
                                ...logoSettings,
                                showOnHeader: e.target.checked,
                              })
                            }
                            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#5519E6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5519E6' } }}
                          />
                        }
                        label={<Typography sx={{ fontSize: '0.8rem' }}>Show on Rx header</Typography>}
                        sx={{ mb: 0.5 }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={logoSettings.showAsWatermark}
                            onChange={(e) =>
                              setLogoSettings({
                                ...logoSettings,
                                showAsWatermark: e.target.checked,
                              })
                            }
                            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#5519E6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5519E6' } }}
                          />
                        }
                        label={<Typography sx={{ fontSize: '0.8rem' }}>Show as watermark</Typography>}
                        sx={{ mb: 0.5 }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={logoSettings.showOnInvoice}
                            onChange={(e) =>
                              setLogoSettings({
                                ...logoSettings,
                                showOnInvoice: e.target.checked,
                              })
                            }
                            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#5519E6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5519E6' } }}
                          />
                        }
                        label={<Typography sx={{ fontSize: '0.8rem' }}>Show on Invoice</Typography>}
                        sx={{ mb: 1 }}
                      />
                    </Box>

                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                        fontSize: '0.8rem',
                        textTransform: 'none',
                      }}
                      onClick={handleLogoSave}
                    >
                      Save Settings
                    </Button>
                  </Stack>
                </Grid>

                {/* Logo Preview */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', height: '100%' }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                      Live Prescription Preview
                    </Typography>
                    <Paper
                      sx={{
                        p: 1.5,
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        fontSize: '0.75rem',
                        minHeight: 280,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Watermark */}
                      {logoSettings.showAsWatermark && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-45deg)',
                            opacity: logoSettings.watermarkOpacity / 100,
                            fontSize: '4rem',
                            color: '#ccc',
                            fontWeight: 'bold',
                            pointerEvents: 'none',
                            zIndex: 1,
                          }}
                        >
                          LOGO
                        </Box>
                      )}

                      <Stack spacing={0.5} sx={{ position: 'relative', zIndex: 2 }}>
                        {/* Header */}
                        {logoSettings.showOnHeader && (
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', pb: 0.5, borderBottom: '1px solid #e0e0e0' }}>
                            <Box sx={{ width: 30, height: 30, backgroundColor: '#e0e0e0', fontSize: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              LOGO
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Taevas Clinic</Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>Dr. Rajesh Kumar</Typography>
                            </Box>
                          </Box>
                        )}

                        {/* Patient Section */}
                        <Box sx={{ py: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem' }}>
                            <strong>Patient:</strong> John Doe | <strong>Age:</strong> 45
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem' }}>
                            <strong>Date:</strong> 2026-03-31
                          </Typography>
                        </Box>

                        {/* Medications */}
                        <Box sx={{ py: 0.5, borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, mb: 0.3 }}>Medications:</Typography>
                          <Typography sx={{ fontSize: '0.7rem' }}>1. Aspirin 500mg - 1 tablet x 2 times daily</Typography>
                          <Typography sx={{ fontSize: '0.7rem' }}>2. Vitamin D - 1 capsule daily</Typography>
                        </Box>

                        {/* Signature & QR */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pt: 0.5 }}>
                          <Box>
                            <Typography sx={{ fontSize: '0.7rem' }}>_________</Typography>
                            <Typography sx={{ fontSize: '0.7rem' }}>Signature</Typography>
                          </Box>
                          <Box sx={{ width: 30, height: 30, backgroundColor: '#e0e0e0', fontSize: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            QR
                          </Box>
                        </Box>
                      </Stack>
                    </Paper>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* Tab 2: Digital Signature */}
            {activeTab === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1.5}>
                    {/* Canvas Area */}
                    <Paper
                      sx={{
                        border: '2px solid #ddd',
                        minHeight: 180,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'crosshair',
                        backgroundColor: '#fafafa',
                      }}
                    >
                      <Typography sx={{ color: '#999', fontSize: '0.85rem' }}>
                        Canvas for drawing signature
                      </Typography>
                    </Paper>

                    {/* Pen Color */}
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>
                        Pen Color
                      </Typography>
                      <input
                        type="color"
                        value={signatureSettings.penColor}
                        onChange={(e) =>
                          setSignatureSettings({
                            ...signatureSettings,
                            penColor: e.target.value,
                          })
                        }
                        style={{ width: '100%', height: 36, border: '1px solid #ddd', cursor: 'pointer' }}
                      />
                    </Box>

                    {/* Pen Size */}
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', mb: 0.5 }}>
                        Pen Size: {signatureSettings.penSize}px
                      </Typography>
                      <Slider
                        value={signatureSettings.penSize}
                        onChange={(_, value) =>
                          setSignatureSettings({
                            ...signatureSettings,
                            penSize: value as number,
                          })
                        }
                        min={1}
                        max={5}
                        marks
                        sx={{ color: '#5519E6' }}
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<UndoIcon />}
                        sx={{ fontSize: '0.8rem', textTransform: 'none', flex: 1, borderColor: '#5519E6', color: '#5519E6' }}
                      >
                        Undo
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Clear />}
                        sx={{ fontSize: '0.8rem', textTransform: 'none', flex: 1, borderColor: '#5519E6', color: '#5519E6' }}
                      >
                        Clear
                      </Button>
                    </Stack>

                    {/* Upload Mode Toggle */}
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={signatureSettings.uploadMode}
                          onChange={(e) =>
                            setSignatureSettings({
                              ...signatureSettings,
                              uploadMode: e.target.checked,
                            })
                          }
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#5519E6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5519E6' } }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.8rem' }}>Upload mode</Typography>}
                    />

                    {/* Toggles */}
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={signatureSettings.applyToAllDoctors}
                          onChange={(e) =>
                            setSignatureSettings({
                              ...signatureSettings,
                              applyToAllDoctors: e.target.checked,
                            })
                          }
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#5519E6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5519E6' } }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.8rem' }}>Apply to all doctors</Typography>}
                      sx={{ mb: 0.5 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={signatureSettings.showOnRx}
                          onChange={(e) =>
                            setSignatureSettings({
                              ...signatureSettings,
                              showOnRx: e.target.checked,
                            })
                          }
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#5519E6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5519E6' } }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.8rem' }}>Show on Rx</Typography>}
                      sx={{ mb: 0.5 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={signatureSettings.showOnInvoice}
                          onChange={(e) =>
                            setSignatureSettings({
                              ...signatureSettings,
                              showOnInvoice: e.target.checked,
                            })
                          }
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#5519E6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5519E6' } }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.8rem' }}>Show on Invoice</Typography>}
                      sx={{ mb: 1 }}
                    />

                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                        fontSize: '0.8rem',
                        textTransform: 'none',
                      }}
                      onClick={handleSignatureSave}
                    >
                      Save Signature
                    </Button>
                  </Stack>
                </Grid>

                {/* Signature Preview */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', height: '100%' }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                      Signature Preview
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: 'white',
                        border: '2px dashed #ccc',
                        minHeight: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '0.85rem',
                      }}
                    >
                      [Signature preview area]
                    </Paper>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* Tab 3: Prescription QR Code */}
            {activeTab === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1.5}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      QR Data Fields
                    </Typography>

                    <TextField
                      label="Doctor Name"
                      size="small"
                      fullWidth
                      value={qrConfig.doctorName}
                      onChange={(e) =>
                        setQrConfig({
                          ...qrConfig,
                          doctorName: e.target.value,
                        })
                      }
                      inputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />

                    <TextField
                      label="Clinic Name"
                      size="small"
                      fullWidth
                      value={qrConfig.clinicName}
                      onChange={(e) =>
                        setQrConfig({
                          ...qrConfig,
                          clinicName: e.target.value,
                        })
                      }
                      inputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />

                    <TextField
                      label="NMC Registration"
                      size="small"
                      fullWidth
                      value={qrConfig.nmcRegistration}
                      onChange={(e) =>
                        setQrConfig({
                          ...qrConfig,
                          nmcRegistration: e.target.value,
                        })
                      }
                      inputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />

                    <TextField
                      label="Prescription Hash"
                      size="small"
                      fullWidth
                      value={qrConfig.prescriptionHash}
                      onChange={(e) =>
                        setQrConfig({
                          ...qrConfig,
                          prescriptionHash: e.target.value,
                        })
                      }
                      inputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Visibility />}
                        sx={{
                          background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                          fontSize: '0.8rem',
                          textTransform: 'none',
                          flex: 1,
                        }}
                        onClick={() => setOpenQRDialog(true)}
                      >
                        Preview Scan
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                          fontSize: '0.8rem',
                          textTransform: 'none',
                          flex: 1,
                        }}
                        onClick={handleQRSave}
                      >
                        Save Config
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>

                {/* QR Preview */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', height: '100%', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                      Canvas-Rendered QR
                    </Typography>
                    <Paper
                      sx={{
                        width: 140,
                        height: 140,
                        margin: '0 auto',
                        border: '2px dashed #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        fontSize: '0.85rem',
                        color: '#999',
                      }}
                    >
                      [QR Code]
                    </Paper>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* QR Preview Dialog */}
            <Dialog open={openQRDialog} onClose={() => setOpenQRDialog(false)} maxWidth="sm" fullWidth>
              <DialogTitle sx={{ fontSize: '0.9rem' }}>
                Preview Scanned Page
              </DialogTitle>
              <DialogContent>
                <Stack spacing={1} sx={{ py: 2, fontSize: '0.8rem' }}>
                  <Box sx={{ p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}>
                      Scanned Data:
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', mb: 0.3 }}>
                      Doctor: {qrConfig.doctorName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', mb: 0.3 }}>
                      Clinic: {qrConfig.clinicName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', mb: 0.3 }}>
                      NMC Reg: {qrConfig.nmcRegistration}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem' }}>
                      Hash: {qrConfig.prescriptionHash}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
                    This page will display when the QR code is scanned.
                  </Typography>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpenQRDialog(false)}
                  size="small"
                  sx={{ fontSize: '0.8rem', textTransform: 'none', color: '#5519E6' }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            {/* Tab 4: Address QR */}
            {activeTab === 3 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1.5}>
                    <TextField
                      label="Sticker Title"
                      size="small"
                      fullWidth
                      value={stickerConfig.title}
                      onChange={(e) =>
                        setStickerConfig({
                          ...stickerConfig,
                          title: e.target.value,
                        })
                      }
                      inputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <TextField
                      label="Line 1"
                      size="small"
                      fullWidth
                      value={stickerConfig.line1}
                      onChange={(e) =>
                        setStickerConfig({
                          ...stickerConfig,
                          line1: e.target.value,
                        })
                      }
                      inputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <TextField
                      label="Line 2"
                      size="small"
                      fullWidth
                      value={stickerConfig.line2}
                      onChange={(e) =>
                        setStickerConfig({
                          ...stickerConfig,
                          line2: e.target.value,
                        })
                      }
                      inputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <TextField
                      label="Phone"
                      size="small"
                      fullWidth
                      value={stickerConfig.phone}
                      onChange={(e) =>
                        setStickerConfig({
                          ...stickerConfig,
                          phone: e.target.value,
                        })
                      }
                      inputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />
                    <TextField
                      label="Website"
                      size="small"
                      fullWidth
                      value={stickerConfig.website}
                      onChange={(e) =>
                        setStickerConfig({
                          ...stickerConfig,
                          website: e.target.value,
                        })
                      }
                      inputProps={{ style: { fontSize: '0.8rem' } }}
                      InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                    />

                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                        fontSize: '0.8rem',
                        textTransform: 'none',
                      }}
                      onClick={handleStickerSave}
                    >
                      Save Sticker
                    </Button>
                  </Stack>
                </Grid>

                {/* Sticker Preview */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', height: '100%' }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                      Live Sticker Preview (220x220)
                    </Typography>
                    <Paper
                      sx={{
                        width: 220,
                        height: 220,
                        margin: '0 auto',
                        p: 1.5,
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, mb: 0.3 }}>
                          {stickerConfig.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                          {stickerConfig.line1}
                          <br />
                          {stickerConfig.line2}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', mt: 0.3 }}>
                          {stickerConfig.phone}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem' }}>
                          {stickerConfig.website}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            margin: '0 auto',
                            border: '1px dashed #999',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            color: '#999',
                          }}
                        >
                          QR
                        </Box>
                      </Box>
                    </Paper>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default Templates;
