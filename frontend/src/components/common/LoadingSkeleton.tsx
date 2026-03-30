import React from 'react';
import { Box, Skeleton, Container } from '@mui/material';

interface LoadingSkeletonProps {
  count?: number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  height?: number | string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 5,
  variant = 'rectangular',
  height = 200,
}) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton
            key={index}
            variant={variant}
            height={height}
            sx={{ mb: 2, borderRadius: '12px' }}
          />
        ))}
      </Box>
    </Container>
  );
};

export default LoadingSkeleton;
