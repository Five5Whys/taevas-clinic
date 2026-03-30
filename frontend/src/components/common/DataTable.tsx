import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  actions,
  onRowClick,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return value?.toString().toLowerCase().includes(lowerSearch);
      })
    );
  }, [data, searchTerm, columns]);

  return (
    <Box>
      {/* Search Bar and Actions */}
      {(searchable || actions) && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            alignItems: 'center',
          }}
        >
          {searchable && (
            <TextField
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <SearchIcon
                    sx={{
                      mr: 1,
                      color: theme.palette.text.secondary,
                      fontSize: 20,
                    }}
                  />
                ),
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
          )}
          {actions && <Box sx={{ ml: 'auto' }}>{actions}</Box>}
        </Box>
      )}

      {/* Table */}
      <TableContainer component={Paper} elevation={0}>
        <Table>
          {/* Header */}
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: theme.palette.mode === 'light'
                  ? '#F5F5F5'
                  : theme.palette.grey[800],
                borderBottom: `2px solid ${theme.palette.divider}`,
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  width={col.width}
                  align={col.align || 'left'}
                  sx={{
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    color: theme.palette.text.secondary,
                    py: 2,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={`${rowIndex}-${col.key}`}
                      align={col.align || 'left'}
                      sx={{
                        py: 2,
                        fontSize: '14px',
                        color: theme.palette.text.primary,
                      }}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    py: 4,
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DataTable;
