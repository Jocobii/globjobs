import { MaterialDesignContent } from 'notistack';
import { styled } from '@mui/material/styles';

export const StyledMaterialDesignContent = styled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent-success': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.success.light : theme.palette.success.dark,
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.error.light : theme.palette.error.dark,
  },
  '&.notistack-MuiContent-warning': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.warning.light : theme.palette.warning.dark,
  },
  '&.notistack-MuiContent-info': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  },
}));
