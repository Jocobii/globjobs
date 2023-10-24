import { SnackbarProvider } from 'notistack';

import ThemeProvider from '@gsuite/shared/theme';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';

import RoleList from './List';

export default function RolesHome() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ReactQuery>
        <ThemeProvider>
          <RoleList />
        </ThemeProvider>
      </ReactQuery>
    </SnackbarProvider>
  );
}
