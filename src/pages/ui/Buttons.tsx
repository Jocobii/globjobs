import { experimentalStyled as styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import {
    Button,
    Box,
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

export function Buttons() {
  return (
    <>
        <Typography variant='h1'> Buttons </Typography>
        <Divider sx={{ marginBottom: 5 }} />
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 24 }}>
            <Grid item xs={2} sm={4} md={4}>
                <h2>Large</h2>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='large' variant='contained'>Large</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='large' variant='outlined'>Large</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button disabled size='large' variant='outlined'>Large</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='large' startIcon={<AddIcon />} variant='contained'>Large</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='large' endIcon={<AddIcon />} variant='outlined'>Large</Button></Item>
            </Grid>
        </Grid>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 24 }}>
            <Grid item xs={2} sm={4} md={4}>
                <h2>Medium</h2>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='medium' variant='contained'>Medium</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='medium' variant='outlined'>Medium</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button disabled size='medium' variant='outlined'>Medium</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='medium' startIcon={<AddIcon />} variant='contained'>Medium</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='medium' endIcon={<AddIcon />} variant='outlined'>Medium</Button></Item>
            </Grid>
        </Grid>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 24 }}>
            <Grid item xs={2} sm={4} md={4}>
                <h2>Small</h2>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='small' variant='contained'>Small</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='small' variant='outlined'>Small</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button disabled size='small' variant='outlined'>Small</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='small' startIcon={<AddIcon />} variant='contained'>Small</Button></Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item><Button size='small' endIcon={<AddIcon />} variant='outlined'>Small</Button></Item>
            </Grid>
        </Grid>
        </Box>
    </>
  );
}