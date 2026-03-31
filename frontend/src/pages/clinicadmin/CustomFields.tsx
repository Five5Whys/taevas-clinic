import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

const BRAND = '#5519E6';
const SUB = '#6B7280';
const BORDER = '#E5E7EB';

interface CustomField {
  id: string;
  name: string;
  appliesTo: 'Patient' | 'Doctor';
  type: 'Text' | 'Textarea' | 'Dropdown' | 'Number' | 'Date';
  required: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  options?: string;
}

const initialFields: CustomField[] = [
  { id: '1', name: 'Insurance ID', appliesTo: 'Patient', type: 'Text', required: true, status: 'ACTIVE' },
  { id: '2', name: 'Allergies', appliesTo: 'Patient', type: 'Textarea', required: false, status: 'ACTIVE' },
  { id: '3', name: 'Medical Council Reg. No.', appliesTo: 'Doctor', type: 'Text', required: true, status: 'ACTIVE' },
  { id: '4', name: 'Preferred Language', appliesTo: 'Patient', type: 'Dropdown', required: false, status: 'ACTIVE', options: 'English,Hindi,Tamil' },
  { id: '5', name: 'Emergency Contact', appliesTo: 'Patient', type: 'Text', required: true, status: 'INACTIVE' },
];

const emptyField = {
  name: '',
  appliesTo: 'Patient' as 'Patient' | 'Doctor',
  type: 'Text' as 'Text' | 'Textarea' | 'Dropdown' | 'Number' | 'Date',
  required: false,
  options: '',
};

const CustomFields: React.FC = () => {
  const [fields, setFields] = useState<CustomField[]>(initialFields);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newField, setNewField] = useState(emptyField);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleOpenDialog = () => {
    setNewField({ ...emptyField });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddField = () => {
    if (!newField.name.trim()) {
      setSnackbar({ open: true, message: 'Field name is required', severity: 'error' });
      return;
    }
    const field: CustomField = {
      id: String(Date.now()),
      name: newField.name.trim(),
      appliesTo: newField.appliesTo,
      type: newField.type,
      required: newField.required,
      status: 'ACTIVE',
      options: newField.type === 'Dropdown' ? newField.options : undefined,
    };
    setFields([...fields, field]);
    setDialogOpen(false);
    setSnackbar({ open: true, message: `Field "${field.name}" added successfully`, severity: 'success' });
  };

  const handleDelete = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    setSnackbar({ open: true, message: 'Field deleted', severity: 'success' });
  };

  return (
    <DashboardLayout pageTitle="Custom Fields">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
              Custom Fields
            </Typography>
            <Typography variant="body2" sx={{ color: SUB, mt: 0.5 }}>
              Define extra fields for patients and doctors at this clinic
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            sx={{
              bgcolor: BRAND,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#4313C4' },
            }}
          >
            + Add Field
          </Button>
        </Box>

        {/* Table */}
        <Card sx={{ border: `1px solid ${BORDER}`, boxShadow: 'none' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Field Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Applies To</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Required</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field) => (
                  <TableRow key={field.id} sx={{ '&:hover': { bgcolor: '#F9FAFB' } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{field.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={field.appliesTo}
                        size="small"
                        sx={{
                          bgcolor: field.appliesTo === 'Patient' ? '#EFF6FF' : '#F3E8FF',
                          color: field.appliesTo === 'Patient' ? '#2563EB' : '#7C3AED',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{field.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={field.required ? 'Yes' : 'No'}
                        size="small"
                        sx={{
                          bgcolor: field.required ? '#ECFDF5' : '#F3F4F6',
                          color: field.required ? '#059669' : '#6B7280',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={field.status}
                        size="small"
                        sx={{
                          bgcolor: field.status === 'ACTIVE' ? '#ECFDF5' : '#FEF2F2',
                          color: field.status === 'ACTIVE' ? '#059669' : '#DC2626',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleDelete(field.id)} sx={{ color: '#EF4444' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Add Field Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Add Custom Field</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
            <TextField
              label="Field Name"
              fullWidth
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Applies To</InputLabel>
              <Select
                value={newField.appliesTo}
                label="Applies To"
                onChange={(e) => setNewField({ ...newField, appliesTo: e.target.value as 'Patient' | 'Doctor' })}
              >
                <MenuItem value="Patient">Patient</MenuItem>
                <MenuItem value="Doctor">Doctor</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={newField.type}
                label="Type"
                onChange={(e) =>
                  setNewField({ ...newField, type: e.target.value as 'Text' | 'Textarea' | 'Dropdown' | 'Number' | 'Date' })
                }
              >
                <MenuItem value="Text">Text</MenuItem>
                <MenuItem value="Textarea">Textarea</MenuItem>
                <MenuItem value="Dropdown">Dropdown</MenuItem>
                <MenuItem value="Number">Number</MenuItem>
                <MenuItem value="Date">Date</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: SUB }}>
                Required
              </Typography>
              <Switch
                checked={newField.required}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: BRAND },
                }}
              />
            </Box>
            {newField.type === 'Dropdown' && (
              <TextField
                label="Options"
                fullWidth
                placeholder="Comma-separated values (e.g. English,Hindi,Tamil)"
                value={newField.options}
                onChange={(e) => setNewField({ ...newField, options: e.target.value })}
              />
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', color: SUB }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddField}
              sx={{ bgcolor: BRAND, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#4313C4' } }}
            >
              Add Field
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default CustomFields;
