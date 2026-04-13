import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toTitle } from '@/utils/helpers';

const BRAND = '#5519E6';
const SUB = '#6B7280';

interface ImportSession {
  date: string;
  type: string;
  records: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  importedBy: string;
}

const mockUserImports: ImportSession[] = [
  { date: '2026-03-30', type: 'Clinic Admins', records: 12, status: 'COMPLETED', importedBy: 'SA Admin' },
  { date: '2026-03-28', type: 'Doctors', records: 35, status: 'COMPLETED', importedBy: 'SA Admin' },
  { date: '2026-03-25', type: 'Staff', records: 8, status: 'IN_PROGRESS', importedBy: 'SA Admin' },
  { date: '2026-03-20', type: 'Doctors', records: 0, status: 'FAILED', importedBy: 'SA Admin' },
];

const mockPatientImports: ImportSession[] = [
  { date: '2026-03-29', type: 'Patients', records: 240, status: 'COMPLETED', importedBy: 'SA Admin' },
  { date: '2026-03-27', type: 'Patients', records: 85, status: 'COMPLETED', importedBy: 'SA Admin' },
  { date: '2026-03-22', type: 'Patients', records: 150, status: 'IN_PROGRESS', importedBy: 'SA Admin' },
  { date: '2026-03-18', type: 'Patients', records: 0, status: 'FAILED', importedBy: 'SA Admin' },
];

const statusConfig: Record<ImportSession['status'], { bg: string; color: string }> = {
  COMPLETED: { bg: '#D1FAE5', color: '#065F46' },
  IN_PROGRESS: { bg: '#DBEAFE', color: '#1E40AF' },
  FAILED: { bg: '#FEE2E2', color: '#991B1B' },
};

const DataImport: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [patientFile, setPatientFile] = useState<File | null>(null);
  const userFileRef = useRef<HTMLInputElement>(null);
  const patientFileRef = useRef<HTMLInputElement>(null);

  const currentFile = tab === 0 ? userFile : patientFile;
  const setCurrentFile = tab === 0 ? setUserFile : setPatientFile;
  const currentRef = tab === 0 ? userFileRef : patientFileRef;
  const currentImports = tab === 0 ? mockUserImports : mockPatientImports;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setCurrentFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0] || null;
    if (dropped && dropped.name.endsWith('.csv')) {
      setCurrentFile(dropped);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDownloadTemplate = () => {
    const headers =
      tab === 0
        ? 'first_name,last_name,email,phone,role,clinic_id'
        : 'first_name,last_name,email,phone,date_of_birth,gender,clinic_id';
    const blob = new Blob([headers + '\n'], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = tab === 0 ? 'users_template.csv' : 'patients_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout pageTitle="Data Import">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937', mb: 0.5 }}>
          Data Import
        </Typography>
        <Typography sx={{ fontSize: '0.9rem', color: SUB, mb: 3 }}>
          Bulk import patients and users across clinics
        </Typography>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem' },
              '& .Mui-selected': { color: BRAND },
              '& .MuiTabs-indicator': { backgroundColor: BRAND },
            }}
          >
            <Tab label="Bulk Users" />
            <Tab label="Bulk Patients" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Upload zone */}
            <Box
              onClick={() => currentRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: '2px dashed #D1D5DB',
                borderRadius: '12px',
                p: 5,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background-color 0.2s',
                '&:hover': { borderColor: BRAND, backgroundColor: '#F5F3FF' },
              }}
            >
              <input
                type="file"
                accept=".csv"
                ref={userFileRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <input
                type="file"
                accept=".csv"
                ref={patientFileRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Icons.CloudUpload sx={{ fontSize: 48, color: BRAND, mb: 1 }} />
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 500, color: '#374151' }}>
                Drag & drop a CSV file here, or click to browse
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: SUB, mt: 0.5 }}>
                Accepted format: .csv
              </Typography>
              {currentFile && (
                <Chip
                  label={currentFile.name}
                  color="primary"
                  variant="outlined"
                  onDelete={() => setCurrentFile(null)}
                  sx={{ mt: 2, fontSize: '0.85rem' }}
                />
              )}
            </Box>

            {/* Actions row */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Icons.Download />}
                onClick={handleDownloadTemplate}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: BRAND,
                  color: BRAND,
                  '&:hover': { borderColor: '#4314B8', backgroundColor: '#F5F3FF' },
                }}
              >
                Download Template
              </Button>
              {currentFile && (
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: BRAND,
                    '&:hover': { backgroundColor: '#4314B8' },
                  }}
                >
                  Start Import
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Recent Import Sessions */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937', mb: 2 }}>
            Recent Import Sessions
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '0.8rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '0.8rem' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '0.8rem' }}>Records</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '0.8rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '0.8rem' }}>Imported By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentImports.map((row, idx) => {
                  const chip = statusConfig[row.status];
                  return (
                    <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.date}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.type}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.records}</TableCell>
                      <TableCell>
                        <Chip
                          label={toTitle(row.status)}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backgroundColor: chip.bg,
                            color: chip.color,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.importedBy}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default DataImport;
