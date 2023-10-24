import { Suspense } from 'react';
import { SnackbarProvider } from 'notistack';

import ThemeProvider from '@gsuite/shared/theme';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';
import LoadingBackdrop from '@gsuite/ui/LoadingBackdrop';

import loadable from '@loadable/component';

const List = loadable(() => import('./List'), { fallback: <LoadingBackdrop /> });

export default function CompaniesHome() {
  return (
    <Suspense fallback={<LoadingBackdrop />}>
      <SnackbarProvider maxSnack={3}>
        <ReactQuery>
          <ThemeProvider>
            <List />
          </ThemeProvider>
        </ReactQuery>
      </SnackbarProvider>
    </Suspense>
  );
}
