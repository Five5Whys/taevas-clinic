import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Switch,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCountries } from '@/hooks/superadmin/useCountries';
import { useFields, useAddField, useUpdateField, useDeleteField, useToggleFieldLock } from '@/hooks/superadmin/useFields';
import type { FieldDefinitionDto, CountryConfig } from '@/types/superadmin';

// ---- Types ------------------------------------------------------------------
interface FieldRow {
  id: string;
  label: string;
  meta: string;
  type: string;
  locked: boolean;
  required: boolean;
  scope: string;
  countryIcon?: string;
}

// ---- Mock fallback data -----------------------------------------------------
const INTAKE_FIELDS: Record<string, FieldRow[]> = {
  india: [
    { id: 'fullName',  label: 'Full Name',   meta: 'Global - Required - Locked',    type: 'text',     locked: true, required: true, scope: 'GLOBAL' },
    { id: 'dob',       label: 'Date of Birth', meta: 'Global - Required - Locked', type: 'date',     locked: true, required: true, scope: 'GLOBAL' },
    { id: 'gender',    label: 'Gender',       meta: 'Global - Required - Locked',  type: 'select',   locked: true, required: true, scope: 'GLOBAL' },
    { id: 'phone',     label: 'Phone Number', meta: 'Global - Required - Locked',  type: 'tel',      locked: true, required: true, scope: 'GLOBAL' },
    { id: 'abhaId',    label: 'ABHA ID',      meta: 'India - ABDM Required - Locked', type: 'text', locked: true, required: true, scope: 'COUNTRY', countryIcon: '\u{1F1EE}\u{1F1F3}' },
    { id: 'bloodGroup',label: 'Blood Group',  meta: 'Global - Optional',           type: 'select',   locked: false, required: false, scope: 'GLOBAL' },
    { id: 'referredBy',label: 'Referred By',  meta: 'Global - Optional',           type: 'text',     locked: false, required: false, scope: 'GLOBAL' },
  ],
  thailand: [
    { id: 'fullName',  label: 'Full Name',    meta: 'Global - Required - Locked',  type: 'text',     locked: true, required: true, scope: 'GLOBAL' },
    { id: 'dob',       label: 'Date of Birth', meta: 'Global - Required - Locked', type: 'date',     locked: true, required: true, scope: 'GLOBAL' },
    { id: 'gender',    label: 'Gender',        meta: 'Global - Required - Locked', type: 'select',   locked: true, required: true, scope: 'GLOBAL' },
    { id: 'phone',     label: 'Phone Number',  meta: 'Global - Required - Locked', type: 'tel',      locked: true, required: true, scope: 'GLOBAL' },
    { id: 'nhsoId',    label: 'NHSO ID',       meta: 'Thailand - NHSO Required - Locked', type: 'text', locked: true, required: true, scope: 'COUNTRY', countryIcon: '\u{1F1F9}\u{1F1ED}' },
    { id: 'bloodGroup',label: 'Blood Group',   meta: 'Global - Optional',          type: 'select',   locked: false, required: false, scope: 'GLOBAL' },
  ],
  maldives: [
    { id: 'fullName',  label: 'Full Name',    meta: 'Global - Required - Locked',  type: 'text',     locked: true, required: true, scope: 'GLOBAL' },
    { id: 'dob',       label: 'Date of Birth', meta: 'Global - Required - Locked', type: 'date',     locked: true, required: true, scope: 'GLOBAL' },
    { id: 'gender',    label: 'Gender',        meta: 'Global - Required - Locked', type: 'select',   locked: true, required: true, scope: 'GLOBAL' },
    { id: 'phone',     label: 'Phone Number',  meta: 'Global - Required - Locked', type: 'tel',      locked: true, required: true, scope: 'GLOBAL' },
    { id: 'mohId',     label: 'MOH ID',        meta: 'Maldives - MOH Required - Locked', type: 'text', locked: true, required: true, scope: 'COUNTRY', countryIcon: '\u{1F1F2}\u{1F1FB}' },
  ],
};

