import { Suspense } from 'react';

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

import { DataGrid } from '@gsuite/ui/DataGrid';
import Conditional from '@gsuite/ui/Conditional';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import { useDataGrid } from '@/hooks';
import { useDrawer } from '../hooks/useDrawer';
import { useModules } from '../api/getModules';

import DrawerForm from './DrawerForm';

export default function List() {
  const {
    rowId, handleDrawerOpen, handleEditDrawerClose, handleMenuClick,
  } = useDrawer();
  const { variables, handleDataGridEvents } = useDataGrid();
  const {
    data, refetch, isLoading, isFetching,
  } = useModules({ variables });

  const handleRefresh = () => refetch();

  return (
    <Container maxWidth="xl">
      <Conditional
        loadable={Boolean(rowId)}
        initialComponent={null}
      >
        <Suspense fallback={<h3>Loading...</h3>}>
          <DrawerForm
            open={Boolean(rowId)}
            onClose={handleEditDrawerClose}
            moduleId={rowId}
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
        {t('managements.modules.new')}
      </Button>
      <DataGrid
        pinnedColumns={{ right: ['actions'] }}
        loading={isLoading || isFetching}
        columns={[
          {
            field: 'environment',
            headerName: t('managements.environments.name'),
            width: 200,
            valueGetter({ value }) {
              return (value && value.name) || '';
            },
          },
          {
            field: 'name',
            headerName: t('managements.modules.name'),
            width: 200,
          },
          {
            field: 'description',
            headerName: t('managements.modules.description'),
            width: 200,
          },
          {
            field: 'component',
            headerName: t('managements.modules.component'),
            width: 200,
          },
          {
            field: 'active',
            headerName: t('managements.modules.active'),
            width: 100,
            renderCell({ value }) {
              return <Chip variant="outlined" color={value ? 'success' : 'error'} label={value ? 'Active' : 'Banned'} size="small" />;
            },
          },
          {
            field: 'route',
            headerName: t('managements.modules.route'),
            width: 200,
          },
          {
            field: 'endpoint',
            headerName: t('managements.modules.endpoint'),
            width: 200,
          },
          {
            field: 'icon',
            headerName: t('managements.modules.icon'),
            width: 200,
          },
          {
            field: 'toolbox',
            headerName: t('managements.modules.toolbox'),
            width: 150,
            renderCell({ value }) {
              return value ? <CheckCircleRoundedIcon style={{ color: 'green' }} /> : <RemoveCircleRoundedIcon style={{ color: 'red' }} />;
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
