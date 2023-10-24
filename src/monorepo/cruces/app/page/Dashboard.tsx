import ThemeProvider from '@gsuite/shared/theme';
import { SnackbarProvider } from 'notistack';
import { PageContent, DialogProvider } from '@gsuite/shared/ui';
import { NotificationsProvider } from '@gsuite/shared/contexts/NotificationsContext';
import { Container } from '@mui/material';

import { CrossingProvider } from '@gsuite/shared/contexts';
import DashboardPage from '../../components/dashboard';

export default function Dashboard() {
  return (
    <ThemeProvider>
      <DialogProvider>
        <SnackbarProvider maxSnack={3}>
          <NotificationsProvider>
            <CrossingProvider>
              <PageContent>
                <Container maxWidth={false}>
                  <DashboardPage />
                </Container>
              </PageContent>
            </CrossingProvider>
          </NotificationsProvider>
        </SnackbarProvider>
      </DialogProvider>
    </ThemeProvider>
  );
}
