import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Autocomplete,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  Visibility as VisibilityIcon,
  Draw as DrawIcon,
  Upload as UploadIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  useDoctorProfile,
  useDoctorProfileCompletion,
  useAutoSaveDoctorProfile,
  useUploadFile,
} from '@/hooks/doctor';
import type { DoctorProfileData } from '@/services/doctor';

// ── Constants ────────────────────────────────────────────────────────────────
const BRAND = '#5519E6';
const SUB = '#6B7280';
const BORDER = '#E5E7EB';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_FORMATS = '.pdf,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.heic,.svg,.doc,.docx';
const ACCEPTED_DISPLAY = 'PDF, JPG, PNG, JPEG, WEBP, BMP, TIFF, HEIC, SVG, DOC, DOCX';

const COMMON_QUALIFICATIONS = [
  'MBBS', 'MD', 'MS', 'DM', 'MCh', 'DNB', 'FRCS', 'MRCP', 'PhD',
  'BDS', 'MDS', 'BAMS', 'BHMS', 'MPH', 'MBA (Healthcare)',
];

const COMMON_SPECIALIZATIONS = [
  'General Medicine', 'Cardiology', 'Dermatology', 'ENT', 'Gastroenterology',
  'Neurology', 'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics',
  'Psychiatry', 'Pulmonology', 'Radiology', 'Surgery', 'Urology',
  'Gynecology', 'Endocrinology', 'Nephrology', 'Rheumatology', 'Anesthesiology',
];

const EMPTY_PROFILE: DoctorProfileData = {
  qualifications: [],
  specializations: [],
  experienceYears: null,
  medicalLicenseNumber: '',
  licenseIssuedCountry: '',
  licenseIssuedState: '',
  licenseCertificateUrl: '',
  panCardNumber: '',
  panCardAttachmentUrl: '',
  signatureUrl: '',
  email: '',
  homeAddress: '',
  state: '',
  city: '',
  zipCode: '',
  remarks: '',
};

// ── Props for read-only CA view ──────────────────────────────────────────────
interface DoctorProfileProps {
  readOnly?: boolean;
  doctorId?: string;
}

