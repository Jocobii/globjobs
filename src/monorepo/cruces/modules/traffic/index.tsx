import ThemeProvider from '@gsuite/shared/theme';
import { PageContent, DialogProvider } from '@gsuite/shared/ui';
import NotiStackProvider from '@gsuite/shared/providers/NotiStackProvider';
import { Container } from '@mui/material';

import Home from './pages/home';

export function App() {
  return (
    <ThemeProvider>
      <DialogProvider>
        <NotiStackProvider>
          <PageContent>
            <Container maxWidth={false}>
              <Home />
            </Container>
          </PageContent>
        </NotiStackProvider>
      </DialogProvider>
    </ThemeProvider>
  );
}

export default App;
