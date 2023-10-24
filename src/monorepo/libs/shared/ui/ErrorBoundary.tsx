import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import {
  Box,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type ErrorBoundaryProps = {
  children: React.ReactNode,
};

type ErrorFallbackProps = {
  error: Error,
  resetErrorBoundary: () => void,
};

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  const gotHome = () => navigate('/');

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      <Stack spacing={3}>
        <Typography variant="h3" paragraph color="primary">
          Oops, something went wrong:
        </Typography>
        <Typography variant="body1" gutterBottom>
          {typeof error === 'string' ? error : error.message}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" spacing={2}>
          <Button onClick={gotHome} variant="outlined">Go Home</Button>
          <Button onClick={goBack} variant="outlined">Go Back</Button>
          <Button onClick={resetErrorBoundary} variant="outlined">Try again</Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;
