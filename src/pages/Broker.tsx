import { Container } from '@mui/material';
import {
  lazy, useEffect, useState,
} from 'react';
import { useParams } from 'react-router-dom';

import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorComponent from '@/components/ErrorComponent';
import OperationButtons from '@/components/OperationButtons';
import PageContent from '@/components/PageContent';
import { DataProvider } from '@/contexts/AppContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { useOperations, Variables } from '@/services/operations-list';
import ThemeProvider from '@/theme';

const Header = lazy(() => import('@/components/Header'));
const Table = lazy(() => import('@/components/Table'));

type Params = {
  status: string | undefined;
};

export function Gops() {
  const [statusActual, setStatusActual] = useState<string>();
  const [variables, setModelOptions] = useState<Variables>();

  const {
    pageSize,
    data,
    loading,
    error,
    setPageSize,
    handlePageChange,
    handleStatusChange,
    refetch,
  } = useOperations(variables);

  const { status } = useParams<keyof Params>() as Params;

  useEffect(() => {
    if (status !== statusActual) {
      setStatusActual(status);
      handleStatusChange(status);
    }
  }, [status, handleStatusChange, setStatusActual, statusActual]);
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationsProvider>
          <PageContent>
            <Container maxWidth={false}>
              <Header />
              <OperationButtons statusFilter={status} handleCreateOperation={refetch} />
              {
                error ? <ErrorComponent error={error.message} /> : (
                  <Table
                    setModelOptions={setModelOptions}
                    data={data}
                    loading={loading}
                    pageSize={pageSize}
                    handlePageChange={handlePageChange}
                    setPageSize={setPageSize}
                  />
                )
              }
            </Container>
          </PageContent>
        </NotificationsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <DataProvider>
      <ThemeProvider>
        <NotificationsProvider>
          <PageContent>
            <Container maxWidth={false}>
              <Gops />
            </Container>
          </PageContent>
        </NotificationsProvider>
      </ThemeProvider>
    </DataProvider>
  );
}

export default App;