const SOAP_FIELDS: FieldRow[] = [
  { id: 'cc',    label: 'Chief Complaint',           meta: 'All countries - Required',        type: 'textarea',   locked: true, required: true, scope: 'GLOBAL' },
  { id: 'hpi',   label: 'History of Presenting Illness', meta: 'All countries - Required',   type: 'textarea', locked: true, required: true, scope: 'GLOBAL' },
  { id: 'ent',   label: 'ENT Exam',                  meta: 'All countries - Required',        type: 'textarea',   locked: true, required: true, scope: 'GLOBAL' },
  { id: 'abha',  label: 'ABHA Verification Status',  meta: 'India only - Optional',           type: 'text',       locked: false, required: false, scope: 'GLOBAL', countryIcon: '\u{1F1EE}\u{1F1F3}' },
  { id: 'icd10', label: 'ICD-10 Code',               meta: 'All countries - Optional',        type: 'text', locked: false, required: false, scope: 'GLOBAL' },
];

// Fallback countries
const FALLBACK_COUNTRIES: Pick<CountryConfig, 'id' | 'name' | 'flagEmoji'>[] = [
  { id: 'india', name: 'India', flagEmoji: '\u{1F1EE}\u{1F1F3}' },
  { id: 'thailand', name: 'Thailand', flagEmoji: '\u{1F1F9}\u{1F1ED}' },
  { id: 'maldives', name: 'Maldives', flagEmoji: '\u{1F1F2}\u{1F1FB}' },
];

// ---- Helpers ----------------------------------------------------------------

/** Resolve country name from id for display */
const resolveCountryName = (
  countryId: string | null | undefined,
  countriesMap: Record<string, { name: string; flag: string }>
): string | null => {
  if (!countryId) return null;
  return countriesMap[countryId]?.name ?? countryId;
};

/** Build a human-readable meta string from a FieldDefinitionDto */
const buildMeta = (
  dto: FieldDefinitionDto,
  countriesMap: Record<string, { name: string; flag: string }>
): string => {
  const parts: string[] = [];
  if (dto.scope === 'GLOBAL' || dto.scope === 'global') {
    parts.push('Global');
  } else {
    const cName = resolveCountryName(dto.countryId, countriesMap);
    parts.push(cName ?? dto.scope);
  }
  parts.push(dto.required ? 'Required' : 'Optional');
  if (dto.locked) parts.push('Locked');
  return parts.join(' \u00b7 ');
};

/** Map a FieldDefinitionDto to the display FieldRow */
const mapDtoToFieldRow = (
  dto: FieldDefinitionDto,
  countriesMap: Record<string, { name: string; flag: string }>
): FieldRow => ({
  id: dto.id,
  label: dto.label,
  type: dto.fieldType,
  locked: dto.locked,
  required: dto.required,
  scope: dto.scope,
  meta: buildMeta(dto, countriesMap),
  countryIcon: dto.countryId ? (countriesMap[dto.countryId]?.flag ?? undefined) : undefined,
});

