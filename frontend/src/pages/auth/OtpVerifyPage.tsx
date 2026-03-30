import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  Button,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import authService from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { ROLE_REDIRECT_MAP } from '@/utils/constants';
import { getErrorMessage } from '@/utils/helpers';
import { isMockAuthEnabled, mockVerifyOtp, mockSendOtp } from '@/services/mockAuth';
import { UserRole } from '@/types';

const ROLE_OPTIONS: { role: UserRole; label: string; color: string; icon: string }[] = [
  { role: 'SUPERADMIN', label: 'Super Admin', color: '#A046F0', icon: '🌍' },
  { role: 'CLINIC_ADMIN', label: 'Clinic Admin', color: '#FF8232', icon: '🏥' },
  { role: 'DOCTOR', label: 'Doctor', color: '#CDDC50', icon: '🩺' },
  { role: 'PATIENT', label: 'Patient', color: '#3B82F6', icon: '👤' },
];

const OtpVerifyPage: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { login } = useAuthStore();
  const mockMode = isMockAuthEnabled();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('DOCTOR');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const phone = (location.state as { phone?: string })?.phone;

  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpValue?: string) => {
    const otpStr = otpValue || otp.join('');

    if (otpStr.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!phone) {
      setError('Phone number not found. Please start over.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      if (mockMode) {
        // In mock mode, any 6-digit OTP works — use selected role
        response = await mockVerifyOtp(phone, otpStr, selectedRole);
      } else {
        response = await authService.verifyOtp(phone, otpStr);
      }

      login(response.user, response.token);
      const redirectUrl = ROLE_REDIRECT_MAP[response.user.role];
      navigate(redirectUrl);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!phone || !canResend) return;

    setLoading(true);
    setError('');

    try {
      if (mockMode) {
        await mockSendOtp(phone);
      } else {
        await authService.sendOtp(phone);
      }
      setTimeLeft(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!phone) {
    return null;
  }

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
            boxShadow: '0 10px 40px rgba(85, 25, 230, 0.15)',
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: '16px',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              startIcon={<Icons.ArrowBack />}
              onClick={() => navigate('/login')}
              sx={{
                alignSelf: 'flex-start',
                mb: 2,
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.text.primary },
              }}
            >
              Back
            </Button>

            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Clash Display", sans-serif',
                fontWeight: 700,
                mb: 1,
              }}
            >
              Verify OTP
            </Typography>
            <Typography variant="body2" color="textSecondary">
              We've sent a 6-digit OTP to <strong>+91 {phone}</strong>
            </Typography>
          </Box>

          {/* Mock Mode: Role Selector */}
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
                  Dev Mode — Select Role (any OTP works)
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    justifyContent: 'center',
                  }}
                >
                  {ROLE_OPTIONS.map(({ role, label, color, icon }) => (
                    <Chip
                      key={role}
                      label={`${icon} ${label}`}
                      clickable
                      onClick={() => setSelectedRole(role)}
                      sx={{
                        fontWeight: 600,
                        borderColor: color,
                        backgroundColor: selectedRole === role ? `${color}18` : 'transparent',
                        border: `2px solid ${selectedRole === role ? color : '#ddd'}`,
                        color: selectedRole === role ? color : theme.palette.text.secondary,
                        '&:hover': {
                          backgroundColor: `${color}10`,
                          borderColor: color,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Divider />
            </Box>
          )}

          {/* Error */}
          {error && (
            <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* OTP Input */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 1,
                mb: 2,
              }}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: '50px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    border: `2px solid ${digit ? '#5519E6' : theme.palette.divider}`,
                    borderRadius: '8px',
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.paper,
                    cursor: loading ? 'not-allowed' : 'text',
                    transition: 'border-color 0.2s',
                  }}
                />
              ))}
            </Box>

            {mockMode && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#A046F0',
                  fontStyle: 'italic',
                }}
              >
                Hint: Enter any 6 digits (e.g. 123456)
              </Typography>
            )}
          </Box>

          {/* Verify Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => handleVerifyOtp()}
            disabled={loading || !otp.every((d) => d !== '')}
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
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </Button>

          {/* Resend OTP */}
          <Box sx={{ textAlign: 'center' }}>
            {canResend ? (
              <Button
                size="small"
                onClick={handleResendOtp}
                disabled={loading}
                sx={{
                  color: '#5519E6',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Resend OTP
              </Button>
            ) : (
              <Typography variant="caption" color="textSecondary">
                Resend OTP in <strong>{timeLeft}s</strong>
              </Typography>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default OtpVerifyPage;
