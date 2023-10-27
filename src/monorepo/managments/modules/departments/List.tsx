import { useState } from 'react';
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

import { DataGrid, ModelOptions } from '@gsuite/ui/DataGrid';

import { useDepartments } from './api/getDepartments';
import { useDeleteDepartment } from './api/deleteDepartment';

const DrawerForm = loadable(() => import('./components/DepartmentsForm'), { fallback: <h3>Loading...</h3> });

export default function List() {
  const { t } = useTranslation();
  const [variables, setVariables] = useState({});
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const { mutateAsync } = useDeleteDepartment();
  const query = useDepartments({ variables });

  const handleDrawerClose = () => setDepartmentId(null);
  const handleDrawerOpen = () => setDepartmentId('create');

  const handleMenuClick = (type: string, rowId: string) => {
    if (type === 'delete') {
      mutateAsync({ departmentId: rowId });
      return;
    }

    setDepartmentId(rowId);
  };

  const handleRefresh = () => query.refetch();

  const handleDataGridEvents = (event: ModelOptions) => {
    if (Object.keys(event).length > 0) {
      setVariables(event);
    }
  };

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
        {t('managements.deparments.addNewDepartment')}
      </Button>
      <DataGrid
        getRowId={({ id }) => id}
        loading={query.isLoading || query.isFetching}
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
        rows={query.data?.rows}
        actions={[
          <IconButton key="more-id" size="large" onClick={handleRefresh} disabled={query.isFetching}>
            <CachedIcon width={20} height={20} />
          </IconButton>,
        ]}
        mode="server"
        serverOptions={{
          totalRowCount: query.data?.total || 0,
          handleChange: handleDataGridEvents,
        }}
      />
    </Container>
  );
}
