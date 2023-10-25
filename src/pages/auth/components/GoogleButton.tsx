import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { indigo } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

export default styled(LoadingButton)<LoadingButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(indigo[50]),
  height: 45,
  backgroundColor: indigo[50],
  '&:hover': {
    backgroundColor: indigo[100],
  },
}));