// ── File Upload Zone ─────────────────────────────────────────────────────────
const FileUploadZone: React.FC<{
  label: React.ReactNode;
  value: string;
  onUpload: (file: File) => void;
  onClear: () => void;
  uploading?: boolean;
  readOnly?: boolean;
  accept?: string;
}> = ({ label, value, onUpload, onClear, uploading, readOnly, accept }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert('File exceeds 10 MB limit.');
      return;
    }
    onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (readOnly) return;
    handleFile(e.dataTransfer.files[0]);
  };

  const isImage = value && /\.(jpg|jpeg|png|webp|bmp|svg)$/i.test(value);

  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
        {label}
      </Typography>
      {value ? (
        <Box
          sx={{
            border: `1.5px solid ${BORDER}`,
            borderRadius: '8px',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            background: '#F8F9FA',
          }}
        >
          {isImage && (
            <Box
              component="img"
              src={value}
              alt={typeof label === 'string' ? label : 'file preview'}
              sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '6px', border: `1px solid ${BORDER}` }}
            />
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontSize: '11px', color: BRAND, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value.split('/').pop()}
            </Typography>
            <Typography variant="caption" sx={{ color: SUB, fontSize: '10px' }}>Uploaded</Typography>
          </Box>
          {!readOnly && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Preview" arrow>
                <IconButton size="small" onClick={() => window.open(value, '_blank')} sx={{ color: SUB }}>
                  <VisibilityIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove" arrow>
                <IconButton size="small" onClick={onClear} sx={{ color: '#EF4444' }}>
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          {readOnly && (
            <Tooltip title="Preview" arrow>
              <IconButton size="small" onClick={() => window.open(value, '_blank')} sx={{ color: SUB }}>
                <VisibilityIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ) : readOnly ? (
        <Box sx={{ border: `1.5px dashed ${BORDER}`, borderRadius: '8px', p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: SUB, fontSize: '12px' }}>Not uploaded</Typography>
        </Box>
      ) : (
        <Box
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          sx={{
            border: `1.5px dashed ${dragOver ? BRAND : BORDER}`,
            borderRadius: '8px',
            p: 2.5,
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? `${BRAND}06` : '#FAFAFA',
            transition: 'all 0.2s',
            '&:hover': { borderColor: BRAND, background: `${BRAND}06` },
          }}
        >
          {uploading ? (
            <CircularProgress size={20} sx={{ color: BRAND }} />
          ) : (
            <>
              <CloudUploadIcon sx={{ fontSize: 28, color: SUB, mb: 0.5 }} />
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                Drag & drop or click to upload
              </Typography>
              <Typography variant="caption" sx={{ color: SUB, fontSize: '10px', display: 'block', mt: 0.25 }}>
                Max 10 MB  |  {ACCEPTED_DISPLAY}
              </Typography>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept || ACCEPTED_FORMATS}
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </Box>
      )}
    </Box>
  );
};

// ── Signature Pad (Draw + Upload) ────────────────────────────────────────────
const SignaturePad: React.FC<{
  value: string;
  onChange: (dataUrl: string) => void;
  onUpload: (file: File) => void;
  uploading?: boolean;
  readOnly?: boolean;
}> = ({ value, onChange, onUpload, uploading, readOnly }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const [drawing, setDrawing] = useState(false);

  const getCtx = () => canvasRef.current?.getContext('2d') ?? null;

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly) return;
    setDrawing(true);
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || readOnly) return;
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDraw = () => {
    if (!drawing) return;
    setDrawing(false);
    if (canvasRef.current) {
      onChange(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const ctx = getCtx();
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    onChange('');
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { alert('File exceeds 10 MB limit.'); return; }
    onUpload(file);
  };

  // Preview for existing signature
  if (value && !value.startsWith('data:') && readOnly) {
    return (
      <Box sx={{ textAlign: 'center', p: 2, background: '#F8F9FA', borderRadius: '8px' }}>
        <Typography variant="caption" sx={{ color: SUB, fontSize: '10px', display: 'block', mb: 0.5 }}>Signature Preview</Typography>
        <Box component="img" src={value} alt="Signature" sx={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain' }} />
      </Box>
    );
  }

  return (
    <Box>
      {!readOnly && (
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <Button
            size="small"
            variant={mode === 'draw' ? 'contained' : 'outlined'}
            startIcon={<DrawIcon />}
            onClick={() => setMode('draw')}
            sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '12px', ...(mode === 'draw' ? { background: BRAND } : { color: BRAND, borderColor: BRAND }) }}
          >
            Draw
          </Button>
          <Button
            size="small"
            variant={mode === 'upload' ? 'contained' : 'outlined'}
            startIcon={<UploadIcon />}
            onClick={() => setMode('upload')}
            sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '12px', ...(mode === 'upload' ? { background: BRAND } : { color: BRAND, borderColor: BRAND }) }}
          >
            Upload
          </Button>
        </Box>
      )}

      {mode === 'draw' ? (
        <Box>
          <Box
            sx={{
              border: `1.5px dashed ${BORDER}`,
              borderRadius: '8px',
              background: '#FAFAFA',
              position: 'relative',
              cursor: readOnly ? 'default' : 'crosshair',
            }}
          >
            <canvas
              ref={canvasRef}
              width={500}
              height={150}
              style={{ width: '100%', height: 150, display: 'block', borderRadius: '8px', touchAction: 'none' }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
          </Box>
          {!readOnly && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
              <Button size="small" onClick={clearCanvas} sx={{ textTransform: 'none', fontSize: '11px', color: '#EF4444' }}>
                Clear
              </Button>
            </Box>
          )}
          {value && value.startsWith('data:') && (
            <Box sx={{ mt: 1, p: 1.5, background: '#F8F9FA', borderRadius: '8px', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: SUB, fontSize: '10px', display: 'block', mb: 0.5 }}>Signature Preview</Typography>
              <Box component="img" src={value} alt="Signature" sx={{ maxHeight: 60, maxWidth: '100%', objectFit: 'contain' }} />
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <FileUploadZone
            label="Upload Signature Image"
            value={value && !value.startsWith('data:') ? value : ''}
            onUpload={(file) => handleFile(file)}
            onClear={() => onChange('')}
            uploading={uploading}
            readOnly={readOnly}
            accept=".png,.jpg,.jpeg,.svg,.webp"
          />
          <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg,.svg,.webp" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
        </Box>
      )}
    </Box>
  );
};

// ── Required asterisk ────────────────────────────────────────────────────────
const Req: React.FC = () => <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>;

