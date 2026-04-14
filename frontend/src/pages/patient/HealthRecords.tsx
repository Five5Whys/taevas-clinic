import { useState } from 'react';
import {
  Box, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Stack, Link, Tooltip, Snackbar
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  DeleteOutline as DeleteOutlineIcon,
  AttachFile as AttachFileIcon,
  PictureAsPdf as PictureAsPdfIcon,
  VideoFile as VideoFileIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  MemoryOutlined as DeviceIcon,
  LightbulbOutlined as BulbIcon,
  Close as CloseIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePatientHealthRecords, useUploadHealthRecord, useDeleteHealthRecord } from '../../hooks/patient';
import { toTitle } from '@/utils/helpers';

type MediaItem = { id: string; fileName: string; fileUrl: string; contentType?: string; fileSize?: number };
type Record = {
  id: string;
  title?: string;
  reportType?: string;
  reportDate?: string;
  doctorName?: string;
  notes?: string;
  status?: string;
  source?: string;
  sourceRefId?: string;
  media?: MediaItem[];
};

const REPORT_TYPES = ['LAB', 'IMAGING', 'PRESCRIPTION', 'DISCHARGE', 'OTHER'];

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const MAX_OTHER_BYTES = 10 * 1024 * 1024;
const VIDEO_EXTS = ['mp4', 'webm', 'mov', 'm4v'];
const isVideoFile = (name: string) => VIDEO_EXTS.includes((name.split('.').pop() || '').toLowerCase());

const uploadTips = (
  <Box sx={{ fontSize: 13, lineHeight: 1.6 }}>
    <Box sx={{ fontWeight: 600, mb: 0.5 }}>Upload Tips</Box>
    <Box>• Formats: PDF, image (JPG/PNG/WEBP), video (MP4/MOV/WEBM), DOC/DOCX</Box>
    <Box>• Max size: <b>10 MB</b> for PDF / image / DOC, <b>50 MB</b> for video</Box>
    <Box>• Only your own uploads can be deleted</Box>
    <Box>• Device-ingested records (e.g. Endoscope, EquiCOG) are read-only</Box>
  </Box>
);

const sourceChip = (source?: string, sourceRefId?: string) => {
  if (source === 'PATIENT_UPLOADED') return <Chip label="My Upload" size="small" color="primary" variant="outlined" />;
  if (source === 'DOCTOR_CREATED') return <Chip label="From Doctor" size="small" color="success" variant="outlined" />;
  if (source === 'EQUIDOR_INGESTED') {
    return <Chip icon={<DeviceIcon sx={{ fontSize: 14 }} />} label={sourceRefId || 'Equidor'} size="small" color="secondary" variant="outlined" />;
  }
  if (source === 'EXTERNAL_API') {
    return <Chip icon={<DeviceIcon sx={{ fontSize: 14 }} />} label={sourceRefId || 'External'} size="small" variant="outlined" />;
  }
  return null;
};

const getMediaIcon = (contentType?: string, fileName?: string) => {
  const type = (contentType || '').toLowerCase();
  const ext = (fileName || '').split('.').pop()?.toLowerCase() || '';
  if (type.startsWith('video/') || ['mp4', 'webm', 'mov', 'm4v'].includes(ext)) {
    return <VideoFileIcon fontSize="small" sx={{ color: '#9c27b0' }} />;
  }
  if (type === 'application/pdf' || ext === 'pdf') {
    return <PictureAsPdfIcon fontSize="small" sx={{ color: '#d32f2f' }} />;
  }
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff', 'heic', 'svg'].includes(ext)) {
    return <ImageIcon fontSize="small" sx={{ color: '#2e7d32' }} />;
  }
  if (['doc', 'docx'].includes(ext)) {
    return <FileIcon fontSize="small" sx={{ color: '#1976d2' }} />;
  }
  return <AttachFileIcon fontSize="small" />;
};

