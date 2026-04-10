import React, { useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  Tooltip,
  Collapse,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_CONFIG } from '@/utils/constants';
import { getUserInitials, getFullName } from '@/utils/helpers';

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
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
const SIDEBAR_COLLAPSED_W = 64;

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, collapsed = false, onToggleCollapse }) => {
  const theme = useTheme();
  const location = useLocation();
  const { user, userRole, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isCollapsed = !isMobile && collapsed;

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
  const [sectionCollapsed, setSectionCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setSectionCollapsed(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const isSectionOpen = (title: string) => {
    return sectionCollapsed[title] !== true; // open by default
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
          px: isCollapsed ? 0 : 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: isCollapsed ? 0 : 1.25,
          borderBottom: `1px solid ${borderCol}`,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <Tooltip title={isCollapsed ? branding.logoTitle : ''} placement="right" arrow>
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
              cursor: isCollapsed ? 'pointer' : 'default',
            }}
            onClick={isCollapsed ? onToggleCollapse : undefined}
          >
            {branding.logoEmoji}
          </Box>
        </Tooltip>
        {!isCollapsed && (
          <>
            <Box sx={{ minWidth: 0, flex: 1 }}>
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
            <IconButton
              size="small"
              onClick={onToggleCollapse}
              sx={{
                color: textMuted,
                p: 0.25,
                '&:hover': { color: textPrimary, backgroundColor: hoverBg },
              }}
            >
              <Icons.ChevronLeft sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </>
        )}
      </Box>

      {/* ── Navigation ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 0.5, px: isCollapsed ? 0.5 : 1 }}>
        {sections.map((section, si) => {
          const hasTitle = !!section.title;
          const sectionOpen = isSectionOpen(section.title);

          return (
            <Box key={si} sx={{ mb: 0.25 }}>
              {/* Collapsible section header */}
              {hasTitle && !isCollapsed ? (
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
              ) : isCollapsed && hasTitle && si > 0 ? (
                <Box sx={{ borderTop: `1px solid ${borderCol}`, my: 0.5, mx: 1 }} />
              ) : null}

              {/* Nav items */}
              <Collapse in={isCollapsed || (hasTitle ? sectionOpen : true)} timeout={200}>
                {section.items.map((item: any) => {
                  const active = isActive(item.path);
                  const isUpcoming = item.upcoming;
                  const navItem = (
                    <Tooltip key={item.id} title={isCollapsed ? item.label : (isUpcoming ? 'Upcoming' : '')} arrow placement="right">
                      <Box
                        {...(!isUpcoming ? { component: RouterLink, to: item.path } : {})}
                        onClick={!isUpcoming && isMobile ? onClose : undefined}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: isCollapsed ? 'center' : 'flex-start',
                          gap: isCollapsed ? 0 : 1,
                          px: isCollapsed ? 0 : 1.5,
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
                        <Box sx={{ fontSize: isCollapsed ? '1rem' : '0.85rem', width: isCollapsed ? 'auto' : 18, textAlign: 'center', flexShrink: 0 }}>
                          {item.emoji || '\u2022'}
                        </Box>
                        {!isCollapsed && (
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
                        )}
                        {!isCollapsed && isUpcoming ? (
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
                        ) : !isCollapsed && item.badge ? (
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
                    </Tooltip>
                  );
                  return navItem;
                })}
              </Collapse>
            </Box>
          );
        })}
      </Box>

      {/* ── Profile at Bottom ── */}
      <Box
        sx={{
          borderTop: `1px solid ${borderCol}`,
          px: isCollapsed ? 0.5 : 1.5,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: isCollapsed ? 0 : 1,
          flexShrink: 0,
        }}
      >
        <Tooltip title={isCollapsed ? (getFullName(user) || 'Profile') : ''} placement="right" arrow>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: '0.7rem',
              fontWeight: 700,
              backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : '#5519E6',
              color: isDark ? '#C4A1FF' : '#fff',
              flexShrink: 0,
            }}
          >
            {getUserInitials(user) || <Icons.PersonOutlined sx={{ fontSize: '0.9rem' }} />}
          </Avatar>
        </Tooltip>
        {!isCollapsed && (
          <>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: textPrimary, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {getFullName(user) || 'User'}
              </Typography>
              <Typography sx={{ fontSize: '0.55rem', color: textMuted, lineHeight: 1.2 }}>
                {userRole?.replace('_', ' ') || ''}
              </Typography>
            </Box>
            <IconButton size="small" onClick={logout} sx={{ color: textMuted, p: 0.25, '&:hover': { color: '#DC2626' } }}>
              <Icons.LogoutOutlined sx={{ fontSize: '0.9rem' }} />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: isCollapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        '& .MuiDrawer-paper': {
          width: isCollapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W,
          boxSizing: 'border-box',
          border: 'none',
          borderRight: `1px solid ${borderCol}`,
          transition: 'width 0.2s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
