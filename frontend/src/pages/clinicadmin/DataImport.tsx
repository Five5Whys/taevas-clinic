import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toTitle } from '@/utils/helpers';

const BRAND = '#5519E6';
const SUB = '#6B7280';

interface ImportRecord {
  date: string;
  type: string;
  file: string;
  records: number;
  status: 'COMPLETED' | 'FAILED';
}

const DataImport: React.FC = () => {
  const historyLoading = false;
  const importHistory: ImportRecord[] = [];
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>('Patients');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setProgress(0);
    setImporting(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleStartImport = () => {
    setImporting(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setImporting(false);
          setSnackbar({ open: true, message: 'Import completed successfully!', severity: 'success' });
          setFile(null);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <DashboardLayout pageTitle="Data Import">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937', mb: 0.5 }}>
          Data Import
        </Typography>
        <Typography sx={{ fontSize: '0.9rem', color: SUB, mb: 3 }}>
          Bulk import patients and staff via CSV
        </Typography>

        {/* Import Type Selector */}
        <Card sx={{ p: 3, mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 240, mb: 3 }}>
            <InputLabel>Import Type</InputLabel>
            <Select
              value={importType}
              label="Import Type"
              onChange={(e) => setImportType(e.target.value)}
            >
              <MenuItem value="Patients">Patients</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Appointments">Appointments</MenuItem>
            </Select>
          </FormControl>

          {/* Upload Area */}
          <Box
            onClick={handleUploadClick}
            sx={{
              border: '2px dashed #D1D5DB',
              borderRadius: '12px',
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              '&:hover': { borderColor: BRAND },
            }}
          >
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>&#128228;</Typography>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 500, color: '#374151' }}>
              Drop CSV file here or click to browse
            </Typography>
            {file && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={`${file.name} (${formatFileSize(file.size)})`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.85rem' }}
                />
              </Box>
            )}
          </Box>

          {/* Start Import Button + Progress */}
          {file && (
            <Box sx={{ mt: 3 }}>
              {!importing && progress < 100 && (
                <Button
                  variant="contained"
                  onClick={handleStartImport}
                  sx={{
                    backgroundColor: BRAND,
                    '&:hover': { backgroundColor: '#4314B8' },
                    textTransform: 'none',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Start Import
                </Button>
              )}
              {importing && (
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: SUB }}>
                      Importing {importType}...
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: SUB }}>
                      {progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': { backgroundColor: BRAND },
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Card>

        {/* Import History */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937', mb: 2 }}>
            Import History
          </Typography>
          {historyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: BRAND }} />
            </Box>
          ) : importHistory.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, color: SUB }}>
              <Typography>No import history yet.</Typography>
            </Box>
          ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '0.8rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '0.8rem' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '0.8rem' }}>File</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '0.8rem' }}>Records</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '0.8rem' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {importHistory.map((row: ImportRecord, idx: number) => (
                  <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{row.date}</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{row.type}</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{row.file}</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{row.records}</TableCell>
                    <TableCell>
                      <Chip
                        label={toTitle(row.status)}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          backgroundColor: row.status === 'COMPLETED' ? '#D1FAE5' : '#FEE2E2',
                          color: row.status === 'COMPLETED' ? '#065F46' : '#991B1B',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          )}
        </Card>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default DataImport;
