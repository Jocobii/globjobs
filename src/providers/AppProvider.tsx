import { BrowserRouter } from 'react-router-dom';
import { LicenseInfo } from '@mui/x-license-pro';

import { DataProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotiStackProvider } from '@/providers'
import ReactQuery from './ReactQuery';
import ThemeProvider from '@/theme';
import { MuiLicense } from '@/utils/license';

import '../i18n';
import GraphQLProvider from './GraphQLProvider';
import ErrorBoundary from '@gsuite/shared/ui/ErrorBoundary';

type AppProviderProps = {
  children: React.ReactNode;
};

LicenseInfo.setLicenseKey(MuiLicense);

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <BrowserRouter>
      <ReactQuery>
        <ErrorBoundary>
          <GraphQLProvider>
            <AuthProvider>
              <DataProvider>
                <ThemeProvider>
                  <NotiStackProvider>
                    {children}
                  </NotiStackProvider>
                </ThemeProvider>
              </DataProvider>
            </AuthProvider>
          </GraphQLProvider>
        </ErrorBoundary>
      </ReactQuery>
    </BrowserRouter>
  );
}
