import { DataGrid } from '@gsuite/ui/DataGrid';
import { GridColumns } from '@mui/x-data-grid-pro';

export default function List() {
  const data = [
    { id: Math.random() * Math.random(), name: 'Jocobi', emailAddress: 'example1@domain.com' },
    { id: Math.random() * Math.random(), name: 'Pablo', emailAddress: 'example2@domain.com' },
    { id: Math.random() * Math.random(), name: 'Uziel', emailAddress: 'example3@domain.com' },
  ];

  const columns: GridColumns = [{
    field: 'name',
    headerName: 'Name',
    flex: 1,
  }, {
    field: 'emailAddress',
    headerName: 'Email',
    flex: 1,
  }];

  const handleDataGridEvents = () => {};

  return (
    <DataGrid
      loading={false}
      getRowId={({ id }) => id}
      columns={columns}
      rows={data}
      mode="server"
      serverOptions={{
        totalRowCount: data.length,
        handleChange: handleDataGridEvents,
      }}
    />
  );
}
