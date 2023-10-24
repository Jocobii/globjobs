import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export default styled(Stack)(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));
