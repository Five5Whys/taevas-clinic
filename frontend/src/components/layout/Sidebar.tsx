import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_CONFIG, ROLES } from '@/utils/constants';

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

// Role-specific branding config matching POC
const ROLE_BRANDING = {
  SUPERADMIN: {
    dark: true,
    logoEmoji: '🌐',
    logoTitle: 'CommandControl',
    logoSub: 'Taevas Super Admin',
    userInitials: 'SA',
    userName: 'Sanjay Krishnan',
    userRole: 'Super Admin · Taevas HQ',
    avatarColor: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
  },
  CLINIC_ADMIN: {
    dark: false,
    logoEmoji: '🏥',
    logoTitle: 'Clinic Admin',
    logoSub: 'ENT Care Center',
    userInitials: 'CA',
    userName: 'Sunita Rao',
    userRole: 'Clinic Admin · ENT Care',
    avatarColor: 'linear-gradient(135deg, #FF8232 0%, #FFB366 100%)',
  },
  DOCTOR: {
    dark: true,
    logoEmoji: '🏥',
    logoTitle: 'Taevas Clinic',
    logoSub: 'ENT Platform',
    userInitials: 'RK',
    userName: 'Dr. Rajesh Kumar',
    userRole: 'ENT Specialist · Pune',
    avatarColor: 'linear-gradient(135deg, #CDDC50 0%, #99A830 100%)',
  },
  PATIENT: {
    dark: false,
    logoEmoji: '💙',
    logoTitle: 'My Health',
    logoSub: 'Nexus Patient Portal',
    userInitials: 'AS',
    userName: 'Anita Sharma',
    userRole: 'Patient',
    avatarColor: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
  },
};

const SIDEBAR_W = 240;

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const location = useLocation();
  const { userRole } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const role = (userRole || 'PATIENT') as keyof typeof ROLE_BRANDING;
  const branding = ROLE_BRANDING[role] || ROLE_BRANDING.PATIENT;
  const navItems = userRole ? (NAVIGATION_CONFIG as any)[userRole] || [] : [];
  const isDark = branding.dark;

  // Colours — deep purple gradient sidebar for SA & Doctor
  const bg         = isDark ? 'linear-gradient(180deg, #1E0A4E 0%, #2D1566 50%, #1A0940 100%)' : '#FFFFFF';
  const borderCol  = isDark ? 'rgba(255,255,255,0.10)' : '#E5E7EB';
  const textPrimary  = isDark ? '#FFFFFF' : '#0A0A0F';
  const textMuted    = isDark ? 'rgba(255,255,255,0.50)' : '#9CA3AF';
  const activeBg     = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(85,25,230,0.08)';
  const activeText   = isDark ? '#C4A1FF' : '#5519E6';
  const hoverBg      = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(85,25,230,0.05)';
  const sectionText  = isDark ? 'rgba(255,255,255,0.40)' : '#9CA3AF';

  // Badge colours
  const badgeBg   = isDark ? 'rgba(196,161,255,0.20)' : 'rgba(85,25,230,0.1)';
  const badgeText = isDark ? '#C4A1FF' : '#5519E6';

  // Group nav items by section
  const sections: { title: string; items: any[] }[] = [];
  navItems.forEach((item: any) => {
    const sectionTitle = item.section || '';
    const existing = sections.find(s => s.title === sectionTitle);
    if (existing) {
      existing.items.push(item);
    } else {
      sections.push({ title: sectionTitle, items: [item] });
    }
  });

  const isActive = (path: string) => {
    if (path === '/superadmin' || path === '/admin' || path === '/doctor' || path === '/patient') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        overflow: 'hidden',
      }}
    >
      {/* ── Logo / Branding ── */}
      <Box
        sx={{
          px: 2,
          py: 1.75,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          borderBottom: `1px solid ${borderCol}`,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            flexShrink: 0,
          }}
        >
          {branding.logoEmoji}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: textPrimary,
              fontFamily: '"Clash Display", sans-serif',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {branding.logoTitle}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: textMuted,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {branding.logoSub}
          </Typography>
        </Box>
      </Box>

      {/* ── Navigation ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1, px: 1 }}>
        {sections.map((section, si) => (
          <Box key={si} sx={{ mb: 0.5 }}>
            {/* Section header */}
            {section.title && (
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: sectionText,
                  px: 1.5,
                  pt: si === 0 ? 0.5 : 1.25,
                  pb: 0.5,
                }}
              >
                {section.title}
              </Typography>
            )}

            {/* Nav items */}
            {section.items.map((item: any) => {
              const active = isActive(item.path);
              const isUpcoming = item.upcoming;
              const navItem = (
                <Box
                  key={item.id}
                  {...(!isUpcoming ? { component: RouterLink, to: item.path } : {})}
                  onClick={!isUpcoming && isMobile ? onClose : undefined}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.7,
                    mb: 0.25,
                    borderRadius: '7px',
                    textDecoration: 'none',
                    cursor: isUpcoming ? 'default' : 'pointer',
                    opacity: isUpcoming ? 0.4 : 1,
                    transition: 'background 0.15s, color 0.15s',
                    backgroundColor: active ? activeBg : 'transparent',
                    '&:hover': isUpcoming ? {} : { backgroundColor: active ? activeBg : hoverBg },
                  }}
                >
                  {/* Emoji icon */}
                  <Box
                    sx={{
                      fontSize: '0.9rem',
                      width: 20,
                      textAlign: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.emoji || '•'}
                  </Box>

                  {/* Label */}
                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: '0.775rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? activeText : (isDark ? 'rgba(255,255,255,0.75)' : '#374151'),
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.label}
                  </Typography>

                  {/* Badge or Upcoming tag */}
                  {isUpcoming ? (
                    <Box
                      sx={{
                        px: 0.75,
                        py: 0.1,
                        borderRadius: '10px',
                        fontSize: '0.55rem',
                        fontWeight: 700,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                        color: isDark ? 'rgba(255,255,255,0.35)' : '#9CA3AF',
                        lineHeight: 1.6,
                        flexShrink: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Soon
                    </Box>
                  ) : item.badge ? (
                    <Box
                      sx={{
                        px: 0.75,
                        py: 0.1,
                        borderRadius: '10px',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        backgroundColor: active ? (isDark ? 'rgba(196,161,255,0.18)' : 'rgba(85,25,230,0.15)') : badgeBg,
                        color: active ? activeText : badgeText,
                        lineHeight: 1.6,
                        flexShrink: 0,
                      }}
                    >
                      {item.badge}
                    </Box>
                  ) : null}

                  {/* Active left bar */}
                  {active && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: '60%',
                        borderRadius: '0 3px 3px 0',
                        backgroundColor: activeText,
                      }}
                    />
                  )}
                </Box>
              );
              return isUpcoming ? (
                <Tooltip key={item.id} title="Upcoming" arrow placement="right">
                  {navItem}
                </Tooltip>
              ) : navItem;
            })}
          </Box>
        ))}
      </Box>

      {/* ── User Footer ── */}
      <Box
        sx={{
          borderTop: `1px solid ${borderCol}`,
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: branding.avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          {branding.userInitials}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.73rem',
              fontWeight: 600,
              color: textPrimary,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {branding.userName}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.62rem',
              color: textMuted,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {branding.userRole}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: SIDEBAR_W,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_W,
          boxSizing: 'border-box',
          border: 'none',
          borderRight: `1px solid ${borderCol}`,
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
