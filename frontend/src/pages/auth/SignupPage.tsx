import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
  Alert,
  Link,
  IconButton,
  Select,
  MenuItem,
  useTheme,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle, Cancel } from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
import { isMockAuthEnabled } from '@/services/mockAuth';
import { UserRole } from '@/types';
import { ROLE_REDIRECT_MAP } from '@/utils/constants';
import authService from '@/services/authService';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '\u{1F1EE}\u{1F1F3}', maxLen: 10 },
  { code: '+66', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', maxLen: 9 },
  { code: '+960', country: 'Maldives', flag: '\u{1F1F2}\u{1F1FB}', maxLen: 7 },
  { code: '+1', country: 'USA', flag: '\u{1F1FA}\u{1F1F8}', maxLen: 10 },
  { code: '+44', country: 'UK', flag: '\u{1F1EC}\u{1F1E7}', maxLen: 10 },
  { code: '+971', country: 'UAE', flag: '\u{1F1E6}\u{1F1EA}', maxLen: 9 },
  { code: '+65', country: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}', maxLen: 8 },
  { code: '+60', country: 'Malaysia', flag: '\u{1F1F2}\u{1F1FE}', maxLen: 10 },
  { code: '+94', country: 'Sri Lanka', flag: '\u{1F1F1}\u{1F1F0}', maxLen: 9 },
  { code: '+977', country: 'Nepal', flag: '\u{1F1F3}\u{1F1F5}', maxLen: 10 },
];

const SPECIALIZATIONS = [
  'General Physician', 'ENT', 'Cardiology', 'Dermatology', 'Orthopedics',
  'Pediatrics', 'Gynecology', 'Ophthalmology', 'Neurology', 'Dentistry',
  'Psychiatry', 'Radiology', 'Pathology', 'Oncology', 'Urology',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

const BRAND = '#5519E6';
const BRAND2 = '#A046F0';

// Password validation rules
const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: '1 uppercase letter (A-Z)', test: (p: string) => /[A-Z]/.test(p) },
  { label: '1 lowercase letter (a-z)', test: (p: string) => /[a-z]/.test(p) },
  { label: '1 number (0-9)', test: (p: string) => /\d/.test(p) },
  { label: '1 special character (!@#$%^&*)', test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
];

const SignupPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const mockMode = isMockAuthEnabled();

  // Step 1 = name + phone/email + password (credentials)
  // Step 2 = role selection + optional profile details
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'DOCTOR' | 'PATIENT'>('DOCTOR');
  const [signupMethod, setSignupMethod] = useState<'phone' | 'email'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Optional profile fields
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0]!;

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const passwordChecks = useMemo(() => PASSWORD_RULES.map(r => ({ ...r, passed: r.test(password) })), [password]);
  const isPasswordStrong = passwordChecks.every(c => c.passed);

  const isStep1Valid = () => {
    if (!firstName.trim()) return false;
    if (signupMethod === 'phone') {
      if (phone.length !== selectedCountry.maxLen) return false;
    } else {
      if (!isValidEmail(email)) return false;
    }
    if (!isPasswordStrong) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  const handleSignup = async () => {
    if (!isStep1Valid()) {
      setError('Please fill all mandatory fields correctly');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (mockMode) {
        const mockUser = {
          id: `${role.toLowerCase()}-new-${Date.now()}`,
          phone: signupMethod === 'phone' ? phone : '',
          email: signupMethod === 'email' ? email : '',
          firstName,
          lastName,
          role: role as UserRole,
          clinicId: '',
          clinicName: '',
        };
        login(mockUser, 'mock-jwt-token-signup');
        setSuccess('Account created successfully!');
        setTimeout(() => navigate(ROLE_REDIRECT_MAP[role]), 800);
      } else {
        const payload = {
          firstName,
          lastName,
          phone: signupMethod === 'phone' ? `${countryCode}${phone}` : undefined,
          email: signupMethod === 'email' ? email : undefined,
          password,
          role,
          dob: dob || undefined,
          gender: gender || undefined,
          specialization: role === 'DOCTOR' ? specialization || undefined : undefined,
          licenseNumber: role === 'DOCTOR' ? licenseNumber || undefined : undefined,
          bloodGroup: role === 'PATIENT' ? bloodGroup || undefined : undefined,
        };
        const response = await authService.login(payload.phone || payload.email || '', password);
        login(response.user, response.token);
        navigate(ROLE_REDIRECT_MAP[response.user.role as UserRole] || '/');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND2} 50%, ${BRAND} 100%)`,
        py: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: '0 10px 40px rgba(85, 25, 230, 0.25)', p: { xs: 2.5, sm: 3 }, borderRadius: '16px' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 2.5 }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '10px', background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND2} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 1.5, color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
              TC
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.25 }}>
              {step === 1 ? 'Create Account' : 'Select Your Role'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {step === 1 ? 'Join TaevasClinic' : 'How will you use TaevasClinic?'}
            </Typography>
          </Box>

          {/* Error / Success */}
          {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2, backgroundColor: '#DC2626', color: '#fff', fontWeight: 600, fontSize: '0.85rem', '& .MuiAlert-icon': { color: '#fff' }, '& .MuiAlert-action': { color: '#fff' } }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {/* ─── STEP 1: Credentials ─── */}
          {step === 1 && (
            <>
              {/* Signup Method Toggle */}
              <Box sx={{ display: 'flex', mb: 2, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                {(['phone', 'email'] as const).map(m => (
                  <Button
                    key={m}
                    fullWidth
                    onClick={() => { setSignupMethod(m); setError(''); }}
                    sx={{
                      py: 0.75, borderRadius: 0, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem',
                      backgroundColor: signupMethod === m ? BRAND : 'transparent',
                      color: signupMethod === m ? 'white' : 'text.secondary',
                      '&:hover': { backgroundColor: signupMethod === m ? '#4010C0' : 'action.hover' },
                    }}
                  >
                    {m === 'phone' ? 'Phone' : 'Email ID'}
                  </Button>
                ))}
              </Box>

              {/* Name */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <TextField
                  fullWidth size="small" label="First Name *" value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                <TextField
                  fullWidth size="small" label="Last Name" value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Box>

              {/* Phone or Email ID */}
              {signupMethod === 'phone' ? (
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  <Select
                    value={countryCode}
                    onChange={e => { setCountryCode(e.target.value); setPhone(''); }}
                    size="small"
                    sx={{ minWidth: 140, borderRadius: '8px', '& .MuiSelect-select': { py: '8.5px' } }}
                    renderValue={val => {
                      const c = COUNTRY_CODES.find(cc => cc.code === val);
                      return c ? `${c.country} (${c.code})` : val;
                    }}
                  >
                    {COUNTRY_CODES.map(c => (
                      <MenuItem key={c.code} value={c.code}>{c.country} {c.code}</MenuItem>
                    ))}
                  </Select>
                  <TextField
                    fullWidth size="small" placeholder={`${'0'.repeat(selectedCountry.maxLen)}`}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, selectedCountry.maxLen))}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>
              ) : (
                <TextField
                  fullWidth size="small" type="email" label="Email ID *" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              )}

              {/* Password */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                <TextField
                  fullWidth size="small" label="Password *"
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                <TextField
                  fullWidth size="small" label="Confirm Password *"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  error={confirmPassword.length > 0 && password !== confirmPassword}
                  helperText={confirmPassword.length > 0 && password !== confirmPassword ? 'Passwords do not match' : ''}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Box>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <Box sx={{ mb: 2, p: 1.25, borderRadius: '8px', background: '#F8F9FC', border: `1px solid ${BORDER}` }}>
                  <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                    Password Requirements
                  </Typography>
                  {passwordChecks.map((rule, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, py: 0.15 }}>
                      {rule.passed
                        ? <CheckCircle sx={{ fontSize: 13, color: '#16A34A' }} />
                        : <Cancel sx={{ fontSize: 13, color: '#DC2626' }} />
                      }
                      <Typography sx={{ fontSize: '11px', color: rule.passed ? '#16A34A' : '#6B7280', fontWeight: rule.passed ? 600 : 400 }}>
                        {rule.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Next button → go to step 2 for role selection */}
              <Button
                fullWidth variant="contained" size="large"
                onClick={() => { setError(''); setStep(2); }}
                disabled={!isStep1Valid()}
                sx={{ mb: 2, textTransform: 'none', fontSize: '0.95rem', fontWeight: 700, py: 1.25, background: BRAND, '&:hover': { background: '#4010C0' } }}
              >
                Next
              </Button>
            </>
          )}

          {/* ─── STEP 2: Role Selection + Optional Profile ─── */}
          {step === 2 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Button size="small" onClick={() => setStep(1)} sx={{ color: BRAND, textTransform: 'none', fontWeight: 600, minWidth: 0, p: 0.5 }}>
                  {'\u2190'} Back
                </Button>
              </Box>

              {/* Role Selector */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
                {(['DOCTOR', 'PATIENT'] as const).map(r => (
                  <Box
                    key={r}
                    onClick={() => setRole(r)}
                    sx={{
                      flex: 1, p: 1.5, borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
                      border: `2px solid ${role === r ? BRAND : '#E5E7EB'}`,
                      background: role === r ? `${BRAND}08` : 'transparent',
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: BRAND },
                    }}
                  >
                    <Typography sx={{ fontSize: '1.5rem', mb: 0.25 }}>{r === 'DOCTOR' ? '\u{1FA7A}' : '\u{1F464}'}</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: role === r ? BRAND : '#374151' }}>
                      {r === 'DOCTOR' ? 'Doctor' : 'Patient'}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Optional Profile Details */}
              <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600, mb: 1.5, fontSize: '0.8rem' }}>
                Optional profile details (can be added later)
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <TextField
                  fullWidth size="small" label="Date of Birth" type="date"
                  value={dob} onChange={e => setDob(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select value={gender} label="Gender" onChange={e => setGender(e.target.value)} sx={{ borderRadius: '8px' }}>
                    {GENDERS.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>

              {role === 'DOCTOR' && (
                <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Specialization</InputLabel>
                    <Select value={specialization} label="Specialization" onChange={e => setSpecialization(e.target.value)} sx={{ borderRadius: '8px' }}>
                      {SPECIALIZATIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth size="small" label="License Number"
                    value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>
              )}

              {role === 'PATIENT' && (
                <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                  <InputLabel>Blood Group</InputLabel>
                  <Select value={bloodGroup} label="Blood Group" onChange={e => setBloodGroup(e.target.value)} sx={{ borderRadius: '8px' }}>
                    {BLOOD_GROUPS.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                  </Select>
                </FormControl>
              )}

              {/* Cross-fill: if signed up with phone, optionally add email and vice versa */}
              {signupMethod === 'phone' && (
                <TextField
                  fullWidth size="small" label="Email ID (optional)" type="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              )}
              {signupMethod === 'email' && (
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  <Select
                    value={countryCode} onChange={e => setCountryCode(e.target.value)}
                    size="small" sx={{ minWidth: 130, borderRadius: '8px' }}
                    renderValue={val => { const c = COUNTRY_CODES.find(cc => cc.code === val); return c ? `${c.code}` : val; }}
                  >
                    {COUNTRY_CODES.map(c => <MenuItem key={c.code} value={c.code}>{c.country} {c.code}</MenuItem>)}
                  </Select>
                  <TextField
                    fullWidth size="small" label="Phone (optional)"
                    value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, selectedCountry.maxLen))}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>
              )}

              {/* Submit */}
              <Button
                fullWidth variant="contained" size="large"
                onClick={handleSignup}
                disabled={loading}
                sx={{ mb: 2, textTransform: 'none', fontSize: '0.95rem', fontWeight: 700, py: 1.25, background: BRAND, '&:hover': { background: '#4010C0' } }}
              >
                {loading ? <><CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />Creating account...</> : `Sign up as ${role === 'DOCTOR' ? 'Doctor' : 'Patient'}`}
              </Button>
            </>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link href="/login" sx={{ color: BRAND, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Login
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              By signing up, you agree to our{' '}
              <Link href="#" sx={{ color: BRAND, textDecoration: 'none' }}>Terms</Link>
              {' '}and{' '}
              <Link href="#" sx={{ color: BRAND, textDecoration: 'none' }}>Privacy Policy</Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

const BORDER = '#E5E7EB';

export default SignupPage;