// ── Main Profile Component ───────────────────────────────────────────────────
const DoctorProfile: React.FC<DoctorProfileProps> = ({ readOnly = false }) => {
  const { data: profileData, isLoading, isError } = useDoctorProfile();
  const { data: completionData } = useDoctorProfileCompletion();
  const { trigger: autoSave, status: saveStatus } = useAutoSaveDoctorProfile();
  const uploadFile = useUploadFile();

  const [form, setForm] = useState<DoctorProfileData>(EMPTY_PROFILE);
  const [initialized, setInitialized] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>('professional');
  const [showSaved, setShowSaved] = useState(false);
  const [saveKey, setSaveKey] = useState(0);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Populate form from server data
  useEffect(() => {
    if (profileData && !initialized) {
      setForm({
        ...EMPTY_PROFILE,
        ...profileData,
        qualifications: profileData.qualifications ?? [],
        specializations: profileData.specializations ?? [],
      });
      setInitialized(true);
    }
    // If API returned empty/404, still mark initialized so form is usable
    if (!isLoading && !profileData && !initialized) {
      setInitialized(true);
    }
  }, [profileData, isLoading, initialized]);

  // Auto-save when form changes (skip first render / readOnly)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!readOnly && initialized) {
      autoSave(form);
    }
  }, [form, readOnly, initialized]); // eslint-disable-line react-hooks/exhaustive-deps

  // Flash "Saved ✓" fresh on each save, auto-hide after 2s
  useEffect(() => {
    if (saveStatus === 'saved') {
      setSaveKey((k) => k + 1);
      setShowSaved(true);
      clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setShowSaved(false), 2000);
    } else if (saveStatus === 'saving') {
      setShowSaved(true);
      clearTimeout(savedTimerRef.current);
    } else {
      setShowSaved(false);
    }
    return () => clearTimeout(savedTimerRef.current);
  }, [saveStatus]);

  // Field updater
  const updateField = useCallback(
    <K extends keyof DoctorProfileData>(field: K, value: DoctorProfileData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // File upload handler
  const handleFileUpload = useCallback(
    (field: keyof DoctorProfileData, type: string) => (file: File) => {
      setUploadingField(field);
      uploadFile.mutate(
        { file, type },
        {
          onSuccess: (url: string) => {
            setForm((prev) => ({ ...prev, [field]: url }));
            setUploadingField(null);
          },
          onError: () => {
            setAlertMsg('File upload failed. Please try again.');
            setUploadingField(null);
          },
        },
      );
    },
    [uploadFile],
  );

  // Derive status
  const profileStatus = completionData?.status ?? (profileData?.status || 'DRAFT');
  const completionPct = completionData?.percentage ?? 0;

  // Status badge
  const StatusBadge: React.FC = () => (
    <Chip
      label={profileStatus}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: '10px',
        height: 22,
        background: profileStatus === 'COMPLETE' ? '#CDDC5020' : '#FF823220',
        color: profileStatus === 'COMPLETE' ? '#6B7A00' : '#B85600',
      }}
    />
  );

  // Save status indicator
  const SaveIndicator: React.FC = () => {
    if (readOnly || !showSaved) return null;
    return (
      <Typography
        variant="caption"
        sx={{
          fontSize: '11px',
          fontWeight: 600,
          color:
            saveStatus === 'saving' ? '#FF8232'
            : saveStatus === 'saved' ? '#6B7A00'
            : saveStatus === 'error' ? '#EF4444'
            : SUB,
        }}
      >
        {saveStatus === 'saving' && 'Saving...'}
        {saveStatus === 'saved' && (
          <Box
            key={saveKey}
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.3,
              animation: 'fadeInSaved 0.3s ease-in',
              '@keyframes fadeInSaved': {
                from: { opacity: 0, transform: 'translateY(-2px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 13 }} /> Saved
          </Box>
        )}
        {saveStatus === 'error' && 'Save failed'}
      </Typography>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="My Profile">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
          <CircularProgress sx={{ color: BRAND }} />
        </Box>
      </DashboardLayout>
    );
  }

  const content = (
    <Box sx={{ px: 3, py: 2.5, maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {readOnly ? 'Doctor Profile' : 'My Professional Profile'}
            </Typography>
            <StatusBadge />
          </Box>
          <Typography variant="body2" sx={{ color: SUB, mt: 0.25 }}>
            {completionPct > 0 ? `${completionPct}% complete` : 'Fill in your professional details'}
            {completionData?.missingMandatory && completionData.missingMandatory.length > 0 && (
              <span style={{ color: '#EF4444', marginLeft: 8, fontSize: '11px' }}>
                {completionData.missingMandatory.length} mandatory field(s) remaining
              </span>
            )}
          </Typography>
        </Box>
        <SaveIndicator />
      </Box>

      {/* Completion Banner */}
      {!readOnly && completionData?.missingOptional && completionData.missingOptional.length > 0 && profileStatus !== 'COMPLETE' && (
        <Paper
          elevation={0}
          sx={{
            background: '#FFF8E1',
            border: '1px solid #FFE082',
            borderRadius: '8px',
            px: 2,
            py: 1.25,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '12px', color: '#B85600', fontWeight: 600 }}>
            Complete your profile for a better experience. Missing: {completionData.missingOptional.join(', ')}
          </Typography>
        </Paper>
      )}

      {isError && (
        <Paper
          elevation={0}
          sx={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            px: 2,
            py: 1.25,
            mb: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '12px', color: '#991B1B', fontWeight: 600 }}>
            Could not load profile data. You can still fill out the form below.
          </Typography>
        </Paper>
      )}

      {/* ─── 1. Professional Details ─── */}
      <Accordion expanded={expanded === 'professional'} onChange={(_, isExp) => setExpanded(isExp ? 'professional' : false)} disableGutters elevation={0} sx={{ border: `1px solid ${BORDER}`, borderRadius: '8px !important', mb: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: BRAND }} />} sx={{ px: 2.5, '& .MuiAccordionSummary-content': { my: 1.5 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Professional Details</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
              Qualifications<Req />
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              options={COMMON_QUALIFICATIONS}
              value={form.qualifications}
              onChange={(_, val) => updateField('qualifications', val as string[])}
              readOnly={readOnly}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...rest } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option}
                      size="small"
                      {...rest}
                      sx={{ fontWeight: 600, fontSize: '11px', height: 24, background: `${BRAND}12`, color: BRAND }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder={form.qualifications.length === 0 ? 'Type or select qualifications...' : ''}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              )}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
              Specializations<Req />
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              options={COMMON_SPECIALIZATIONS}
              value={form.specializations}
              onChange={(_, val) => updateField('specializations', val as string[])}
              readOnly={readOnly}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...rest } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option}
                      size="small"
                      {...rest}
                      sx={{ fontWeight: 600, fontSize: '11px', height: 24, background: '#A046F012', color: '#A046F0' }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder={form.specializations.length === 0 ? 'Type or select specializations...' : ''}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              )}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
              Experience (years)<Req />
            </Typography>
            <TextField
              type="number"
              size="small"
              fullWidth
              value={form.experienceYears ?? ''}
              onChange={(e) => updateField('experienceYears', e.target.value ? Number(e.target.value) : null)}
              placeholder="e.g. 10"
              inputProps={{ min: 0, max: 70 }}
              InputProps={{ readOnly }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, maxWidth: 200 }}
            />
          </Box>

          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px', color: BRAND, mt: 1, borderTop: `1px solid ${BORDER}`, pt: 2 }}>
            Medical License
          </Typography>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
              License Number
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={form.medicalLicenseNumber}
              onChange={(e) => updateField('medicalLicenseNumber', e.target.value)}
              placeholder="e.g. KMC/2021/12345"
              InputProps={{ readOnly }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
                Issued Country
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={form.licenseIssuedCountry}
                onChange={(e) => updateField('licenseIssuedCountry', e.target.value)}
                placeholder="e.g. India"
                InputProps={{ readOnly }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
                Issued State
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={form.licenseIssuedState}
                onChange={(e) => updateField('licenseIssuedState', e.target.value)}
                placeholder="e.g. Karnataka"
                InputProps={{ readOnly }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
          </Box>
          <FileUploadZone
            label="License Certificate"
            value={form.licenseCertificateUrl}
            onUpload={handleFileUpload('licenseCertificateUrl', 'LICENSE_CERTIFICATE')}
            onClear={() => updateField('licenseCertificateUrl', '')}
            uploading={uploadingField === 'licenseCertificateUrl'}
            readOnly={readOnly}
          />
        </Box>
        </AccordionDetails>
      </Accordion>

      {/* ─── 2. Verification & Signature ─── */}
      <Accordion expanded={expanded === 'verification'} onChange={(_, isExp) => setExpanded(isExp ? 'verification' : false)} disableGutters elevation={0} sx={{ border: `1px solid ${BORDER}`, borderRadius: '8px !important', mb: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: BRAND }} />} sx={{ px: 2.5, '& .MuiAccordionSummary-content': { my: 1.5 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Verification & Signature</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
              Permanent Account Number (PAN)
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={form.panCardNumber}
              onChange={(e) => updateField('panCardNumber', e.target.value.toUpperCase())}
              placeholder="10 characters, e.g. ABCDE1234F"
              inputProps={{ maxLength: 10 }}
              InputProps={{ readOnly }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, maxWidth: 280 }}
            />
          </Box>
          <FileUploadZone
            label="PAN Card Attachment"
            value={form.panCardAttachmentUrl}
            onUpload={handleFileUpload('panCardAttachmentUrl', 'PAN_CARD')}
            onClear={() => updateField('panCardAttachmentUrl', '')}
            uploading={uploadingField === 'panCardAttachmentUrl'}
            readOnly={readOnly}
          />

          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px', color: BRAND, mt: 1, borderTop: `1px solid ${BORDER}`, pt: 2 }}>
            Digital Signature
          </Typography>
          <SignaturePad
            value={form.signatureUrl}
            onChange={(url) => updateField('signatureUrl', url)}
            onUpload={handleFileUpload('signatureUrl', 'SIGNATURE')}
            uploading={uploadingField === 'signatureUrl'}
            readOnly={readOnly}
          />
        </Box>
        </AccordionDetails>
      </Accordion>

      {/* ─── 3. Contact & Address ─── */}
      <Accordion expanded={expanded === 'contact'} onChange={(_, isExp) => setExpanded(isExp ? 'contact' : false)} disableGutters elevation={0} sx={{ border: `1px solid ${BORDER}`, borderRadius: '8px !important', mb: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: BRAND }} />} sx={{ px: 2.5, '& .MuiAccordionSummary-content': { my: 1.5 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Contact & Address</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
              Email Address <span style={{ color: SUB, fontWeight: 400 }}>(optional)</span>
            </Typography>
            <TextField
              size="small"
              fullWidth
              type="email"
              value={form.email ?? ''}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="e.g. doctor@example.com"
              InputProps={{ readOnly }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, maxWidth: 400 }}
            />
          </Box>

          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px', color: BRAND, mt: 1, borderTop: `1px solid ${BORDER}`, pt: 2 }}>
            Address
          </Typography>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
              Home Address
            </Typography>
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={2}
              value={form.homeAddress}
              onChange={(e) => updateField('homeAddress', e.target.value)}
              placeholder="Street address, area, landmark"
              InputProps={{ readOnly }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
                City
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="e.g. Bangalore"
                InputProps={{ readOnly }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
                State
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={form.state}
                onChange={(e) => updateField('state', e.target.value)}
                placeholder="e.g. Karnataka"
                InputProps={{ readOnly }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', mb: 0.5, color: '#374151' }}>
                ZIP Code
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={form.zipCode}
                onChange={(e) => updateField('zipCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="e.g. 560001"
                InputProps={{ readOnly }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
          </Box>

          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px', color: BRAND, mt: 1, borderTop: `1px solid ${BORDER}`, pt: 2 }}>
            Remarks
          </Typography>
          <TextField
            size="small"
            fullWidth
            multiline
            minRows={3}
            value={form.remarks}
            onChange={(e) => updateField('remarks', e.target.value)}
            placeholder="Any additional notes or remarks..."
            InputProps={{ readOnly }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Box>
        </AccordionDetails>
      </Accordion>

      {/* Bottom spacer for mobile nav */}
      <Box sx={{ height: 16 }} />

      {/* Snackbar */}
      <Snackbar open={!!alertMsg} autoHideDuration={4000} onClose={() => setAlertMsg('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setAlertMsg('')} sx={{ fontWeight: 600 }}>{alertMsg}</Alert>
      </Snackbar>
    </Box>
  );

  return (
    <DashboardLayout pageTitle={readOnly ? 'Doctor Profile' : 'My Profile'}>
      {content}
    </DashboardLayout>
  );
};

export default DoctorProfile;
