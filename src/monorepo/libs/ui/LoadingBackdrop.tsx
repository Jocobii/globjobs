import { Backdrop, CircularProgress } from '@mui/material';

export default function LoadingBackdrop() {
  return (
    <Backdrop
      open
      sx={{ zIndex: 9999 }}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
}
