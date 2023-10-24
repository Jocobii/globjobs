import { CrossingProvider } from '@gsuite/shared/contexts';
import { DialogProvider } from '@gsuite/shared/ui';
import NotiStackProvider from '@gsuite/shared/providers/NotiStackProvider';
import { Container } from '@mui/material';
import Content from './components/Content';

export default function Detail() {
  return (
    <DialogProvider>
      <NotiStackProvider>
        <CrossingProvider isTrafficFlow>
          <Container maxWidth="xl">
            <Content />
          </Container>
        </CrossingProvider>
      </NotiStackProvider>
    </DialogProvider>
  );
}
