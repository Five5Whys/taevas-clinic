import { useState } from 'react';
import { Box, Typography, Paper, Card, CardContent, Chip, CircularProgress, Alert, Grid,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Snackbar, Stack } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePatientFamily, useEmergencyContacts, useAddEmergencyContact, useUpdateEmergencyContact, useDeleteEmergencyContact } from '../../hooks/patient';
import { toTitle } from '@/utils/helpers';

interface ECForm { relationship: string; fullName: string; contactNumber: string; }
const emptyForm: ECForm = { relationship: '', fullName: '', contactNumber: '' };

const Family = () => {
  const { data: familyData, isLoading: famLoading } = usePatientFamily();
  const { data: contacts, isLoading: ecLoading, error: ecError } = useEmergencyContacts();
  const addMutation = useAddEmergencyContact();
  const updateMutation = useUpdateEmergencyContact();
  const deleteMutation = useDeleteEmergencyContact();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ECForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [snack, setSnack] = useState('');

  const openAdd = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (c: any) => { setEditId(c.id); setForm({ relationship: c.relationship || '', fullName: c.fullName, contactNumber: c.contactNumber }); setDialogOpen(true); };

  const handleSave = async () => {
    try {
      if (editId) { await updateMutation.mutateAsync({ contactId: editId, data: form }); setSnack('Family member updated'); }
      else { await addMutation.mutateAsync(form); setSnack('Family member added'); }
      setDialogOpen(false);
    } catch { setSnack('Failed to save family member'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try { await deleteMutation.mutateAsync(deleteConfirm); setSnack('Family member deleted'); }
    catch { setSnack('Failed to delete'); }
    setDeleteConfirm(null);
  };

  const isLoading = famLoading || ecLoading;
  const saving = addMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout pageTitle="My Family">
      <Box sx={{ px: 3, py: 2.5 }}>

        {/* Family Details Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>Family Details</Typography>
          <Button variant="contained" startIcon={<span>+</span>} onClick={openAdd} size="small">Add Family Member</Button>
        </Box>

        {isLoading && <CircularProgress />}
        {ecError && <Alert severity="error" sx={{ mb: 2 }}>Failed to load family details</Alert>}

        {contacts && Array.isArray(contacts) && contacts.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', mb: 4 }} elevation={0}>
            <Typography sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}>👨‍👩‍👧</Typography>
            <Typography color="text.secondary">No family members added yet</Typography>
            <Button variant="outlined" startIcon={<span>+</span>} onClick={openAdd} sx={{ mt: 2 }} size="small">Add Your First Family Member</Button>
          </Paper>
        )}

        {contacts && Array.isArray(contacts) && contacts.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {contacts.map((c: any) => (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>{c.fullName}</Typography>
                        <Chip label={toTitle(c.relationship) || 'Other'} size="small" sx={{ mt: 0.5, mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">{c.contactNumber}</Typography>
                      </Box>
                      <Stack direction="row">
                        <IconButton size="small" onClick={() => openEdit(c)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteConfirm(c.id)}><DeleteIcon fontSize="small" /></IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Family Groups Section */}
        {familyData && Array.isArray(familyData) && familyData.length > 0 && (
          <>
            <Typography variant="h6" fontWeight={600} mb={2}>Family Groups</Typography>
            <Grid container spacing={2}>
              {familyData.map((g: any) => (
                <Grid item xs={12} md={6} key={g.id}>
                  <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{g.name}</Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>Primary: {g.primaryPatientName || '\u2014'}</Typography>
                      {(g.members || []).map((m: any) => <Chip key={m.id} label={`${m.patientName || 'Member'} (${m.relationship})`} sx={{ mr: 1, mb: 1 }} />)}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{editId ? 'Edit Family Member' : 'Add Family Member'}</DialogTitle>
          <DialogContent>
            <TextField label="Full Name" fullWidth margin="normal" value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            <TextField label="Relationship" fullWidth margin="normal" value={form.relationship}
              onChange={(e) => setForm({ ...form, relationship: e.target.value })} placeholder="e.g. Mother, Father, Spouse" />
            <TextField label="Contact Number" fullWidth margin="normal" value={form.contactNumber}
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} required />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving || !form.fullName || !form.contactNumber}>
              {saving ? 'Saving...' : editId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
          <DialogTitle>Remove Family Member?</DialogTitle>
          <DialogContent><Typography>This action cannot be undone.</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} message={snack} />
      </Box>
    </DashboardLayout>
  );
};
export default Family;
