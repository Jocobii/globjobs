import { Pagination } from '@mui/material';

import { useGridApiContext } from '@mui/x-data-grid-pro';

export default function CustomPagination() {
  const apiRef = useGridApiContext();

  const { state } = apiRef.current;

  return (
    <Pagination
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(__, value) => apiRef.current.setPage(value - 1)}
    />
  );
}
