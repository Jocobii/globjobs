import { experimentalStyled as styled } from '@mui/material/styles';
import {
  Paper,
  Grid,
  Typography,
  Divider,
  TextField,
} from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export function TextFieldC() {
  return (
    <>
      <Typography variant="h1"> TextField </Typography>
      <Divider sx={{ marginBottom: 5 }} />
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 24 }}>
        <Grid item xs={2} sm={4} md={4}>
          <h1>Large</h1>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <Item><TextField id="outlined-basic" defaultValue="Default" label="Label" variant="outlined" /></Item>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <Item><TextField focused id="outlined-basic" defaultValue="Focused" label="Label" variant="outlined" /></Item>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <Item><TextField id="outlined-basic" label="Label" defaultValue="Error" error variant="outlined" /></Item>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <Item><TextField id="outlined-basic" label="Label" defaultValue="Disabled" disabled variant="outlined" /></Item>
        </Grid>
      </Grid>
    </>
  );
}
