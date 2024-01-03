import { SnackbarProvider } from 'notistack';

import ReactQuery from '@gsuite/shared/providers/ReactQuery';

import loadable from '@loadable/component';

const UsersList = loadable(() => import('./List'), { fallback: <h3>Loading...</h3> });

export default function UsersHome() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ReactQuery>
        <UsersList />
      </ReactQuery>
    </SnackbarProvider>
  );
}
