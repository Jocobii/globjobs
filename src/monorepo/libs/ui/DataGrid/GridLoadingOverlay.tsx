import { Paper, Stack, CircularProgress } from '@mui/material';

// Used for lazy DataGrid imports
export default function GridLoadingOverlay() {
  return (
    <Paper sx={{ height: 700 }}>
      <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
        <CircularProgress />
      </Stack>
    </Paper>
  );
}
