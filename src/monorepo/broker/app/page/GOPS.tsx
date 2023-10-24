import {
  lazy, useEffect, useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { ErrorBoundary } from '@gsuite/shared/ui';
import ThemeProvider from '@gsuite/shared/theme';
import PageContent from '@gsuite/shared/ui/PageContent';
import { NotificationsProvider } from '@gsuite/shared/contexts/NotificationsContext';
import ErrorComponent from '@gsuite/shared/ui/ErrorComponent';
import { useOperations, Variables } from '../../services/operations-list';
import OperationButtons from '../../components/OperationButtons';

const Header = lazy(() => import('../../components/Header'));
const Table = lazy(() => import('../../components/table'));

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

export default Gops;
