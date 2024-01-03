import { CustomTheme } from '../types';

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
