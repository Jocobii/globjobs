import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

type ComponentBoundaryProps = {
  minHeight?: number;
  errorKey?: string;
  children: React.ReactNode;
};

type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const { t } = useTranslation();

  const onReset = () => {
    resetErrorBoundary();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      sx={{
        backgroundColor: 'background.default',
        cursor: 'not-allowed',
        border: '1px solid',
        borderColor: 'error.main',
        borderRadius: '8px',
        padding: '1rem',
        height: '100%',
        width: '100%',
      }}
    >
      <Stack>
        <Typography variant="subtitle2" gutterBottom>
          {error?.name ?? 'Error occurred'}
        </Typography>
        <Typography variant="body2" paragraph>
          {error?.message ?? error}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={onReset}
        >
          {t('common.try_again')}
        </Button>
      </Stack>
    </Box>
  );
}

function ComponentBoundary({ minHeight = 120, errorKey = 'errorKey', children }: ComponentBoundaryProps) {
  return (
    <ErrorBoundary key={errorKey} FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={(
          <Skeleton
            variant="rectangular"
            width="100%"
            animation="wave"
            sx={{ minHeight, borderRadius: 2 }}
          />
        )}
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export default ComponentBoundary;
