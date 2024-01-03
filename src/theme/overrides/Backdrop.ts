import { alpha } from '@mui/material/styles';

import { CustomTheme } from '../types';

export default function Backdrop(theme: CustomTheme) {
  const varLow = alpha(theme.palette.grey[0], 0.48);
  const varHigh = alpha(theme.palette.grey[0], 1);

  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: [
            'rgb(255, 255, 255)',
            `-moz-linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
            `-webkit-linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
            `linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
          ],
          '&.MuiBackdrop-invisible': {
            background: 'transparent',
          },
        },
      },
    },
  };
}