// ---- Field Row Component (SA Full Authority) --------------------------------
const FieldItem: React.FC<{
  field: FieldRow;
  onEdit: (id: string) => void;
  onToggleLock: (id: string) => void;
  onRemove: (id: string) => void;
  removing?: boolean;
  toggling?: boolean;
}> = ({ field, onEdit, onToggleLock, onRemove, removing, toggling }) => (
  <Box
    sx={{
      display: 'flex', alignItems: 'center', gap: 1,
      px: 1.5, py: 1,
      border: '1px solid', borderColor: field.locked ? '#E5E7EB' : '#5519E615',
      borderRadius: 1.5, mb: 0.75,
      background: field.locked ? '#FAFAFB' : '#fff',
      '&:hover': { background: field.locked ? '#F5F5F6' : '#FAFAFF', borderColor: '#5519E630' },
      transition: 'all 0.15s',
    }}
  >
    {/* Drag handle */}
    <Typography sx={{ fontSize: '14px', color: '#9CA3AF', cursor: 'grab', flexShrink: 0, userSelect: 'none' }}>&#x2807;&#x2807;</Typography>

    {/* Lock toggle — SA can click to lock/unlock */}
    <Tooltip title={field.locked ? 'Locked for Clinic Admins — click to unlock' : 'Unlocked — click to lock for lower roles'} arrow>
      <IconButton
        size="small"
        onClick={() => onToggleLock(field.id)}
        disabled={toggling}
        sx={{
          width: 28, height: 28, flexShrink: 0,
          color: field.locked ? '#F59E0B' : '#9CA3AF',
          background: field.locked ? '#FEF3C7' : '#F9FAFB',
          border: '1px solid',
          borderColor: field.locked ? '#FCD34D' : '#E5E7EB',
          borderRadius: 1,
          fontSize: '14px',
          '&:hover': {
            background: field.locked ? '#FDE68A' : '#F3F4F6',
          },
        }}
      >
        {toggling ? <CircularProgress size={12} /> : (field.locked ? '\u{1F512}' : '\u{1F513}')}
      </IconButton>
    </Tooltip>

    {/* Label + meta */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12.5px' }}>
          {field.label}
        </Typography>
        {field.countryIcon && (
          <Typography sx={{ fontSize: '13px', lineHeight: 1 }}>{field.countryIcon}</Typography>
        )}
        {field.required && (
          <Box sx={{
            fontSize: '9px', fontWeight: 800, color: '#DC2626', background: '#FEE2E2',
            px: 0.5, py: 0.1, borderRadius: 0.5, lineHeight: '14px',
          }}>
            REQ
          </Box>
        )}
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10.5px' }}>
        {field.meta}
      </Typography>
    </Box>

    {/* Type chip */}
    <Chip
      label={field.type}
      size="small"
      sx={{
        background: '#F3F4F6', color: '#374151',
        fontWeight: 600, fontSize: '10px', height: 20, flexShrink: 0,
        fontFamily: 'monospace',
      }}
    />

    {/* SA Actions: Edit + Remove (always available) */}
    <Button
      size="small"
      onClick={() => onEdit(field.id)}
      sx={{
        minWidth: 0, px: 1, py: 0.25, fontSize: '10px', fontWeight: 700,
        color: '#5519E6', background: '#5519E610', border: '1px solid #5519E630',
        borderRadius: 1, flexShrink: 0,
        '&:hover': { background: '#5519E620' },
      }}
    >
      Edit
    </Button>
    <Button
      size="small"
      disabled={removing}
      onClick={() => onRemove(field.id)}
      sx={{
        minWidth: 0, px: 1, py: 0.25, fontSize: '10px', fontWeight: 700,
        color: '#F43F5E', background: '#FFF1F2', border: '1px solid #FCA5A5',
        borderRadius: 1, flexShrink: 0,
        '&:hover': { background: '#FFE4E6' },
      }}
    >
      {removing ? <CircularProgress size={12} /> : '\u00d7'}
    </Button>
  </Box>
);

// ---- Section Header ---------------------------------------------------------
const SectionHeader: React.FC<{
  title: string;
  count: number;
  showCountrySelect?: boolean;
  country?: string;
  onCountryChange?: (v: string) => void;
  countries?: Array<Pick<CountryConfig, 'id' | 'name' | 'flagEmoji'>>;
  onAddField: () => void;
}> = ({ title, count, showCountrySelect, country, onCountryChange, countries: countryList, onAddField }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '13.5px' }}>{title}</Typography>
      <Chip label={count} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 700, background: '#5519E610', color: '#5519E6' }} />
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {showCountrySelect && countryList && (
        <Select
          value={country}
          onChange={(e) => onCountryChange?.(e.target.value)}
          size="small"
          sx={{ fontSize: '12px', height: 28, minWidth: 130 }}
        >
          {countryList.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.flagEmoji ?? ''} {c.name}
            </MenuItem>
          ))}
        </Select>
      )}
      <Button
        size="small"
        variant="contained"
        sx={{
          background: '#5519E6', '&:hover': { background: '#4410C0' },
          fontWeight: 700, fontSize: '11px', height: 28, px: 1.5,
        }}
        onClick={onAddField}
      >
        + Add Field
      </Button>
    </Box>
  </Box>
);

