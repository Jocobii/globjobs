import { Container } from '@mui/material';

import {
  lazy, useEffect, useState,
} from 'react';
import { useParams } from 'react-router-dom';

import ErrorComponent from '@/components/ErrorComponent';
import OperationButtons from '@/pages/broker/components/OperationButtons';
import { useOperations, Variables } from './hooks/operation-list';

const Header = lazy(() => import('@/components/Header'));
const Table = lazy(() => import('@/components/Table'));

type Params = {
  status: string | undefined;
};

export default function Gops() {
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
  );
}