const HealthRecords = () => {
  const { data, isLoading, error } = usePatientHealthRecords();
  const uploadMut = useUploadHealthRecord();
  const deleteMut = useDeleteHealthRecord();
  const records: Record[] = Array.isArray(data) ? data : [];

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState('OTHER');
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({ open: false, msg: '', severity: 'success' });
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const reset = () => { setTitle(''); setReportType('OTHER'); setReportDate(new Date().toISOString().slice(0, 10)); setNotes(''); setFile(null); };

  const submit = async () => {
    if (!title.trim() || !file) { setToast({ open: true, msg: 'Title and file required', severity: 'error' }); return; }
    const video = isVideoFile(file.name);
    const limit = video ? MAX_VIDEO_BYTES : MAX_OTHER_BYTES;
    if (file.size > limit) {
      setToast({ open: true, msg: `File too large. Max ${video ? '50 MB for video' : '10 MB for PDF/image/DOC'}.`, severity: 'error' });
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('reportType', reportType);
    fd.append('reportDate', reportDate);
    fd.append('notes', notes);
    try {
      await uploadMut.mutateAsync(fd);
      setOpen(false); reset();
      setToast({ open: true, msg: 'Record uploaded', severity: 'success' });
    } catch (e: any) {
      setToast({ open: true, msg: e?.response?.data?.message || 'Upload failed', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this record? This cannot be undone.')) return;
    try {
      await deleteMut.mutateAsync(id);
      setToast({ open: true, msg: 'Record deleted', severity: 'success' });
    } catch (e: any) {
      setToast({ open: true, msg: e?.response?.data?.message || 'Delete failed', severity: 'error' });
    }
  };

  return (
    <DashboardLayout pageTitle="Health Records">
      <Box sx={{ px: 3, py: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h5" fontWeight={700}>Health Records</Typography>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Tooltip title={uploadTips} arrow placement="bottom">
              <IconButton
                size="small"
                aria-label="upload tips"
                sx={{
                  color: '#f9a825',
                  bgcolor: 'rgba(249,168,37,0.08)',
                  border: '1px solid rgba(249,168,37,0.35)',
                  '&:hover': { bgcolor: 'rgba(249,168,37,0.15)' },
                }}
              >
                <BulbIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => setOpen(true)}>Upload Record</Button>
          </Stack>
        </Stack>
        {isLoading && <CircularProgress />}
        {error && <Alert severity="error">Failed to load health records</Alert>}
        {!isLoading && !error && records.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }} elevation={0}>
            <Typography color="text.secondary">No health records yet. Click <b>Upload Record</b> to add one.</Typography>
          </Paper>
        )}
        {records.length > 0 && (
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <List disablePadding>
              {records.map((r, idx) => (
                <ListItem
                  key={r.id ?? idx}
                  divider={idx < records.length - 1}
                  alignItems="flex-start"
                  secondaryAction={
                    r.source === 'PATIENT_UPLOADED' ? (
                      <Tooltip title="Delete your upload">
                        <IconButton edge="end" onClick={() => handleDelete(r.id)} disabled={deleteMut.isPending}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null
                  }
                >
                  <ListItemText
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography fontWeight={600}>{r.title ?? 'Report'}</Typography>
                        {r.reportType && <Chip label={toTitle(r.reportType)} size="small" variant="outlined" />}
                        {sourceChip(r.source, r.sourceRefId)}
                      </Stack>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {[r.doctorName, r.reportDate, r.notes].filter(Boolean).join(' · ') || 'No details'}
                        </Typography>
                        {r.media && r.media.length > 0 && (
                          <Stack direction="row" spacing={1} mt={0.8} flexWrap="wrap" alignItems="center">
                            {r.media.map((m) => (
                              <Link
                                key={m.id}
                                component="button"
                                onClick={() => setPreview(m)}
                                underline="hover"
                                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 13, cursor: 'pointer' }}
                              >
                                {getMediaIcon(m.contentType, m.fileName)} {m.fileName}
                              </Link>
                            ))}
                            {r.media.map((m) => {
                              const url = `${window.location.origin}${m.fileUrl}`;
                              return (
                                <Stack key={`share-${m.id}`} direction="row" spacing={0.3}>
                                  <Tooltip title="Share via WhatsApp">
                                    <IconButton size="small" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${r.title || 'Health Record'}: ${url}`)}`, '_blank')} sx={{ color: '#25D366' }}>
                                      <WhatsAppIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Share via Email">
                                    <IconButton size="small" onClick={() => window.open(`mailto:?subject=${encodeURIComponent(r.title || 'Health Record')}&body=${encodeURIComponent(`View my health record: ${url}`)}`, '_self')} sx={{ color: '#1976d2' }}>
                                      <EmailIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              );
                            })}
                          </Stack>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Health Record</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required />
            <TextField select label="Type" value={reportType} onChange={(e) => setReportType(e.target.value)} fullWidth>
              {REPORT_TYPES.map((t) => <MenuItem key={t} value={t}>{toTitle(t)}</MenuItem>)}
            </TextField>
            <TextField label="Report Date" type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline minRows={2} />
            <Box>
              <input
                id="hr-file-input"
                type="file"
                style={{ display: 'none' }}
                accept=".pdf,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.heic,.svg,.doc,.docx,.mp4,.webm,.mov,.m4v"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <Button variant="outlined" startIcon={<AttachFileIcon />} onClick={() => document.getElementById('hr-file-input')?.click()} fullWidth>
                {file ? file.name : 'Choose file (PDF/image/DOC max 10 MB, video max 50 MB)'}
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); reset(); }}>Cancel</Button>
          <Button variant="contained" onClick={submit} disabled={uploadMut.isPending}>
            {uploadMut.isPending ? 'Uploading…' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {preview && getMediaIcon(preview.contentType, preview.fileName)}
            <Typography fontWeight={600}>{preview?.fileName}</Typography>
          </Stack>
          <IconButton onClick={() => setPreview(null)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, bgcolor: '#f5f5f5' }}>
          {preview && (() => {
            const ct = (preview.contentType || '').toLowerCase();
            const ext = (preview.fileName || '').split('.').pop()?.toLowerCase() || '';
            if (ct === 'application/pdf' || ext === 'pdf') {
              return <iframe src={preview.fileUrl} style={{ width: '100%', height: 500, border: 'none' }} title={preview.fileName} />;
            }
            if (ct.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'svg'].includes(ext)) {
              return <img src={preview.fileUrl} alt={preview.fileName} style={{ maxWidth: '100%', maxHeight: 500, objectFit: 'contain' }} />;
            }
            if (ct.startsWith('video/') || ['mp4', 'webm', 'mov', 'm4v'].includes(ext)) {
              return <video src={preview.fileUrl} controls style={{ maxWidth: '100%', maxHeight: 500 }} />;
            }
            return (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography color="text.secondary" mb={2}>Preview not available for this file type</Typography>
                <Button variant="contained" href={preview.fileUrl} target="_blank">Download File</Button>
              </Box>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={3500} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.msg}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
};
export default HealthRecords;
