import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDoctorProfileCompletion } from '@/hooks/doctor';

interface ProfileCompletionGuardProps {
  children: React.ReactNode;
}

const PROFILE_PATH = '/doctor/profile';
const BANNER_DISMISSED_KEY = 'doctor_profile_banner_dismissed';

/**
 * Wraps Doctor routes to enforce profile completion:
 * - If mandatory fields missing -> redirect to /doctor/profile
 * - If optional fields missing -> show dismissible yellow banner
 * - /doctor/profile is always accessible
 */
const ProfileCompletionGuard: React.FC<ProfileCompletionGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: completion, isLoading } = useDoctorProfileCompletion();
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    return sessionStorage.getItem(BANNER_DISMISSED_KEY) === 'true';
  });

  const isProfilePage = location.pathname === PROFILE_PATH;

  useEffect(() => {
    if (isLoading || !completion || isProfilePage) return;

    // Redirect if mandatory fields are missing
    if (completion.missingMandatory && completion.missingMandatory.length > 0) {
      navigate(PROFILE_PATH, {
        replace: true,
        state: { message: 'Please complete your mandatory profile fields before proceeding.' },
      });
    }
  }, [completion, isLoading, isProfilePage, navigate]);

  const handleDismiss = () => {
    setBannerDismissed(true);
    sessionStorage.setItem(BANNER_DISMISSED_KEY, 'true');
  };

  // Show yellow banner for optional missing fields (not on profile page, not dismissed)
  const showBanner =
    !isLoading &&
    completion &&
    !isProfilePage &&
    !bannerDismissed &&
    completion.missingOptional &&
    completion.missingOptional.length > 0 &&
    completion.status !== 'COMPLETE';

  return (
    <>
      {showBanner && (
        <Box
          sx={{
            background: '#FFF8E1',
            borderBottom: '1px solid #FFE082',
            px: 2.5,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: '12px', color: '#B85600', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate(PROFILE_PATH)}
          >
            Complete your profile for a better experience. Click here to update your profile.
          </Typography>
          <IconButton size="small" onClick={handleDismiss} sx={{ color: '#B85600' }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      )}
      {children}
    </>
  );
};

export default ProfileCompletionGuard;
