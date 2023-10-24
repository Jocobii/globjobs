import { SnackbarProvider } from 'notistack';

import ThemeProvider from '@gsuite/shared/theme';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';
import loadable from '@loadable/component';
import ErrorBoundary from '@gsuite/shared/ui/ErrorBoundary';

const MainTable = loadable(() => import('./List'), { fallback: <h3>Loading...</h3> });

export default function MenuHome() {
  return (
    <ErrorBoundary>
      <SnackbarProvider maxSnack={3}>
        <ReactQuery>
          <ThemeProvider>
            <MainTable />
          </ThemeProvider>
        </ReactQuery>
      </SnackbarProvider>
    </ErrorBoundary>
  );
}
