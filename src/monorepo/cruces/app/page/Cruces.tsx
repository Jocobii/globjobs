import ThemeProvider from '@gsuite/shared/theme';
import { SnackbarProvider } from 'notistack';
import { PageContent, DialogProvider } from '@gsuite/shared/ui';
import { NotificationsProvider } from '@gsuite/shared/contexts/NotificationsContext';
import { Container } from '@mui/material';
import { CrossingProvider } from '@gsuite/shared/contexts';
import { TableHome } from '../../components/TableHome';

export default function Cruces() {
  console.log('cruces home ');
  return (
    <ThemeProvider>
      <DialogProvider>
        <SnackbarProvider maxSnack={4}>
          <CrossingProvider>
            <NotificationsProvider>
              <PageContent>
                <Container maxWidth={false}>
                  <TableHome />
                </Container>
              </PageContent>
            </NotificationsProvider>
          </CrossingProvider>
        </SnackbarProvider>
      </DialogProvider>
    </ThemeProvider>
  );
}
