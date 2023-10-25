import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';

export default styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 1500,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundImage: `linear-gradient(to bottom, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  borderRadius: 0,
}));
