import React, { useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  Tooltip,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_CONFIG } from '@/utils/constants';

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

const ROLE_BRANDING = {
  SUPERADMIN: {
    dark: true,
    logoEmoji: '🌐',
    logoTitle: 'CommandControl',
    logoSub: 'Taevas Super Admin',
  },
  CLINIC_ADMIN: {
    dark: false,
    logoEmoji: '🏥',
    logoTitle: 'Clinic Admin',
    logoSub: 'ENT Care Center',
  },
  DOCTOR: {
    dark: true,
    logoEmoji: '🏥',
    logoTitle: 'Taevas Clinic',
    logoSub: 'ENT Doctor',
  },
  PATIENT: {
    dark: false,
    logoEmoji: '💙',
    logoTitle: 'My Health',
    logoSub: 'Patient Portal',
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

  // Colours
  const bg         = isDark ? 'linear-gradient(180deg, #1E0A4E 0%, #2D1566 50%, #1A0940 100%)' : '#FFFFFF';
  const borderCol  = isDark ? 'rgba(255,255,255,0.10)' : '#E5E7EB';
  const textPrimary  = isDark ? '#FFFFFF' : '#0A0A0F';
  const textMuted    = isDark ? 'rgba(255,255,255,0.50)' : '#9CA3AF';
  const activeBg     = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(85,25,230,0.08)';
  const activeText   = isDark ? '#C4A1FF' : '#5519E6';
  const hoverBg      = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(85,25,230,0.05)';
  const sectionText  = isDark ? 'rgba(255,255,255,0.40)' : '#9CA3AF';
  const badgeBg   = isDark ? 'rgba(196,161,255,0.20)' : 'rgba(85,25,230,0.1)';
  const badgeText = isDark ? '#C4A1FF' : '#5519E6';

  // Group nav items by section
  const sections: { title: string; items: any[] }[] = [];
  navItems.forEach((item: any) => {
    const sectionTitle = item.section || '';
    const existing = sections.find((s: any) => s.title === sectionTitle);
    if (existing) {
      existing.items.push(item);
    } else {
      sections.push({ title: sectionTitle, items: [item] });
    }
  });

  // Collapsible state — first section open by default, rest open too
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsed(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const isSectionOpen = (title: string) => {
    return collapsed[title] !== true; // open by default
  };

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
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          borderBottom: `1px solid ${borderCol}`,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            flexShrink: 0,
          }}
        >
          {branding.logoEmoji}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: textPrimary,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            {branding.logoTitle}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.6rem',
              color: textMuted,
              lineHeight: 1.2,
            }}
          >
            {branding.logoSub}
          </Typography>
        </Box>
      </Box>

      {/* ── Navigation ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 0.5, px: 1 }}>
        {sections.map((section, si) => {
          const hasTitle = !!section.title;
          const sectionOpen = isSectionOpen(section.title);

          return (
            <Box key={si} sx={{ mb: 0.25 }}>
              {/* Collapsible section header */}
              {hasTitle ? (
                <Box
                  onClick={() => toggleSection(section.title)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    px: 1.5,
                    pt: si === 0 ? 0.5 : 1,
                    pb: 0.25,
                    userSelect: 'none',
                    '&:hover': { opacity: 0.8 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.58rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: sectionText,
                    }}
                  >
                    {section.title}
                  </Typography>
                  {sectionOpen ? (
                    <Icons.ExpandLess sx={{ fontSize: '0.85rem', color: sectionText }} />
                  ) : (
                    <Icons.ExpandMore sx={{ fontSize: '0.85rem', color: sectionText }} />
                  )}
                </Box>
              ) : null}

              {/* Nav items — collapsible */}
              <Collapse in={hasTitle ? sectionOpen : true} timeout={200}>
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
                        py: 0.6,
                        mb: 0.15,
                        borderRadius: '7px',
                        textDecoration: 'none',
                        cursor: isUpcoming ? 'default' : 'pointer',
                        opacity: isUpcoming ? 0.4 : 1,
                        position: 'relative',
                        transition: 'background 0.15s, color 0.15s',
                        backgroundColor: active ? activeBg : 'transparent',
                        '&:hover': isUpcoming ? {} : { backgroundColor: active ? activeBg : hoverBg },
                      }}
                    >
                      <Box sx={{ fontSize: '0.85rem', width: 18, textAlign: 'center', flexShrink: 0 }}>
                        {item.emoji || '•'}
                      </Box>
                      <Typography
                        sx={{
                          flex: 1,
                          fontSize: '0.75rem',
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
                      {isUpcoming ? (
                        <Box
                          sx={{
                            px: 0.75, py: 0.1, borderRadius: '10px', fontSize: '0.5rem',
                            fontWeight: 700, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                            color: isDark ? 'rgba(255,255,255,0.35)' : '#9CA3AF',
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                          }}
                        >
                          Soon
                        </Box>
                      ) : item.badge ? (
                        <Box
                          sx={{
                            px: 0.6, py: 0.1, borderRadius: '10px', fontSize: '0.55rem',
                            fontWeight: 700, minWidth: 18, textAlign: 'center',
                            backgroundColor: active ? (isDark ? 'rgba(196,161,255,0.18)' : 'rgba(85,25,230,0.15)') : badgeBg,
                            color: active ? activeText : badgeText,
                          }}
                        >
                          {item.badge}
                        </Box>
                      ) : null}
                      {active && (
                        <Box
                          sx={{
                            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                            width: 3, height: '55%', borderRadius: '0 3px 3px 0', backgroundColor: activeText,
                          }}
                        />
                      )}
                    </Box>
                  );
                  return isUpcoming ? (
                    <Tooltip key={item.id} title="Upcoming" arrow placement="right">{navItem}</Tooltip>
                  ) : navItem;
                })}
              </Collapse>
            </Box>
          );
        })}
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
