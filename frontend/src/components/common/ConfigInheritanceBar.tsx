import React from 'react';
import {
  Box,
  useTheme,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Level {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface ConfigInheritanceBarProps {
  levels: Level[];
}

const ConfigInheritanceBar: React.FC<ConfigInheritanceBarProps> = ({ levels }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        backgroundColor: theme.palette.background.paper,
        p: 2,
        borderRadius: '8px',
        overflow: 'auto',
      }}
    >
      {levels.map((level, index) => (
        <React.Fragment key={index}>
          {/* Level Item */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.5,
              borderRadius: '6px',
              backgroundColor: level.active
                ? `${theme.palette.primary.main}15`
                : 'transparent',
              color: level.active
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: level.active
                  ? `${theme.palette.primary.main}25`
                  : theme.palette.action.hover,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              {level.icon}
            </Box>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: level.active ? 600 : 500,
                whiteSpace: 'nowrap',
              }}
            >
              {level.label}
            </Typography>
            {level.active && (
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                }}
              />
            )}
          </Box>

          {/* Separator */}
          {index < levels.length - 1 && (
            <ChevronRightIcon
              sx={{
                color: theme.palette.divider,
                mx: 0.5,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default ConfigInheritanceBar;
