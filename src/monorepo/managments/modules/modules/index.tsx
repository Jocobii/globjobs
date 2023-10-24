import { SnackbarProvider } from 'notistack';

import ThemeProvider from '@gsuite/shared/theme';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';
import loadable from '@loadable/component';
import ErrorBoundary from '@gsuite/shared/ui/ErrorBoundary';

const ModulesTable = loadable(() => import('./List'), { fallback: <h3>Loading...</h3> });

export default function ModulesHome() {
  return (
    <ErrorBoundary>
      <SnackbarProvider maxSnack={3}>
        <ReactQuery>
          <ThemeProvider>
            <ModulesTable />
          </ThemeProvider>
        </ReactQuery>
      </SnackbarProvider>
    </ErrorBoundary>
  );
}
