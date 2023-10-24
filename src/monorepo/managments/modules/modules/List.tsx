import { useState, Suspense } from 'react';
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
import { useTranslation } from 'react-i18next';

import { DataGrid } from '@gsuite/ui/DataGrid';
import Conditional from '@gsuite/ui/Conditional';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import { useModules } from './api/getModules';
import { useDeleteModule } from './api/deleteModule';

const CreateForm = loadable(() => import('./components/create-form'), { fallback: <h3>Loading...</h3> });
const UpdateForm = loadable(() => import('./components/update-form'), { fallback: <h3>Loading...</h3> });

export default function List() {
  const [variables, setVariables] = useState({});
  const query = useModules({ variables });
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rowId, setRowId] = useState < string >('');
  const { mutateAsync } = useDeleteModule();

  const handleDrawerClose = () => setOpenDrawer(false);
  const handleDrawerOpen = () => setOpenDrawer(true);

  const handleEditDrawerClose = () => setRowId('');

  const handleMenuClick = (type: string, id: string) => {
    if (type === 'delete') {
      mutateAsync({ moduleId: id });

      return;
    }

    setRowId(id);
  };

  const handleRefresh = () => query.refetch();

  const handleDataGridEvents = (event: any) => {
    if (Object.keys(event).length > 0) {
      setVariables(event);
    }
  };

  return (
    <Container maxWidth="xl">
      <Conditional
        loadable={openDrawer}
        initialComponent={null}
      >
        <CreateForm
          open={openDrawer}
          onClose={handleDrawerClose}
        />
      </Conditional>
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
        {t<string>('managements.modules.new')}
      </Button>
      <DataGrid
        pinnedColumns={{ right: ['actions'] }}
        loading={query.isLoading || query.isFetching}
        columns={[
          {
            field: 'environment',
            headerName: t < string >('managements.environments.name'),
            width: 200,
            valueGetter({ value }) {
              return (value && value.name) || '';
            },
          },
          {
            field: 'name',
            headerName: t < string >('managements.modules.name'),
            width: 200,
          },
          {
            field: 'description',
            headerName: t < string >('managements.modules.description'),
            width: 200,
          },
          {
            field: 'component',
            headerName: t < string >('managements.modules.component'),
            width: 200,
          },
          {
            field: 'active',
            headerName: t < string >('managements.modules.active'),
            width: 100,
            renderCell({ value }) {
              return <Chip variant="outlined" color={value ? 'success' : 'error'} label={value ? 'Active' : 'Banned'} size="small" />;
            },
          },
          {
            field: 'route',
            headerName: t < string >('managements.modules.route'),
            width: 200,
          },
          {
            field: 'endpoint',
            headerName: t < string >('managements.modules.endpoint'),
            width: 200,
          },
          {
            field: 'icon',
            headerName: t < string >('managements.modules.icon'),
            width: 200,
          },
          {
            field: 'toolbox',
            headerName: t < string >('managements.modules.toolbox'),
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
