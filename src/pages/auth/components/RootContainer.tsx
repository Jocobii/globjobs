import { styled } from '@mui/material/styles';
import PageContent from '@/components/PageContent';

export default styled(PageContent)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));
