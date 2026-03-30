import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  filters,
  actions,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {/* Search Input */}
      <TextField
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            </InputAdornment>
          ),
        }}
        sx={{
          minWidth: '200px',
          flex: 1,
          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.background.paper,
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />

      {/* Filters */}
      {filters && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {filters}
        </Box>
      )}

      {/* Actions */}
      {actions && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
          {actions}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
