import {
  Box,
  Container,
  Skeleton,
  Typography,
  Stack,
} from '@mui/material';

export default function DataGridSkeleton() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              <Skeleton width={300} />
            </Typography>
            <Stack direction="row" spacing={2}>
              <Skeleton width={100} />
              <Skeleton width={40} />
            </Stack>
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <Skeleton width={300} height={60} />
          </Box>
        </Box>
        <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} height={400} />
      </Box>
    </Container>
  );
}
