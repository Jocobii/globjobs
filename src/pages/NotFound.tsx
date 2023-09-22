import { Link as RouterLink } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import {
  Box, Button, Typography, Container,
} from '@mui/material';

import PageContent from '../components/PageContent';

const RootStyle = styled(PageContent)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

export default function NotFound() {
  return (
    <RootStyle title="404 Page Not Found">
      <Container>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            We couldn’t find the page you’re looking for sorry
            <span role="img" aria-label="mmm">
              🤔
            </span>
            .
          </Typography>

          <Typography variant="h1" paragraph>
            Error 404
          </Typography>

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button>
        </Box>
      </Container>
    </RootStyle>
  );
}
