import { useContext, useMemo } from 'react';

import { HelmetProvider } from 'react-helmet-async';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider as MUIThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import { DataContext } from '../contexts/AppContext';

import palette from './palette';
import CanaroTTF from './fonts/Canaro_W00_Medium.ttf'
import typography from './typography';
import breakpoints from './breakpoints';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

import { ThemeProviderProps, CustomTheme } from '../typings/theme';

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
      components: {
        MuiCssBaseline: {
          styleOverrides:  `
          @font-face {
            font-family: 'Canaro';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Canaro'), local('Canaro-Regular'), url(${CanaroTTF}) format('ttf');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
        }
      }
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
