import ThemeProvider from '@gsuite/shared/theme';
import { SnackbarProvider } from 'notistack';
import { PageContent, DialogProvider } from '@gsuite/shared/ui';
import { NotificationsProvider } from '@gsuite/shared/contexts/NotificationsContext';
import { Container } from '@mui/material';

import { CrossingProvider } from '@gsuite/shared/contexts';
import Detail from '../../components/detail';

export default function CruceDetail() {
  return (
    <ThemeProvider>
      <DialogProvider>
        <SnackbarProvider maxSnack={3}>
          <NotificationsProvider>
            <CrossingProvider>
              <PageContent>
                <Container maxWidth={false}>
                  <Detail />
                </Container>
              </PageContent>
            </CrossingProvider>
          </NotificationsProvider>
        </SnackbarProvider>
      </DialogProvider>
    </ThemeProvider>
  );
}
