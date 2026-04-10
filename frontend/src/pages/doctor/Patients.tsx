import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Divider,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
  Tooltip,
} from '@mui/material';
import { Search, Add, Visibility as Eye, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon, PersonAdd as PersonAddIcon, PersonRemove as PersonRemoveIcon } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDoctorPatients, useCreateDoctorPatient, useUpdateDoctorPatient, useDeleteDoctorPatient, useEmergencyContacts, useAddEmergencyContact, useUpdateEmergencyContact, useDeleteEmergencyContact, useAssignPatients, useMyPatients, useUnassignPatient } from '@/hooks/doctor';

const BRAND = '#5519E6';
const RELATIONSHIPS = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'];

/* ---------- Emergency Contacts Panel ---------- */
const EmergencyContactsPanel: React.FC<{ patientId: string; onSnack: (msg: string) => void }> = ({ patientId, onSnack }) => {
  const { data: contacts = [], isLoading } = useEmergencyContacts(patientId);
  const addMut = useAddEmergencyContact();
  const updateMut = useUpdateEmergencyContact(patientId);
  const deleteMut = useDeleteEmergencyContact(patientId);

  const empty = { relationship: '', fullName: '', contactNumber: '' };
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [row, setRow] = useState(empty);

  const handleAdd = async () => {
    if (!row.fullName.trim() || !row.contactNumber.trim()) return;
    await addMut.mutateAsync({ patientId, data: row });
    onSnack('Emergency contact added.');
    setRow(empty); setAdding(false);
  };
  const handleUpdate = async () => {
    if (!editId || !row.fullName.trim() || !row.contactNumber.trim()) return;
    await updateMut.mutateAsync({ contactId: editId, data: row });
    onSnack('Emergency contact updated.');
    setRow(empty); setEditId(null);
  };
  const startEdit = (c: any) => { setEditId(c.id); setRow({ relationship: c.relationship || '', fullName: c.fullName, contactNumber: c.contactNumber }); setAdding(false); };
  const handleDelete = async (id: string) => { await deleteMut.mutateAsync(id); onSnack('Emergency contact removed.'); };
  const cancel = () => { setAdding(false); setEditId(null); setRow(empty); };

  if (isLoading) return <CircularProgress size={20} sx={{ color: BRAND, mt: 1 }} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Emergency Contacts</Typography>
        {!adding && !editId && (
          <Button size="small" startIcon={<Add />} onClick={() => { setAdding(true); setRow(empty); }}
            sx={{ color: BRAND, textTransform: 'none', fontWeight: 600 }}>Add</Button>
        )}
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Relationship</TableCell><TableCell>Name</TableCell><TableCell>Phone</TableCell><TableCell width={100}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(contacts as any[]).map((c: any) => (
              editId === c.id ? (
                <TableRow key={c.id}>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select value={row.relationship} onChange={e => setRow(p => ({ ...p, relationship: e.target.value }))} displayEmpty>
                        <MenuItem value="">--</MenuItem>
                        {RELATIONSHIPS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell><TextField size="small" fullWidth value={row.fullName} onChange={e => setRow(p => ({ ...p, fullName: e.target.value }))} /></TableCell>
                  <TableCell><TextField size="small" fullWidth value={row.contactNumber} onChange={e => setRow(p => ({ ...p, contactNumber: e.target.value.replace(/\D/g, '').slice(0, 15) }))} /></TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: BRAND }} onClick={handleUpdate} disabled={!row.fullName.trim() || !row.contactNumber.trim()} title="Save"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: '#6B7280' }} onClick={cancel} title="Cancel"><CloseIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={c.id}>
                  <TableCell>{c.relationship || '-'}</TableCell>
                  <TableCell>{c.fullName}</TableCell>
                  <TableCell>{c.contactNumber}</TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: BRAND }} onClick={() => startEdit(c)} title="Edit"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDelete(c.id)} title="Delete"><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              )
            ))}
            {adding && (
              <TableRow>
                <TableCell>
                  <FormControl size="small" fullWidth>
                    <Select value={row.relationship} onChange={e => setRow(p => ({ ...p, relationship: e.target.value }))} displayEmpty>
                      <MenuItem value="">--</MenuItem>
                      {RELATIONSHIPS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell><TextField size="small" fullWidth placeholder="Full name *" value={row.fullName} onChange={e => setRow(p => ({ ...p, fullName: e.target.value }))} /></TableCell>
                <TableCell><TextField size="small" fullWidth placeholder="Phone *" value={row.contactNumber} onChange={e => setRow(p => ({ ...p, contactNumber: e.target.value.replace(/\D/g, '').slice(0, 15) }))} /></TableCell>
                <TableCell>
                  <IconButton size="small" sx={{ color: BRAND }} onClick={handleAdd} disabled={!row.fullName.trim() || !row.contactNumber.trim()} title="Save"><Add fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#6B7280' }} onClick={cancel} title="Cancel"><CloseIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            )}
            {!adding && (contacts as any[]).length === 0 && !editId && (
              <TableRow><TableCell colSpan={4} sx={{ textAlign: 'center', color: '#9CA3AF', py: 2 }}>No emergency contacts yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

/* ---------- Main Patients Component ---------- */
const Patients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data: patientsData, isLoading } = useDoctorPatients();
  const { data: myPatientsData, isLoading: isLoadingMy } = useMyPatients(searchQuery);
  const patients = (Array.isArray(patientsData) ? patientsData : patientsData?.content ?? patientsData?.patients ?? []) as any[];
  const myPatients = (Array.isArray(myPatientsData) ? myPatientsData : (myPatientsData as any)?.data?.content ?? (myPatientsData as any)?.data ?? (myPatientsData as any)?.content ?? []) as any[];

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewPatient, setViewPatient] = useState<any | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', age: '', gender: 'M', abhaId: '', bloodGroup: 'O+', allergy: '' });
  const [snack, setSnack] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: '', name: '' });
  const createPatient = useCreateDoctorPatient();
  const updatePatient = useUpdateDoctorPatient();
  const deletePatient = useDeleteDoctorPatient();
  const assignPatients = useAssignPatients();
  const unassignPatient = useUnassignPatient();

  const handleAssignSingle = async (patientId: string, name: string) => {
    await assignPatients.mutateAsync({ patientIds: [patientId] });
    setSnack(`${name} assigned to you.`);
  };
  const handleAssignBulk = async () => {
    if (!selectedIds.length) return;
    await assignPatients.mutateAsync({ patientIds: selectedIds });
    setSnack(`${selectedIds.length} patient(s) assigned to you.`);
    setSelectedIds([]);
  };
  const handleUnassign = async (patientId: string, name: string) => {
    await unassignPatient.mutateAsync(patientId);
    setSnack(`${name} unassigned from you.`);
  };
  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelectAll = (list: any[]) => setSelectedIds(prev => prev.length === list.length ? [] : list.map(p => p.id));

  const filteredPatients = patients.filter(
    (p) => {
      const name = `${p.firstName || ''} ${p.lastName || ''}`.trim().toLowerCase();
      const q = searchQuery.toLowerCase();
      return name.includes(q) || (p.id || '').toLowerCase().includes(q) || (p.patientCode || '').toLowerCase().includes(q);
    }
  );

  const resetForm = () => { setForm({ firstName: '', lastName: '', phone: '', age: '', gender: 'M', abhaId: '', bloodGroup: 'O+', allergy: '' }); setEditingId(null); setOpen(false); };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.phone.trim()) return;
    const payload = { firstName: form.firstName, lastName: form.lastName, phone: form.phone, gender: form.gender, bloodGroup: form.bloodGroup, email: '', dateOfBirth: null as string | null };
    if (editingId) {
      await updatePatient.mutateAsync({ id: editingId, data: payload });
      setSnack(`Patient ${form.firstName} ${form.lastName} updated.`);
    } else {
      await createPatient.mutateAsync(payload);
      setSnack(`Patient ${form.firstName} ${form.lastName} registered.`);
    }
    resetForm();
  };

  const handleEdit = (patient: any) => {
    setForm({ firstName: patient.firstName || '', lastName: patient.lastName || '', phone: patient.phone || '', age: '', gender: patient.gender || 'M', abhaId: '', bloodGroup: patient.bloodGroup || 'O+', allergy: '' });
    setEditingId(patient.id);
    setOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deletePatient.mutateAsync(deleteConfirm.id);
    setSnack(`Patient ${deleteConfirm.name} deleted.`);
    setDeleteConfirm({ open: false, id: '', name: '' });
  };

  const activeLoading = viewMode === 'all' ? isLoading : isLoadingMy;
  const activeList = viewMode === 'all' ? filteredPatients : myPatients;

  if (isLoading && viewMode === 'all') {
    return (
      <DashboardLayout pageTitle="Patients">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: BRAND }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Patients">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode} exclusive
            onChange={(_, v) => { if (v) { setViewMode(v); setSelectedIds([]); } }}
            size="small"
            sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 600, px: 2 }, '& .Mui-selected': { backgroundColor: '#EDE9FE !important', color: `${BRAND} !important` } }}
          >
            <ToggleButton value="all">All Patients</ToggleButton>
            <ToggleButton value="my">My Patients</ToggleButton>
          </ToggleButtonGroup>
          <Box sx={{ flex: 1 }} />
          {viewMode === 'all' && selectedIds.length > 0 && (
            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleAssignBulk}
              disabled={assignPatients.isPending}
              sx={{ backgroundColor: BRAND, color: '#fff', '&:hover': { backgroundColor: '#4410cc' }, whiteSpace: 'nowrap', textTransform: 'none', fontWeight: 700 }}>
              Assign {selectedIds.length} to Me
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
          <TextField
            fullWidth placeholder="Search by patient name or ID..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            variant="outlined" size="small"
          />
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}
            sx={{ backgroundColor: BRAND, color: '#fff', '&:hover': { backgroundColor: '#4410cc' }, whiteSpace: 'nowrap' }}>
            New Patient
          </Button>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              {viewMode === 'all' ? 'Patients' : 'My Patients'} ({activeLoading ? '...' : activeList.length})
            </Typography>
            {activeLoading && viewMode === 'my' ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress sx={{ color: BRAND }} /></Box>
            ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    {viewMode === 'all' && (
                      <TableCell padding="checkbox">
                        <Checkbox size="small" checked={selectedIds.length > 0 && selectedIds.length === activeList.length}
                          indeterminate={selectedIds.length > 0 && selectedIds.length < activeList.length}
                          onChange={() => toggleSelectAll(activeList)} sx={{ color: BRAND, '&.Mui-checked': { color: BRAND }, '&.MuiCheckbox-indeterminate': { color: BRAND } }} />
                      </TableCell>
                    )}
                    <TableCell>Patient ID</TableCell><TableCell>Name</TableCell><TableCell>Gender</TableCell>
                    <TableCell>Blood Group</TableCell><TableCell>Email</TableCell><TableCell>Last Visit</TableCell><TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeList.map((patient: any) => (
                    <TableRow key={patient.id} selected={selectedIds.includes(patient.id)}>
                      {viewMode === 'all' && (
                        <TableCell padding="checkbox">
                          <Checkbox size="small" checked={selectedIds.includes(patient.id)} onChange={() => toggleSelect(patient.id)}
                            sx={{ color: BRAND, '&.Mui-checked': { color: BRAND } }} />
                        </TableCell>
                      )}
                      <TableCell><Chip label={patient.patientCode || patient.id} size="small" sx={{ fontFamily: 'monospace', fontWeight: 700, backgroundColor: '#EDE9FE', color: BRAND }} /></TableCell>
                      <TableCell sx={{ fontWeight: '500' }}>{patient.firstName} {patient.lastName}</TableCell>
                      <TableCell>{patient.gender || '-'}</TableCell>
                      <TableCell>{patient.bloodGroup || '-'}</TableCell>
                      <TableCell>{patient.email || '-'}</TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ color: BRAND }} title="View Patient Record" onClick={() => setViewPatient(patient)}><Eye fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: BRAND }} title="Edit Patient" onClick={() => handleEdit(patient)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: '#EF4444' }} title="Delete Patient" onClick={() => setDeleteConfirm({ open: true, id: patient.id, name: `${patient.firstName} ${patient.lastName || ''}`.trim() })}><DeleteIcon fontSize="small" /></IconButton>
                        {viewMode === 'all' ? (
                          <Tooltip title="Assign to Me"><IconButton size="small" sx={{ color: BRAND }} onClick={() => handleAssignSingle(patient.id, `${patient.firstName} ${patient.lastName || ''}`.trim())}><PersonAddIcon fontSize="small" /></IconButton></Tooltip>
                        ) : (
                          <Tooltip title="Unassign"><IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleUnassign(patient.id, `${patient.firstName} ${patient.lastName || ''}`.trim())}><PersonRemoveIcon fontSize="small" /></IconButton></Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {activeList.length === 0 && (
                    <TableRow><TableCell colSpan={viewMode === 'all' ? 8 : 7} sx={{ textAlign: 'center', color: '#9CA3AF', py: 4 }}>
                      {viewMode === 'my' ? 'No patients assigned to you yet.' : 'No patients found.'}
                    </TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Patient Dialog (Create / Edit) */}
      <Dialog open={open} onClose={resetForm} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField fullWidth size="small" label="First Name *" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
            <TextField fullWidth size="small" label="Last Name" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
          </Box>
          <TextField fullWidth size="small" label="Phone *" value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="10-digit number" />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField size="small" label="Age" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value.replace(/\D/g, '').slice(0, 3) }))} sx={{ width: 100 }} />
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Gender</InputLabel>
              <Select value={form.gender} label="Gender" onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                <MenuItem value="M">Male</MenuItem><MenuItem value="F">Female</MenuItem><MenuItem value="O">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Blood</InputLabel>
              <Select value={form.bloodGroup} label="Blood" onChange={e => setForm(p => ({ ...p, bloodGroup: e.target.value }))}>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <TextField fullWidth size="small" label="ABHA ID" value={form.abhaId} onChange={e => setForm(p => ({ ...p, abhaId: e.target.value }))} placeholder="Optional" />
          <TextField fullWidth size="small" label="Known Allergies" value={form.allergy} onChange={e => setForm(p => ({ ...p, allergy: e.target.value }))} placeholder="Optional" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetForm} sx={{ color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.firstName.trim() || !form.phone.trim()}
            sx={{ background: BRAND, '&:hover': { background: '#4410C0' }, fontWeight: 700, textTransform: 'none' }}>
            {editingId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Patient Dialog with Emergency Contacts */}
      <Dialog open={!!viewPatient} onClose={() => setViewPatient(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {viewPatient ? `${viewPatient.firstName} ${viewPatient.lastName || ''}`.trim() : 'Patient Details'}
          <IconButton size="small" onClick={() => setViewPatient(null)}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent>
          {viewPatient && (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
                <Typography variant="body2"><strong>ID:</strong> {viewPatient.patientCode || viewPatient.id}</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {viewPatient.phone || '-'}</Typography>
                <Typography variant="body2"><strong>Gender:</strong> {viewPatient.gender || '-'}</Typography>
                <Typography variant="body2"><strong>Blood Group:</strong> {viewPatient.bloodGroup || '-'}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {viewPatient.email || '-'}</Typography>
                <Typography variant="body2"><strong>Last Visit:</strong> {viewPatient.lastVisit || '-'}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <EmergencyContactsPanel patientId={viewPatient.id} onSnack={setSnack} />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, id: '', name: '' })} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Patient</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action will deactivate the patient record.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteConfirm({ open: false, id: '', name: '' })} sx={{ color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleDeleteConfirm} sx={{ background: '#EF4444', '&:hover': { background: '#DC2626' }, fontWeight: 700, textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSnack('')} sx={{ fontWeight: 600 }}>{snack}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Patients;
