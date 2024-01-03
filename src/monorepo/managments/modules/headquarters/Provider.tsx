import loadable from '@loadable/component';
import { SnackbarProvider } from 'notistack';

import ReactQuery from '@gsuite/shared/providers/ReactQuery';

import DataGridSkeleton from '@gsuite/ui/DataGridSkeleton';

const ListPage = loadable(() => import('./List'), { fallback: <DataGridSkeleton /> });

export default function Provider() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ReactQuery>
        <ListPage />
      </ReactQuery>
    </SnackbarProvider>
  );
}
