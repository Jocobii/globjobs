import { lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Container } from '@mui/material';

import PageContent from '@gsuite/shared/ui/PageContent';
import { NotificationsProvider } from '@gsuite/shared/contexts/NotificationsContext';

const GOPS = lazy(() => import('./page/GOPS'));

function App() {
  return (
    <BrowserRouter>
      <NotificationsProvider>
        <PageContent>
          <Container maxWidth={false}>
            <GOPS />
          </Container>
        </PageContent>
      </NotificationsProvider>
    </BrowserRouter>
  );
}

export default App;
