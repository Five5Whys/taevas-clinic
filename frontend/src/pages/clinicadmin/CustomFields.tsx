import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Delete, Lock, LightbulbOutlined } from '@mui/icons-material';

const SOAP_TOOLTIP = <>S — Subjective (patient's symptoms & history)<br/>O — Objective (clinical findings & vitals)<br/>A — Assessment (diagnosis)<br/>P — Plan (treatment & follow-up)</>;
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCustomFields, useCreateCustomField, useDeleteCustomField } from '@/hooks/clinicadmin/useCustomFields';
import { toTitle } from '@/utils/helpers';

// ---- Constants ---------------------------------------------------------------
const BRAND = '#5519E6';
const BRAND_HOVER = '#4313C4';
const SUB = '#6B7280';
const BORDER = '#E5E7EB';

// ---- Types -------------------------------------------------------------------
type FieldType = 'Text' | 'Textarea' | 'Dropdown' | 'Number' | 'Date';
type FieldScope = 'GLOBAL' | 'CLINIC';
type FieldSection = 'INTAKE' | 'SOAP';

interface FieldRow {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  scope: FieldScope;
}

// ---- Mock Data removed — now fetched via API --------------------------------

const FIELD_TYPES: FieldType[] = ['Text', 'Textarea', 'Dropdown', 'Number', 'Date'];

const emptyField = {
  label: '',
  type: 'Text' as FieldType,
  required: false,
  options: '',
};

// ---- Scope Chip --------------------------------------------------------------
const ScopeChip: React.FC<{ scope: FieldScope }> = ({ scope }) => {
  const isGlobal = scope === 'GLOBAL';
  return (
    <Chip
      icon={isGlobal ? <Lock sx={{ fontSize: '13px !important' }} /> : undefined}
      label={scope}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: '10.5px',
        height: 24,
        bgcolor: isGlobal ? '#FEF3C7' : '#EDE9FE',
        color: isGlobal ? '#92400E' : '#5B21B6',
        border: '1px solid',
        borderColor: isGlobal ? '#FCD34D' : '#C4B5FD',
        '& .MuiChip-icon': { color: isGlobal ? '#D97706' : undefined },
      }}
    />
  );
};

