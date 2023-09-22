import { CustomTheme } from '@/typings/theme';

export default function Breadcrumbs(theme: CustomTheme) {
  return {
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          marginLeft: theme.spacing(2),
          marginRight: theme.spacing(2),
        },
      },
    },
  };
}
