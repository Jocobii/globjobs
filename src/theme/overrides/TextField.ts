import { CustomTheme } from '../../typings';

export default function TextField(theme: CustomTheme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.mode === 'light' ? '#000' : '#fff',
          color: theme.palette.mode === 'light' ? '#000' : '#fff',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.mode === 'light' ? '#000' : '#fff',
          '&:hover': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-error': {
            color: theme.palette.error.main,
            fontWeight: 600,
          },
        },
      },
    },
  };
}
