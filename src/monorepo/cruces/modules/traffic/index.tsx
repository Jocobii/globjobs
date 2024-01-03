import { PageContent, DialogProvider } from '@gsuite/shared/ui';
import NotiStackProvider from '@gsuite/shared/providers/NotiStackProvider';
import { Container } from '@mui/material';

import Home from './pages/home';

export function App() {
  return (
    <DialogProvider>
      <NotiStackProvider>
        <PageContent>
          <Container maxWidth={false}>
            <Home />
          </Container>
        </PageContent>
      </NotiStackProvider>
    </DialogProvider>
  );
}

export default App;
