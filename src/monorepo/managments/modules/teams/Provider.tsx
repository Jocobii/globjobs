import { Suspense } from 'react';
import loadable from '@loadable/component';
import { SnackbarProvider } from 'notistack';

import ThemeProvider from '@gsuite/shared/theme';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';

import DataGridSkeleton from '@gsuite/ui/DataGridSkeleton';

const ListPage = loadable(() => import('./List'), { fallback: <DataGridSkeleton /> });

export default function Provider() {
  return (
    <Suspense
      fallback={<DataGridSkeleton />}
    >
      <ThemeProvider>
        <SnackbarProvider maxSnack={3}>
          <ReactQuery>
            <ListPage />
          </ReactQuery>
        </SnackbarProvider>
      </ThemeProvider>
    </Suspense>
  );
}
