import { SnackbarProvider } from 'notistack';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';
import loadable from '@loadable/component';
import ErrorBoundary from '@gsuite/shared/ui/ErrorBoundary';

const HomePage = loadable(() => import('./Home'), { fallback: <h3>Loading...</h3> });

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
