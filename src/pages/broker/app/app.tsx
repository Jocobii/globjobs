import { lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Container } from '@mui/material';

import { DataProvider } from '@gsuite/shared/contexts/AppContext';
import ThemeProvider from '@gsuite/shared/theme';
import PageContent from '@gsuite/shared/ui/PageContent';
import { NotificationsProvider } from '@gsuite/shared/contexts/NotificationsContext';

const GOPS = lazy(() => import('./page/GOPS'));

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <ThemeProvider>
          <NotificationsProvider>
            <PageContent>
              <Container maxWidth={false}>
                <GOPS />
              </Container>
            </PageContent>
          </NotificationsProvider>
        </ThemeProvider>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
