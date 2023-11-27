import {
  Container,
  Typography,
  Alert,
  AlertTitle,
} from '@mui/material';
import { FcGoogle } from 'react-icons/fc';

import useResponsive from '@/hooks/useResponsive';
import {
  Content,
  GoogleButton,
  Header,
  RootContainer,
  Section,
  ForgotButton,
} from '../components';
import SignInForm from '@/components/SignInForm';
import useAuthentication from '@/hooks/useAuthentication';
import { logo_gglobal, logoglobalization, logistics } from '@/assets';

export default function SignInPage() {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  const { handleGoogleLogin, errorMessage, isLoading } = useAuthentication();

  return (
    <RootContainer title="Sign In">
      <Header>
        <img
          src={logoglobalization}
          alt="Globalization"
          loading="lazy"
          style={{
            width: '30%',
            height: '30%',
            marginLeft: '8%',
            marginTop: '2%',
          }}
        />
      </Header>
      <>
        {mdUp && (
          <Section>
            <img
              src={logistics}
              alt="Globalization"
              loading="lazy"
              style={{
                width: '65%',
                height: '65%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '8%',
              }}
            />
          </Section>
        )}
      </>
      <Container maxWidth="md" sx={{ backgroundColor: '#fff' }}>
        <Content spacing={2}>
          <img
            src={logo_gglobal}
            alt="G-Global"
            style={{
              width: '70%', height: '70%', marginLeft: '10%', color: '#000',
            }}
          />
          <Typography variant="h5" align="center" style={{ opacity: '70%', color: '#000' }}>
            ¡Bienvenido a G-Globalization!
          </Typography>
          <Typography variant="h6" align="center" style={{ opacity: '70%', color: '#000' }}>
            Inicia sesión para solicitar y monitorear tus operaciones en
            tiempo real
          </Typography>
          {errorMessage && (
            <Alert severity="error">
              <AlertTitle>Atención!</AlertTitle>
              {errorMessage}
              {' — '}
              <strong>chécalo!</strong>
            </Alert>
          )}
          <SignInForm />
          <GoogleButton
            loading={isLoading}
            startIcon={!isLoading && <FcGoogle />}
            onClick={handleGoogleLogin}
            variant="outlined"
          >
            Iniciar Sesión con Google
          </GoogleButton>
          {!smUp && (
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              <ForgotButton />
            </Typography>
          )}
        </Content>
      </Container>
    </RootContainer>
  );
}