// ---- Add Field Dialog -------------------------------------------------------
const FIELD_TYPES = ['text', 'date', 'select', 'tel', 'textarea', 'number', 'email'];

const AddFieldDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  section: string;
  countryId?: string;
  countries: Array<Pick<CountryConfig, 'id' | 'name' | 'flagEmoji'>>;
}> = ({ open, onClose, section, countryId, countries }) => {
  const addField = useAddField();
  const [label, setLabel] = useState('');
  const [fieldKey, setFieldKey] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [scope, setScope] = useState<'GLOBAL' | 'COUNTRY'>('GLOBAL');
  const [scopeCountryId, setScopeCountryId] = useState(countryId ?? '');
  const [required, setRequired] = useState(false);
  const [locked, setLocked] = useState(false);

  // Auto-generate fieldKey from label
  const handleLabelChange = (val: string) => {
    setLabel(val);
    setFieldKey(val.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''));
  };

  const handleSubmit = () => {
    if (!label.trim() || !fieldKey.trim()) return;
    addField.mutate(
      {
        label,
        fieldKey,
        fieldType,
        section,
        scope,
        countryId: scope === 'COUNTRY' ? scopeCountryId : null,
        locked,
        required,
        removable: true,
      },
      {
        onSuccess: () => {
          setLabel('');
          setFieldKey('');
          setFieldType('text');
          setScope('GLOBAL');
          setRequired(false);
          setLocked(false);
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '16px' }}>Add Field — {section === 'registration' ? 'Patient Intake' : 'SOAP Note'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        <TextField
          label="Field Label"
          size="small"
          fullWidth
          value={label}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="e.g. Emergency Contact"
        />
        <TextField
          label="Field Key"
          size="small"
          fullWidth
          value={fieldKey}
          onChange={(e) => setFieldKey(e.target.value)}
          helperText="Auto-generated from label. Must be unique."
          sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
        />
        <FormControl fullWidth size="small">
          <InputLabel>Field Type</InputLabel>
          <Select value={fieldType} label="Field Type" onChange={(e) => setFieldType(e.target.value)}>
            {FIELD_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel>Scope</InputLabel>
          <Select value={scope} label="Scope" onChange={(e) => setScope(e.target.value as 'GLOBAL' | 'COUNTRY')}>
            <MenuItem value="GLOBAL">Global (all countries)</MenuItem>
            <MenuItem value="COUNTRY">Country-specific</MenuItem>
          </Select>
        </FormControl>
        {scope === 'COUNTRY' && (
          <FormControl fullWidth size="small">
            <InputLabel>Country</InputLabel>
            <Select value={scopeCountryId} label="Country" onChange={(e) => setScopeCountryId(e.target.value)}>
              {countries.map((c) => <MenuItem key={c.id} value={c.id}>{c.flagEmoji} {c.name}</MenuItem>)}
            </Select>
          </FormControl>
        )}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <FormControlLabel
            control={<Checkbox checked={required} onChange={(e) => setRequired(e.target.checked)} size="small" sx={{ '&.Mui-checked': { color: '#5519E6' } }} />}
            label={<Typography sx={{ fontSize: '13px' }}>Required</Typography>}
          />
          <FormControlLabel
            control={<Checkbox checked={locked} onChange={(e) => setLocked(e.target.checked)} size="small" sx={{ '&.Mui-checked': { color: '#F59E0B' } }} />}
            label={<Typography sx={{ fontSize: '13px' }}>Lock for lower roles</Typography>}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280', fontWeight: 600 }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!label.trim() || !fieldKey.trim() || addField.isPending}
          onClick={handleSubmit}
          sx={{ background: '#5519E6', '&:hover': { background: '#4410C0' }, fontWeight: 700 }}
        >
          {addField.isPending ? 'Adding...' : 'Add Field'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ---- Edit Field Dialog (SA Full Authority) ----------------------------------
const EditFieldDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  field: FieldDefinitionDto | null;
  countries: Array<Pick<CountryConfig, 'id' | 'name' | 'flagEmoji'>>;
}> = ({ open, onClose, field, countries }) => {
  const updateField = useUpdateField();
  const [label, setLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [required, setRequired] = useState(false);
  const [locked, setLocked] = useState(false);
  const [scope, setScope] = useState<'GLOBAL' | 'COUNTRY'>('GLOBAL');
  const [scopeCountryId, setScopeCountryId] = useState('');

  React.useEffect(() => {
    if (field) {
      setLabel(field.label);
      setFieldType(field.fieldType);
      setRequired(field.required);
      setLocked(field.locked);
      setScope(field.scope === 'COUNTRY' ? 'COUNTRY' : 'GLOBAL');
      setScopeCountryId(field.countryId ?? '');
    }
  }, [field]);

  const handleSave = () => {
    if (!field || !label.trim()) return;
    updateField.mutate(
      {
        id: field.id,
        data: {
          label,
          fieldType,
          required,
          locked,
          scope,
          countryId: scope === 'COUNTRY' ? scopeCountryId : null,
        },
      },
      { onSuccess: () => onClose() }
    );
  };

  if (!field) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
        Edit Field
        <Chip
          label={field.locked ? 'LOCKED' : 'UNLOCKED'}
          size="small"
          sx={{
            height: 20, fontSize: '9px', fontWeight: 800,
            background: field.locked ? '#FEF3C7' : '#ECFDF5',
            color: field.locked ? '#92400E' : '#065F46',
            border: '1px solid',
            borderColor: field.locked ? '#FCD34D' : '#6EE7B7',
          }}
        />
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        <TextField
          label="Field Label"
          size="small"
          fullWidth
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <TextField
          label="Field Key"
          size="small"
          fullWidth
          value={field.fieldKey}
          disabled
          sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
          helperText="Field key is immutable after creation"
        />
        <FormControl fullWidth size="small">
          <InputLabel>Field Type</InputLabel>
          <Select value={fieldType} label="Field Type" onChange={(e) => setFieldType(e.target.value)}>
            {FIELD_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel>Scope</InputLabel>
          <Select value={scope} label="Scope" onChange={(e) => setScope(e.target.value as 'GLOBAL' | 'COUNTRY')}>
            <MenuItem value="GLOBAL">Global (all countries)</MenuItem>
            <MenuItem value="COUNTRY">Country-specific</MenuItem>
          </Select>
        </FormControl>
        {scope === 'COUNTRY' && (
          <FormControl fullWidth size="small">
            <InputLabel>Country</InputLabel>
            <Select value={scopeCountryId} label="Country" onChange={(e) => setScopeCountryId(e.target.value)}>
              {countries.map((c) => <MenuItem key={c.id} value={c.id}>{c.flagEmoji} {c.name}</MenuItem>)}
            </Select>
          </FormControl>
        )}

        {/* SA authority toggles */}
        <Box sx={{ background: '#F9FAFB', borderRadius: 1.5, p: 1.5, border: '1px solid #E5E7EB' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#374151', fontSize: '11px', mb: 1, display: 'block' }}>
            Super Admin Controls
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  size="small"
                  sx={{ '& .Mui-checked': { color: '#DC2626' }, '& .Mui-checked+.MuiSwitch-track': { background: '#FECACA' } }}
                />
              }
              label={<Typography sx={{ fontSize: '12px', fontWeight: 600 }}>Required</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={locked}
                  onChange={(e) => setLocked(e.target.checked)}
                  size="small"
                  sx={{ '& .Mui-checked': { color: '#F59E0B' }, '& .Mui-checked+.MuiSwitch-track': { background: '#FDE68A' } }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>Lock</Typography>
                  <Typography sx={{ fontSize: '10px', color: '#6B7280' }}>Prevents Clinic Admin / Doctor edits</Typography>
                </Box>
              }
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280', fontWeight: 600 }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!label.trim() || updateField.isPending}
          onClick={handleSave}
          sx={{ background: '#5519E6', '&:hover': { background: '#4410C0' }, fontWeight: 700 }}
        >
          {updateField.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ---- Confirm Remove Dialog --------------------------------------------------
const ConfirmRemoveDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fieldLabel: string;
  isLocked: boolean;
  removing: boolean;
}> = ({ open, onClose, onConfirm, fieldLabel, isLocked, removing }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontWeight: 700, fontSize: '15px', color: '#DC2626' }}>
      {isLocked ? 'Remove Locked Field?' : 'Remove Field?'}
    </DialogTitle>
    <DialogContent>
      {isLocked && (
        <Box sx={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 1.5, p: 1.5, mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 600, fontSize: '11.5px' }}>
            This field is locked and visible across clinics. Removing it will affect all Clinic Admins and Doctors using this field.
          </Typography>
        </Box>
      )}
      <Typography variant="body2" sx={{ fontSize: '13px' }}>
        Are you sure you want to permanently remove <strong>{fieldLabel}</strong>?
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} sx={{ color: '#6B7280', fontWeight: 600 }}>Cancel</Button>
      <Button
        variant="contained"
        disabled={removing}
        onClick={onConfirm}
        sx={{ background: '#DC2626', '&:hover': { background: '#B91C1C' }, fontWeight: 700 }}
      >
        {removing ? 'Removing...' : 'Remove'}
      </Button>
    </DialogActions>
  </Dialog>
);

// ---- Main -------------------------------------------------------------------
const FieldManager: React.FC = () => {
  const [intakeCountry, setIntakeCountry] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogSection, setAddDialogSection] = useState('registration');
  const [editField, setEditField] = useState<FieldDefinitionDto | null>(null);
  const [removeTarget, setRemoveTarget] = useState<{ id: string; label: string; locked: boolean } | null>(null);

  // --- API hooks ---
  const { data: countriesData } = useCountries();
  const countries = (countriesData ?? FALLBACK_COUNTRIES) as Array<
    Pick<CountryConfig, 'id' | 'name' | 'flagEmoji'>
  >;

  // Auto-select first country
  React.useEffect(() => {
    if (countries.length > 0 && !countries.find((c) => c.id === intakeCountry)) {
      setIntakeCountry(countries[0]!.id);
    }
  }, [countries, intakeCountry]);

  const {
    data: intakeApiData,
    isLoading: intakeLoading,
  } = useFields('registration', intakeCountry);

  const {
    data: soapApiData,
    isLoading: soapLoading,
  } = useFields('soap');

  const deleteField = useDeleteField();
  const toggleLock = useToggleFieldLock();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Build a country id -> {name, flag} map
  const countriesMap = useMemo(() => {
    const map: Record<string, { name: string; flag: string }> = {};
    countries.forEach((c) => {
      map[c.id] = { name: c.name, flag: c.flagEmoji ?? '' };
    });
    return map;
  }, [countries]);

  // --- Resolve intake fields: API or fallback ---
  const intakeFields: FieldRow[] = useMemo(() => {
    if (intakeApiData && Array.isArray(intakeApiData) && intakeApiData.length > 0) {
      return (intakeApiData as FieldDefinitionDto[])
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((dto) => mapDtoToFieldRow(dto, countriesMap));
    }
    return INTAKE_FIELDS[intakeCountry] ?? [];
  }, [intakeApiData, intakeCountry, countriesMap]);

  // --- Resolve SOAP fields: API or fallback ---
  const soapFields: FieldRow[] = useMemo(() => {
    if (soapApiData && Array.isArray(soapApiData) && soapApiData.length > 0) {
      return (soapApiData as FieldDefinitionDto[])
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((dto) => mapDtoToFieldRow(dto, countriesMap));
    }
    return SOAP_FIELDS;
  }, [soapApiData, countriesMap]);

  // Build a lookup from field id -> FieldDefinitionDto for edit dialog
  const fieldDtoMap = useMemo(() => {
    const map: Record<string, FieldDefinitionDto> = {};
    if (intakeApiData && Array.isArray(intakeApiData)) {
      (intakeApiData as FieldDefinitionDto[]).forEach((d) => { map[d.id] = d; });
    }
    if (soapApiData && Array.isArray(soapApiData)) {
      (soapApiData as FieldDefinitionDto[]).forEach((d) => { map[d.id] = d; });
    }
    return map;
  }, [intakeApiData, soapApiData]);

  const handleEdit = (id: string) => {
    const dto = fieldDtoMap[id];
    if (dto) setEditField(dto);
  };

  const handleToggleLock = (id: string) => {
    setTogglingId(id);
    toggleLock.mutate(id, {
      onSettled: () => setTogglingId(null),
    });
  };

  const handleRemoveClick = (id: string) => {
    const dto = fieldDtoMap[id];
    if (dto) {
      setRemoveTarget({ id: dto.id, label: dto.label, locked: dto.locked });
    }
  };

  const handleConfirmRemove = () => {
    if (!removeTarget) return;
    setRemovingId(removeTarget.id);
    deleteField.mutate(removeTarget.id, {
      onSettled: () => {
        setRemovingId(null);
        setRemoveTarget(null);
      },
    });
  };

  return (
    <DashboardLayout pageTitle="Field Manager">
      <Container maxWidth="lg" sx={{ py: 3 }}>

        {/* SA Authority Banner */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, px: 2, py: 1.25,
          background: 'linear-gradient(135deg, #5519E608 0%, #F59E0B08 100%)',
          border: '1px solid #5519E620', borderRadius: 2,
        }}>
          <Typography sx={{ fontSize: '16px' }}>{'\u{1F6E1}\u{FE0F}'}</Typography>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px', color: '#374151' }}>
              Super Admin Authority
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '11px' }}>
              You can edit, lock/unlock, and remove any field. Locked fields are frozen for Clinic Admins and Doctors only.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2.5}>

          {/* Patient Intake Fields */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <SectionHeader
                  title="Patient Intake Fields"
                  count={intakeFields.length}
                  showCountrySelect
                  country={intakeCountry}
                  onCountryChange={setIntakeCountry}
                  countries={countries}
                  onAddField={() => { setAddDialogSection('registration'); setAddDialogOpen(true); }}
                />

                {intakeLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} sx={{ color: '#5519E6' }} />
                  </Box>
                ) : (
                  intakeFields.map((f) => (
                    <FieldItem
                      key={f.id}
                      field={f}
                      onEdit={handleEdit}
                      onToggleLock={handleToggleLock}
                      onRemove={handleRemoveClick}
                      removing={removingId === f.id}
                      toggling={togglingId === f.id}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* SOAP / Clinical Note Fields */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <SectionHeader
                  title="SOAP / Clinical Note Fields"
                  count={soapFields.length}
                  onAddField={() => { setAddDialogSection('soap'); setAddDialogOpen(true); }}
                />

                {soapLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} sx={{ color: '#5519E6' }} />
                  </Box>
                ) : (
                  soapFields.map((f) => (
                    <FieldItem
                      key={f.id}
                      field={f}
                      onEdit={handleEdit}
                      onToggleLock={handleToggleLock}
                      onRemove={handleRemoveClick}
                      removing={removingId === f.id}
                      toggling={togglingId === f.id}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        <AddFieldDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          section={addDialogSection}
          countryId={intakeCountry}
          countries={countries}
        />

        <EditFieldDialog
          open={!!editField}
          onClose={() => setEditField(null)}
          field={editField}
          countries={countries}
        />

        <ConfirmRemoveDialog
          open={!!removeTarget}
          onClose={() => setRemoveTarget(null)}
          onConfirm={handleConfirmRemove}
          fieldLabel={removeTarget?.label ?? ''}
          isLocked={removeTarget?.locked ?? false}
          removing={removingId === removeTarget?.id}
        />
      </Container>
    </DashboardLayout>
  );
};

export default FieldManager;
