import { SnackbarProvider } from 'notistack';
import ReactQuery from '@/providers/ReactQuery';
import ErrorBoundary from '@/components/ErrorBoundary';
import HomePage from './HomePage';

function Component() {
  return (
    <ErrorBoundary>
      <SnackbarProvider maxSnack={3}>
        <ReactQuery>
          <HomePage />
        </ReactQuery>
      </SnackbarProvider>
    </ErrorBoundary>
  );
}

export default Component;
