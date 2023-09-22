import { SnackbarProvider } from 'notistack';
import { StyledMaterialDesignContent } from '../theme/overrides/SnackMessages'
import { SnackList } from '../components';

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
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        warning: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent,
      }}
    >
      {children}
    </SnackbarProvider>
  );
}

export default NotiStackProvider;
