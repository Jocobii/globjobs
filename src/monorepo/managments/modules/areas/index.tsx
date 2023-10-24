import { SnackbarProvider } from 'notistack';
import loadable from '@loadable/component';
import ThemeProvider from '@gsuite/shared/theme';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';

import DataGridSkeleton from './components/DataGridSkeleton';

const AreasList = loadable(() => import('./List'), { fallback: <DataGridSkeleton /> });

export default function AreasHome() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ReactQuery>
        <ThemeProvider>
          <AreasList />
        </ThemeProvider>
      </ReactQuery>
    </SnackbarProvider>
  );
}
