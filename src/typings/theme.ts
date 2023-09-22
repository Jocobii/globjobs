import type { Theme } from '@mui/material';

import type palette from '../theme/palette';
import type typography from '../theme/typography';
import type breakpoints from '../theme/breakpoints';
import type { default as shadows, customShadows } from '../theme/shadows';

export type ThemeProviderProps = {
  children: React.ReactNode;
};

export type CustomTheme = {
  palette: typeof palette.light;
  typography: typeof typography;
  breakpoints: typeof breakpoints;
  shadows: typeof shadows.light;
  customShadows: typeof customShadows.light;
} & Theme;

export type Color = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
