import { useContext, useMemo } from 'react';

import { HelmetProvider } from 'react-helmet-async';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider as MUIThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import { DataContext } from '../contexts/AppContext';

import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

import { ThemeProviderProps, CustomTheme } from './types';

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode: themeMode } = useContext(DataContext);

  const isLight = themeMode === 'light';

  const themeOptions = useMemo<object>(
    () => ({
      palette: isLight ? palette.light : palette.dark,
      typography,
      breakpoints,
      shape: { borderRadius: 8 },
      shadows: isLight ? shadows.light : shadows.dark,
      customShadows: isLight ? customShadows.light : customShadows.dark,
    }),
    [isLight],
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme as CustomTheme);

  return (
    <HelmetProvider>
      <StyledEngineProvider injectFirst>
        <MUIThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MUIThemeProvider>
      </StyledEngineProvider>
    </HelmetProvider>
  );
}
