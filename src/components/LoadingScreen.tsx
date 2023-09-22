import { Box, CircularProgress } from '@mui/material';

function LoadingPage() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress disableShrink />
    </Box>
  );
}

export default LoadingPage;
