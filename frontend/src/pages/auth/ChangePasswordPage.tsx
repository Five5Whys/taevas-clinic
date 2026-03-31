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
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
import { ROLE_REDIRECT_MAP } from '@/utils/constants';
import { UserRole } from '@/types';

const BRAND = '#5519E6';
const BRAND2 = '#A046F0';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = newPassword.length >= 6 && newPassword === confirmPassword;

  const handleSubmit = async () => {
    if (!isValid) {
      setError('Password must be at least 6 characters and match confirmation');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // TODO: call backend POST /api/auth/change-password
      // For now, just redirect to dashboard
      const role = user?.role as UserRole;
      if (role) {
        navigate(ROLE_REDIRECT_MAP[role] || '/');
      } else {
        navigate('/login');
      }
    } catch {
      setError('Failed to change password. Please try again.');
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
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ boxShadow: '0 10px 40px rgba(85, 25, 230, 0.25)', p: 3, borderRadius: '16px' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '10px', background: `linear-gradient(135deg, ${BRAND}, ${BRAND2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 1.5, color: '#fff', fontSize: '1.3rem' }}>
              {'\u{1F512}'}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Set New Password</Typography>
            <Typography variant="body2" color="textSecondary">
              Please change your password to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2, backgroundColor: '#DC2626', color: '#fff', fontWeight: 600, '& .MuiAlert-icon': { color: '#fff' }, '& .MuiAlert-action': { color: '#fff' } }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth size="small" label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <TextField
            fullWidth size="small" label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            error={confirmPassword.length > 0 && newPassword !== confirmPassword}
            helperText={confirmPassword.length > 0 && newPassword !== confirmPassword ? 'Passwords do not match' : ''}
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <Button
            fullWidth variant="contained" size="large"
            onClick={handleSubmit}
            disabled={loading || !isValid}
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.95rem', py: 1.25, background: BRAND, '&:hover': { background: '#4010C0' } }}
          >
            {loading ? <><CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />Saving...</> : 'Set Password & Continue'}
          </Button>
        </Card>
      </Container>
    </Box>
  );
};

export default ChangePasswordPage;
