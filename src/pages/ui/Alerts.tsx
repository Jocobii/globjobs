import { experimentalStyled as styled } from '@mui/material/styles';
import {
  BaseVariant,
} from 'notistack';
import { useSnackNotification } from '@/hooks';
import {
  Button,
  Paper,
  Grid,
  Typography,
  Divider,
} from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export function Alert() {
  const { showSnackMessage } = useSnackNotification();

  const showMessages = (type: BaseVariant) => showSnackMessage('This is an alert message!', type)

  return (
    <>
      <Typography variant='h1'> Alert </Typography>
      <Divider sx={{ marginBottom: 5 }} />
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 24 }}>
        <Grid item xs={2} sm={4} md={4}>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <Item><Button size='large' onClick={() => showMessages('success')} variant='contained'>Success</Button></Item>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <Item><Button size='large' onClick={() => showMessages('error')} variant='contained'>Error</Button></Item>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <Item><Button size='large' onClick={() => showMessages('warning')} variant='contained'>Warning</Button></Item>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
        <Item><Button size='large' onClick={() => showMessages('info')} variant='contained'>Info</Button></Item>
        </Grid>
      </Grid>
    </>
  )
}