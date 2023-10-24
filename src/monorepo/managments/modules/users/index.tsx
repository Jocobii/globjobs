import { SnackbarProvider } from 'notistack';

import ThemeProvider from '@gsuite/shared/theme';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';

import loadable from '@loadable/component';

const UsersList = loadable(() => import('./List'), { fallback: <h3>Loading...</h3> });

export default function UsersHome() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ReactQuery>
        <ThemeProvider>
          <UsersList />
        </ThemeProvider>
      </ReactQuery>
    </SnackbarProvider>
  );
}
