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
    },
    initStatus: getValidStatus(status ?? ''),
  });

  if (status === 'documentsDelivered') refetch();

  return (
    <Table
      setVariables={setVariables}
      data={data?.crossingList}
      loading={loading}
      setStatus={handleStatusChange}
    />
  );
}

export default Content;
