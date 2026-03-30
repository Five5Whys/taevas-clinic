import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  useTheme,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  breadcrumbs,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 18 }} />}
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, index) => (
            <div key={index}>
              {crumb.path ? (
                <Link
                  href={crumb.path}
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {crumb.label}
                </Typography>
              )}
            </div>
          ))}
        </Breadcrumbs>
      )}

      {/* Header Content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        {/* Title and Subtitle */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: '32px',
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: subtitle ? 0.5 : 0,
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '14px',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Action */}
        {action && (
          <Box sx={{ flexShrink: 0 }}>
            {action}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
