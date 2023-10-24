import { SnackbarProvider } from 'notistack';
import SnackList from '../ui/SnackList';

declare module 'notistack' {
  interface VariantOverrides {
    snackList: {
      customTexts: string[];
      title?: string;
    };
  }
}

interface Props {
  children: React.ReactNode;
}

function NotiStackProvider({ children }: Props) {
  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      Components={{
        snackList: SnackList,
      }}
    >
      {children}
    </SnackbarProvider>
  );
}

export default NotiStackProvider;
