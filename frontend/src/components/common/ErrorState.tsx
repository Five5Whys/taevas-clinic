import { Box, Typography, Button } from '@mui/material';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to load data. Please try again.',
  onRetry
}: ErrorStateProps) => (
  <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
    <Typography sx={{ fontSize: 64, mb: 2, lineHeight: 1 }}>&#9888;</Typography>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{message}</Typography>
    {onRetry && (
      <Button variant="outlined" color="primary" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </Box>
);
