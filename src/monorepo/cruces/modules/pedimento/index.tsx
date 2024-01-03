import { Suspense } from 'react';
import { SnackbarProvider } from 'notistack';

import ReactQuery from '@gsuite/shared/providers/ReactQuery';

import DataGridSkeleton from '@gsuite/ui/DataGridSkeleton';
import loadable from '@loadable/component';

const Home = loadable(() => import('./pages/home/index'), { fallback: <h3>Loading...</h3> });

export function App() {
  return (
    <Suspense
      fallback={<DataGridSkeleton />}
    >
        <SnackbarProvider maxSnack={3}>
          <ReactQuery>
            <Home />
          </ReactQuery>
        </SnackbarProvider>
    </Suspense>
  );
}

export default App;