// ---- Main Component ----------------------------------------------------------
const CustomFields: React.FC = () => {
  const { data: allFieldsData, isLoading } = useCustomFields();
  const createField = useCreateCustomField();
  const deleteField = useDeleteCustomField();

  const [tab, setTab] = useState<0 | 1>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newField, setNewField] = useState({ ...emptyField });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activeSection: FieldSection = tab === 0 ? 'INTAKE' : 'SOAP';
  const allFields: FieldRow[] = allFieldsData ?? [];
  const intakeFields = allFields.filter((f: any) => f.section === 'INTAKE' || !f.section);
  const soapFields = allFields.filter((f: any) => f.section === 'SOAP');
  const fields = activeSection === 'INTAKE' ? intakeFields : soapFields;

  // ---- Handlers ----------------------------------------------------------------
  const handleOpenDialog = () => {
    setNewField({ ...emptyField });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  const handleAddField = () => {
    if (!newField.label.trim()) {
      setSnackbar({ open: true, message: 'Field label is required', severity: 'error' });
      return;
    }
    const payload = {
      label: newField.label.trim(),
      type: newField.type,
      required: newField.required,
      scope: 'CLINIC',
      section: activeSection,
      options: newField.options,
    };
    createField.mutate(payload, {
      onSuccess: () => {
        setDialogOpen(false);
        setSnackbar({ open: true, message: `Field "${payload.label}" added`, severity: 'success' });
      },
      onError: () => setSnackbar({ open: true, message: 'Failed to add field', severity: 'error' }),
    });
  };

  const handleDelete = (id: string) => {
    const target = fields.find((f) => f.id === id);
    if (!target || target.scope === 'GLOBAL') return;
    deleteField.mutate(id, {
      onSuccess: () => setSnackbar({ open: true, message: 'Field deleted', severity: 'success' }),
      onError: () => setSnackbar({ open: true, message: 'Failed to delete field', severity: 'error' }),
    });
  };

  // ---- Render ------------------------------------------------------------------
  return (
    <DashboardLayout pageTitle="Field Manager">
      <Container maxWidth="lg" sx={{ py: 3 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
              Field Manager
            </Typography>
            <Typography variant="body2" sx={{ color: SUB, mt: 0.5 }}>
              Manage intake and SOAP fields for your clinic. Global fields are locked by Super Admin.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            sx={{
              bgcolor: BRAND,
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              '&:hover': { bgcolor: BRAND_HOVER },
            }}
          >
            + Add Field
          </Button>
        </Box>

        {/* Info Banner */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, px: 2, py: 1.25,
          background: 'linear-gradient(135deg, #5519E608 0%, #F59E0B08 100%)',
          border: '1px solid #5519E620', borderRadius: 2,
        }}>
          <Lock sx={{ fontSize: 18, color: '#D97706' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px', color: '#374151' }}>
              Global fields are managed by Super Admin
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '11px' }}>
              Fields marked GLOBAL are read-only. You can add custom CLINIC-level fields that apply only to your clinic.
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '13px',
              color: SUB,
              '&.Mui-selected': { color: BRAND },
            },
            '& .MuiTabs-indicator': { backgroundColor: BRAND },
          }}
        >
          <Tab label="INTAKE FIELDS" />
          <Tab label={<Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>SOAP FIELDS<Tooltip title={SOAP_TOOLTIP} arrow placement="top"><LightbulbOutlined sx={{ fontSize: 14, color: '#F59E0B', cursor: 'help' }} /></Tooltip></Box>} />
        </Tabs>

        {/* Table */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: BRAND }} />
          </Box>
        ) : (
        <Card sx={{ border: `1px solid ${BORDER}`, boxShadow: 'none' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '12px' }}>Field Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '12px' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '12px' }}>Required</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '12px' }}>Scope</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: SUB, fontSize: '12px', width: 80 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: SUB }}>
                      No fields configured yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  fields.map((field) => {
                    const isGlobal = field.scope === 'GLOBAL';
                    return (
                      <TableRow
                        key={field.id}
                        sx={{
                          bgcolor: isGlobal ? '#FAFAFB' : '#fff',
                          '&:hover': { bgcolor: isGlobal ? '#F5F5F6' : '#FAFAFF' },
                          transition: 'background 0.15s',
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isGlobal && (
                              <Tooltip title="Locked by Super Admin" arrow>
                                <Lock sx={{ fontSize: 14, color: '#D97706' }} />
                              </Tooltip>
                            )}
                            <Typography variant="body2" sx={{ fontWeight: isGlobal ? 600 : 500, fontSize: '13px' }}>
                              {field.label}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={toTitle(field.type)}
                            size="small"
                            sx={{
                              background: '#F3F4F6',
                              color: '#374151',
                              fontWeight: 600,
                              fontSize: '11px',
                              height: 22,
                              fontFamily: 'monospace',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={field.required ? 'Yes' : 'No'}
                            size="small"
                            sx={{
                              bgcolor: field.required ? '#ECFDF5' : '#F3F4F6',
                              color: field.required ? '#059669' : '#6B7280',
                              fontWeight: 600,
                              fontSize: '11px',
                              height: 22,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <ScopeChip scope={field.scope} />
                        </TableCell>
                        <TableCell>
                          {isGlobal ? (
                            <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '10.5px', fontStyle: 'italic' }}>
                              Read-only
                            </Typography>
                          ) : (
                            <Tooltip title="Delete field" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(field.id)}
                                sx={{
                                  color: '#F43F5E',
                                  '&:hover': { bgcolor: '#FFF1F2' },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
        )}

        {/* Add Field Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: '16px' }}>
            Add Clinic Field {activeSection === 'INTAKE' ? '- Intake' : '- SOAP'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
            <TextField
              label="Field Label"
              fullWidth
              size="small"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              placeholder="e.g. Emergency Contact"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={newField.type}
                label="Type"
                onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
              >
                {FIELD_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: SUB, fontSize: '13px' }}>
                Required
              </Typography>
              <Switch
                checked={newField.required}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                size="small"
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
                size="small"
                placeholder="Comma-separated values (e.g. English,Hindi,Tamil)"
                value={newField.options}
                onChange={(e) => setNewField({ ...newField, options: e.target.value })}
              />
            )}

            {/* Scope notice */}
            <Box sx={{
              background: '#EDE9FE', borderRadius: 1.5, px: 2, py: 1,
              border: '1px solid #C4B5FD',
            }}>
              <Typography variant="caption" sx={{ color: '#5B21B6', fontWeight: 600, fontSize: '11px' }}>
                This field will be scoped to your clinic only (CLINIC scope).
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', color: SUB, fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddField}
              disabled={!newField.label.trim()}
              sx={{
                bgcolor: BRAND,
                textTransform: 'none',
                fontWeight: 700,
                '&:hover': { bgcolor: BRAND_HOVER },
              }}
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

      </Container>
    </DashboardLayout>
  );
};

export default CustomFields;
