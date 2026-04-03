import { createTheme, alpha } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// Taevas Brand Colors
const taevasColors = {
  primary: '#5519E6',
  primaryHover: '#4410CC',
  secondary: '#A046F0',
  success: '#CDDC50',
  warning: '#FF8232',
  danger: '#F43F5E',
  info: '#3B82F6',
  background: '#F1F3F7',
  surface: '#FFFFFF',
  surface2: '#F8F9FC',
  border: '#E5E7EB',
  text: '#0A0A0F',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  darkBg: '#0F0F14',
  darkMid: '#1A1A24',
  darkLight: '#252535',
};

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: taevasColors.primary,
      light: alpha(taevasColors.primary, 0.1),
      dark: taevasColors.primaryHover,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: taevasColors.secondary,
      light: alpha(taevasColors.secondary, 0.1),
      dark: '#8B36CC',
      contrastText: '#FFFFFF',
    },
    success: {
      main: taevasColors.success,
      light: alpha(taevasColors.success, 0.1),
      dark: '#A8B84D',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: taevasColors.warning,
      light: alpha(taevasColors.warning, 0.1),
      dark: '#E67C25',
      contrastText: '#FFFFFF',
    },
    error: {
      main: taevasColors.danger,
      light: alpha(taevasColors.danger, 0.1),
      dark: '#D92D50',
      contrastText: '#FFFFFF',
    },
    info: {
      main: taevasColors.info,
      light: alpha(taevasColors.info, 0.1),
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    background: {
      default: taevasColors.background,
      paper: taevasColors.surface,
    },
    text: {
      primary: taevasColors.text,
      secondary: taevasColors.textMuted,
      disabled: taevasColors.textLight,
    },
    divider: taevasColors.border,
    action: {
      active: taevasColors.primary,
      hover: alpha(taevasColors.primary, 0.08),
      selected: alpha(taevasColors.primary, 0.12),
      disabled: taevasColors.textLight,
      disabledBackground: taevasColors.surface2,
    },
  },
  typography: {
    fontFamily: '"Archivo", sans-serif',
    fontSize: 13,
    h1: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '1.6rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '1.35rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '1.1rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '0.95rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '0.8rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.8rem',
    },
    caption: {
      fontSize: '0.6875rem',
      lineHeight: 1.4,
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.625rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.8rem',
          padding: '6px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(85, 25, 230, 0.15)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(85, 25, 230, 0.12)',
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        sizeSmall: {
          padding: '4px 10px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '8px 20px',
          fontSize: '0.85rem',
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(10, 10, 15, 0.08)',
          border: `1px solid ${taevasColors.border}`,
          '&:hover': {
            boxShadow: '0 4px 16px rgba(10, 10, 15, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'unset',
          boxShadow: '0 2px 8px rgba(10, 10, 15, 0.08)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: taevasColors.primary,
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
              borderColor: taevasColors.primary,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: taevasColors.primary,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: taevasColors.surface2,
          color: taevasColors.text,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(10, 10, 15, 0.08)',
          borderBottom: `1px solid ${taevasColors.border}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${taevasColors.border}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: taevasColors.border,
          padding: '6px 12px',
          fontSize: '0.75rem',
        },
        head: {
          backgroundColor: taevasColors.surface2,
          fontWeight: 600,
          color: taevasColors.text,
          fontSize: '0.7rem',
          padding: '8px 12px',
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: '0 10px 40px rgba(10, 10, 15, 0.15)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: '0 4px 20px rgba(10, 10, 15, 0.12)',
          border: `1px solid ${taevasColors.border}`,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 15, 0.5)',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${taevasColors.border}`,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: taevasColors.primary,
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },
  },
};

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: taevasColors.primary,
      light: alpha(taevasColors.primary, 0.2),
      dark: taevasColors.primaryHover,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: taevasColors.secondary,
      light: alpha(taevasColors.secondary, 0.2),
      dark: '#8B36CC',
      contrastText: '#FFFFFF',
    },
    success: {
      main: taevasColors.success,
      light: alpha(taevasColors.success, 0.2),
      dark: '#A8B84D',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: taevasColors.warning,
      light: alpha(taevasColors.warning, 0.2),
      dark: '#E67C25',
      contrastText: '#FFFFFF',
    },
    error: {
      main: taevasColors.danger,
      light: alpha(taevasColors.danger, 0.2),
      dark: '#D92D50',
      contrastText: '#FFFFFF',
    },
    info: {
      main: taevasColors.info,
      light: alpha(taevasColors.info, 0.2),
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    background: {
      default: taevasColors.darkBg,
      paper: taevasColors.darkMid,
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0AEC0',
      disabled: '#718096',
    },
    divider: taevasColors.darkLight,
    action: {
      active: taevasColors.primary,
      hover: alpha(taevasColors.primary, 0.08),
      selected: alpha(taevasColors.primary, 0.12),
      disabled: '#718096',
      disabledBackground: taevasColors.darkLight,
    },
  },
  typography: {
    fontFamily: '"Archivo", sans-serif',
    fontSize: 13,
    h1: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '1.6rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '1.35rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '1.1rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '0.95rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Clash Display", sans-serif',
      fontSize: '0.8rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.8rem',
    },
    caption: {
      fontSize: '0.6875rem',
      lineHeight: 1.4,
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.625rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.8rem',
          padding: '6px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(85, 25, 230, 0.25)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(85, 25, 230, 0.20)',
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.24)',
          border: `1px solid ${taevasColors.darkLight}`,
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.32)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'unset',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: taevasColors.primary,
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
              borderColor: taevasColors.primary,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.24)',
          borderBottom: `1px solid ${taevasColors.darkLight}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${taevasColors.darkLight}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: taevasColors.darkLight,
        },
        head: {
          backgroundColor: taevasColors.darkLight,
          fontWeight: 600,
          color: '#FFFFFF',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.40)',
          border: `1px solid ${taevasColors.darkLight}`,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 15, 20, 0.7)',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${taevasColors.darkLight}`,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: taevasColors.primary,
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },
  },
};

export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);

export default lightTheme;
