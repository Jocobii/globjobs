import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCrucesList } from '../../services/cruces-list';
import Table from './components/Table';

const getValidStatus = (status: string) => {
  switch (status) {
    case 'documentsReady':
      return 'documentsReady';
    case 'documentsDelivered':
      return 'documentsDelivered';
    default:
      return 'documentsReady';
  }
};

function Content() {
  const { status } = useParams();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [variables, setVariables] = useState({});

  const {
    data,
    loading,
    handleStatusChange,
    refetch,
  } = useCrucesList({
    variables: {
      ...variables,
      filterBy: 3,
      page,
      pageSize,
    },
    initStatus: getValidStatus(status ?? ''),
  });

  if (status === 'documentsDelivered') refetch();

  return (
    <Table
      handlePageChange={setPage}
      setPageSize={setPageSize}
      setVariables={setVariables}
      data={data?.crossingList}
      loading={loading}
      setStatus={handleStatusChange}
    />
  );
}

export default Content;
