import loadable from '@loadable/component';
import {
  Container,
  Button,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import CachedIcon from '@mui/icons-material/Cached';
import { DataGrid } from '@gsuite/ui/DataGrid';
import { useDataGrid } from '@/hooks';

import { useDepartments } from '../api/getDepartments';
import { useDrawer } from '../hooks/useDrawer';

const DrawerForm = loadable(() => import('./DrawerForm'), { fallback: <h3>Loading...</h3> });

export default function List() {
  const { t } = useTranslation();
  const { variables, handleDataGridEvents } = useDataGrid();
  const {
    departmentId, handleDrawerClose, handleDrawerOpen, handleMenuClick,
  } = useDrawer();
  const {
    data, refetch, isLoading, isFetching,
  } = useDepartments({ variables });

  const handleRefresh = () => refetch();

  return (
    <Container maxWidth="xl">
      <DrawerForm
        open={Boolean(departmentId)}
        onClose={handleDrawerClose}
        departmentId={departmentId}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleDrawerOpen}
        sx={{ height: 60, width: 200, marginBottom: '1%' }}
      >
        {t('managements.departments.addNewDepartment')}
      </Button>
      <DataGrid
        getRowId={({ id }) => id}
        loading={isLoading || isFetching}
        pinnedColumns={{ right: ['actions'] }}
        columns={[
          {
            field: 'name',
            headerName: 'Name',
            flex: 1,
          },
          {
            field: 'abbreviation',
            headerName: 'Abbreviation',
            flex: 1,
          },
          {
            field: 'email',
            headerName: 'Email',
            flex: 1,
          },
          {
            field: 'active',
            headerName: 'Status',
            width: 120,
            renderCell({ value }) {
              return <Chip variant="outlined" color={value ? 'success' : 'error'} label={value ? 'Active' : 'Banned'} size="small" />;
            },
          },
          {
            field: 'actions',
            headerName: '',
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
          },
        ]}
        rows={data?.rows}
        actions={[
          <IconButton key="more-id" size="large" onClick={handleRefresh} disabled={isFetching}>
            <CachedIcon width={20} height={20} />
          </IconButton>,
        ]}
        mode="server"
        serverOptions={{
          totalRowCount: data?.total || 0,
          handleChange: handleDataGridEvents,
        }}
      />
    </Container>
  );
}
