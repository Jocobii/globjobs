import { Suspense } from 'react';
import loadable from '@loadable/component';
import {
  Container,
  Button,
  IconButton,
  Stack,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { t } from 'i18next';
import _ from 'lodash';

import { DataGrid } from '@gsuite/ui/DataGrid';
import Conditional from '@gsuite/ui/Conditional';
import { useDataGrid } from '@/hooks';

import { useMenus } from '../api/getMenus';
import { useDrawer } from '../hooks/useDrawer';

const UpdateForm = loadable(() => import('./DrawerForm'), { fallback: <h3>Loading...</h3> });

export default function List() {
  const { variables, handleDataGridEvents } = useDataGrid();
  const {
    rowId, handleMenuClick, handleEditDrawerClose, handleDrawerOpen,
  } = useDrawer();
  const { data, refetch, loading } = useMenus({ variables });

  const handleRefresh = () => refetch();

  return (
    <Container maxWidth="xl">
      <Conditional
        loadable={Boolean(rowId)}
        initialComponent={null}
      >
        <Suspense fallback={<h3>Loading...</h3>}>
          <UpdateForm
            open={Boolean(rowId)}
            onClose={handleEditDrawerClose}
            rowId={rowId}
          />
        </Suspense>
      </Conditional>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleDrawerOpen}
        sx={{ height: 60, width: 200, marginBottom: '1%' }}
      >
        {t('managements.menu.new')}
      </Button>
      <DataGrid
        pinnedColumns={{ right: ['actions'] }}
        loading={loading}
        columns={[
          {
            field: 'name',
            headerName: t('managements.menu.name'),
            width: 200,
          },
          {
            field: 'icon',
            headerName: t('managements.menu.icon'),
            width: 200,
          },
          {
            field: 'active',
            headerName: t('managements.menu.active'),
            width: 100,
            renderCell({ value }) {
              return <Chip variant="outlined" color={value ? 'success' : 'error'} label={value ? 'Active' : 'Banned'} size="small" />;
            },
          },
          {
            field: 'environment',
            headerName: t('managements.environments.name'),
            width: 200,
            valueGetter: (params) => {
              const { row } = params;
              return _.get(row, 'environment.name', '');
            },
          },
          {
            field: 'modules',
            headerName: t('managements.modules.childrens'),
            width: 200,
            renderCell: ({ value }) => t('managements.menu.modulesLength', { modules: value.length }),
          },
          {
            field: 'actions',
            headerName: '',
            align: 'right',
            filterable: false,
            sortable: false,
            renderCell: (record) => (
              <Stack direction="row">
                <IconButton key={`edit-${record.id}`} onClick={() => handleMenuClick('edit', String(record.id))}>
                  <EditIcon />
                </IconButton>
                <IconButton key={`delete-${record.id}`} onClick={() => handleMenuClick('delete', String(record.id))}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ),
          }]}
        rows={data?.rows}
        actions={[
          <IconButton key="more-id" size="large" onClick={handleRefresh} disabled={loading}>
            <CachedIcon width={20} height={20} />
          </IconButton>,
        ]}
        mode="server"
        serverOptions={{
          totalRowCount: data?.total ?? 0,
          handleChange: handleDataGridEvents,
        }}
      />
    </Container>
  );
}
