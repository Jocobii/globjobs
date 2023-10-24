import { Stack, CircularProgress } from '@mui/material';

export default function LinearIndeterminate() {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <CircularProgress />
    </Stack>
  );
}
