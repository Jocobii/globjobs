import { useMemo, useContext } from 'react';

import { CssBaseline, ThemeOptions } from '@mui/material';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';

import { DataContext, ContextValues } from '@gsuite/shared/contexts/AppContext';

import palette from './palette';
import typography from './typography';

type ThemeConfigType = {
  children: JSX.Element;
};

function Theme({ children }: ThemeConfigType) {
  const { mode } = useContext<ContextValues>(DataContext);

  const themeOptions = useMemo(
    () => ({
      palette: {
        ...palette[mode],
      },
      typography,
    }),
    [mode],
  );

  const theme = createTheme(themeOptions as ThemeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default Theme;
