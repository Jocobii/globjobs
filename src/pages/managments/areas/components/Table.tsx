import {
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import { RefreshButton } from '@/components';
import { DataGrid } from '@gsuite/ui/DataGrid';
import { GridColumns } from '@mui/x-data-grid-pro';

interface Props {
  data: any;
  handleDataGridEvents: any;
  handleMenuClick: any;
  handleRefresh: any;
}

export function Table({
  data,
  handleDataGridEvents,
  handleMenuClick,
  handleRefresh,
}: Props) {

  const columns: GridColumns = [{
    field: 'name',
    headerName: 'Name',
    flex: 1,
  }, {
    field: 'abbreviation',
    headerName: 'Abbreviation',
    width: 150,
  }, {
    field: 'department',
    headerName: 'Department',
    width: 150,
    renderCell({ value }) {
      return value.name;
    },
  }, {
    field: 'active',
    headerName: 'Status',
    width: 120,
    renderCell({ value }) {
      return <Chip variant="outlined" color={value ? 'success' : 'error'} label={value ? 'Active' : 'Banned'} size="small" />;
    },
  }, {
    field: 'actions',
    headerName: 'Actions',
    align: 'right',
    filterable: false,
    sortable: false,
    renderCell: (record) => (
      <Stack direction="row">
        <IconButton onClick={() => handleMenuClick('edit', String(record.id))}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleMenuClick('delete', String(record.id))}>
          <DeleteOutlineRounded />
        </IconButton>
      </Stack>
    ),
  }];

  return (
    <DataGrid
      loading={data.isLoading || data.isFetching}
      getRowId={({ id }) => id}
      pinnedColumns={{ right: ['actions'] }}
      columns={columns}
      rows={data.data?.rows || []}
      actions={[ <RefreshButton key="refresh-button" handleRefresh={handleRefresh} disabled={data.isFetching} /> ]}
      mode="server"
      serverOptions={{
        totalRowCount: data.data?.total || 0,
        handleChange: handleDataGridEvents,
      }}
    />
  );
}

export default Table;
