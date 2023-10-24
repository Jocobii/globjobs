import { Typography, Container, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  error: string;
}
function ErrorComponent({ error }: Props) {
  const { t } = useTranslation();
  return (
    <Container sx={{ minWidth: '100%', padding: 0 }}>
      <Paper
        sx={{
          minWidth: '100%',
          textAlign: 'center',
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        elevation={2}
      >
        <Typography variant="h3" paragraph>
          {t('unexpectedError')}
          {' '}
          [
          {error}
          ]
          {' '}
          <span role="img" aria-label="mmm">
            🤔...
          </span>
        </Typography>
      </Paper>
    </Container>
  );
}

export default ErrorComponent;
