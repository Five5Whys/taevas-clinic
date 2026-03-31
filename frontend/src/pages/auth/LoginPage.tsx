import React, { useState } from 'react';
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
  Divider,
  Chip,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
import { isMockAuthEnabled, MOCK_USERS } from '@/services/mockAuth';
import { UserRole } from '@/types';
import { ROLE_REDIRECT_MAP, COUNTRY_CODES } from '@/utils/constants';
import authService from '@/services/authService';
import { getErrorMessage } from '@/utils/helpers';


const ROLE_META: Partial<Record<UserRole, { label: string; color: string; icon: string }>> = {
  SUPERADMIN: { label: 'Super Admin', color: '#A046F0', icon: '\u{1F30D}' },
  CLINIC_ADMIN: { label: 'Clinic Admin', color: '#FF8232', icon: '\u{1F3E5}' },
  DOCTOR: { label: 'Doctor', color: '#CDDC50', icon: '\u{1FA7A}' },
  PATIENT: { label: 'Patient', color: '#3B82F6', icon: '\u{1F464}' },
};

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const mockMode = isMockAuthEnabled();

  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) ?? COUNTRY_CODES[0];

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, selectedCountry.maxLen);
    setPhone(value);
    setError('');
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError('');
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError('');
  };

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const isFormValid = () => {
    if (loginMethod === 'phone') {
      return phone.length === selectedCountry.maxLen && password.length >= 1;
    }
    return isValidEmail(email) && password.length >= 1;
  };

  const handleLogin = async () => {
    if (loginMethod === 'phone') {
      if (!phone || phone.length !== selectedCountry.maxLen) {
        setError(`Please enter a valid ${selectedCountry.maxLen}-digit phone number`);
        return;
      }
    } else {
      if (!email || !isValidEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (mockMode) {
        // In mock mode, accept any password and log in as SUPERADMIN by default
        const mockUser = MOCK_USERS.SUPERADMIN;
        login(mockUser, 'mock-jwt-token-for-dev-only');
        navigate(ROLE_REDIRECT_MAP.SUPERADMIN);
      } else {
        const identifier = loginMethod === 'phone' ? `${countryCode}${phone}` : email;
        const response = await authService.login(identifier, password);
        login(response.user, response.token);
        if (response.user.mustChangePassword) {
          navigate('/change-password');
        } else {
          const role = response.user.role as UserRole;
          navigate(ROLE_REDIRECT_MAP[role] || '/superadmin');
        }
      }
    } catch (err) {
      setError(getErrorMessage(err) || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    const user = MOCK_USERS[role];
    login(user, 'mock-jwt-token-for-dev-only');
    navigate(ROLE_REDIRECT_MAP[role]);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 50%, #5519E6 100%)',
        py: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0 10px 40px rgba(85, 25, 230, 0.25)',
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: '16px',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2,
                color: 'white',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              TC
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Clash Display", sans-serif',
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              TaevasClinic
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Healthcare Platform by Taevas Life Sciences
            </Typography>
          </Box>

          {/* ─── MOCK MODE: Quick Role Login ─── */}
          {mockMode && (
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: '#F8F9FC',
                  border: '1px dashed #A046F0',
                  mb: 2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    color: '#A046F0',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 1.5,
                  }}
                >
                  Dev Mode — Quick Login
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 1.5,
                  }}
                >
                  {(Object.keys(ROLE_META) as UserRole[]).map((role) => {
                    const meta = ROLE_META[role]!;
                    return (
                      <Button
                        key={role}
                        variant="outlined"
                        onClick={() => handleQuickLogin(role)}
                        sx={{
                          py: 1.5,
                          borderRadius: '10px',
                          borderColor: meta.color,
                          color: meta.color,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          '&:hover': {
                            backgroundColor: `${meta.color}10`,
                            borderColor: meta.color,
                          },
                        }}
                      >
                        <span style={{ fontSize: '1.4rem' }}>{meta.icon}</span>
                        {meta.label}
                      </Button>
                    );
                  })}
                </Box>
              </Box>

              <Divider>
                <Chip label="OR" size="small" sx={{ fontSize: '0.7rem' }} />
              </Divider>
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2, backgroundColor: '#DC2626', color: '#fff', fontWeight: 600, fontSize: '0.9rem', '& .MuiAlert-icon': { color: '#fff' }, '& .MuiAlert-action': { color: '#fff' } }}>
              {error}
            </Alert>
          )}

          {/* Login Method Toggle */}
          <Box sx={{ display: 'flex', mb: 2, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
            <Button
              fullWidth
              onClick={() => { setLoginMethod('phone'); setError(''); }}
              sx={{
                py: 1,
                borderRadius: 0,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                backgroundColor: loginMethod === 'phone' ? '#5519E6' : 'transparent',
                color: loginMethod === 'phone' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor: loginMethod === 'phone' ? '#4010C0' : 'action.hover',
                },
              }}
            >
              Phone
            </Button>
            <Button
              fullWidth
              onClick={() => { setLoginMethod('email'); setError(''); }}
              sx={{
                py: 1,
                borderRadius: 0,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                backgroundColor: loginMethod === 'email' ? '#5519E6' : 'transparent',
                color: loginMethod === 'email' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor: loginMethod === 'email' ? '#4010C0' : 'action.hover',
                },
              }}
            >
              Email ID
            </Button>
          </Box>

          {/* Login Form */}
          <Box>
            {loginMethod === 'phone' ? (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Phone Number <span style={{ color: '#DC2626' }}>*</span>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Select
                    value={countryCode}
                    onChange={(e) => { setCountryCode(e.target.value); setPhone(''); }}
                    disabled={loading}
                    sx={{
                      minWidth: 150,
                      borderRadius: '8px',
                      '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 0.5, py: '12px' },
                    }}
                    renderValue={(val) => {
                      const c = COUNTRY_CODES.find(cc => cc.code === val);
                      return c ? `${c.country} (${c.code})` : val;
                    }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <MenuItem key={c.code} value={c.code} sx={{ gap: 1 }}>
                        <span style={{ fontWeight: 500 }}>{c.country}</span>
                        <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>{c.code}</span>
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    fullWidth
                    placeholder={`${'0'.repeat(selectedCountry.maxLen)}`}
                    value={phone}
                    onChange={handlePhoneChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                    }}
                  />
                </Box>
              </>
            ) : (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Email ID <span style={{ color: '#DC2626' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                  }}
                />
              </>
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Password <span style={{ color: '#DC2626' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
              <Link
                href="/forgot-password"
                sx={{
                  color: '#5519E6',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading || !isFormValid()}
              sx={{
                mb: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                py: 1.25,
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  sx={{
                    color: '#5519E6',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" color="textSecondary">
              By logging in, you agree to our{' '}
              <Link href="#" sx={{ color: '#5519E6', textDecoration: 'none' }}>
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="#" sx={{ color: '#5519E6', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
