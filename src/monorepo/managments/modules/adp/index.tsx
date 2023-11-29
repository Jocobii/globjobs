import { SnackbarProvider } from 'notistack';
import ThemeProvider from '@/theme';
import ReactQuery from '@/providers/ReactQuery';
import ErrorBoundary from '@/components/ErrorBoundary';
import HomePage from './HomePage';

function Component() {
  return (
    <ErrorBoundary>
      <SnackbarProvider maxSnack={3}>
        <ReactQuery>
          <ThemeProvider>
            <HomePage />
          </ThemeProvider>
        </ReactQuery>
      </SnackbarProvider>
    </ErrorBoundary>
  );
}

export default Component;
