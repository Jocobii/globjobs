import { CustomTheme } from '../../typings/theme';

export default function Stepper(theme: CustomTheme) {
  return {
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: theme.palette.divider,
        },
      },
    },
  };
}
