import { Suspense } from 'react';
import { SnackbarProvider } from 'notistack';

import ThemeProvider from '@gsuite/shared/theme';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';
import LoadingBackdrop from '@gsuite/ui/LoadingBackdrop';

import DetailContent from './components/DetailContent';

export default function Detail({ edit = false }: { edit?: boolean }) {
  return (
    <Suspense fallback={<LoadingBackdrop />}>
      <SnackbarProvider maxSnack={3}>
        <ReactQuery>
          <ThemeProvider>
            <DetailContent edit={edit} />
          </ThemeProvider>
        </ReactQuery>
      </SnackbarProvider>
    </Suspense>
  );
}
