import { Theme } from '@mui/material';

import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import shadows, { customShadows } from './shadows';

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
