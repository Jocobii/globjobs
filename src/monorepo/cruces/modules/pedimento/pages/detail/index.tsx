import { SnackbarProvider } from 'notistack';
import { Layout } from './components';

export function index() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Layout />
    </SnackbarProvider>
  );
}

export default index;
