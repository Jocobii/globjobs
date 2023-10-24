import { Suspense, useEffect, useState } from 'react';
import {
  Container,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid-pro';
import { DataGrid, ModelOptions } from '@gsuite/ui/DataGrid';
import CachedIcon from '@mui/icons-material/Cached';
import { useTranslation } from 'react-i18next';
import CircleIcon from '@mui/icons-material/Circle';
import { DialogComponent } from '@gsuite/shared/ui';
import loadable from '@loadable/component';
import { grey } from '@mui/material/colors';
import CreateRoleForm from './components/CreateRoleForm';
import { Additional, useRolesSummary } from './api/getRolesSummary';
import { useDeleteRole } from './api/deleteRole';

const UpdateForm = loadable(() => import('./components/UpdateRole'), { fallback: <h3>Loading...</h3> });

export default function List() {
  const [variables, setVariables] = useState({});
  const query = useRolesSummary({ variables });
  const [open, setOpen] = useState<boolean>(false);
  const [select, setSelect] = useState<string>('');
  const [edit, setEdit] = useState<boolean>(false);
  const { t } = useTranslation();
  const { mutateAsync } = useDeleteRole();

  const handleMenuClick = (type: string, rowId: string) => {
    if (type === 'delete') {
      mutateAsync({ roleId: rowId });
      return;
    }
    if (type === 'edit') {
      setSelect(rowId);
      setEdit(true);
    }
  };

  const handleRefresh = () => query.refetch();

  const handleDataGridEvents = (event: ModelOptions) => {
    if (Object.keys(event).length > 0) {
      setVariables(event);
    }
  };

  const columnsDefault: GridColDef[] = [
    { field: 'name', headerName: 'Nombre del Rol', width: 150 },
    { field: 'modulesTotal', headerName: 'Modulos Activos:', width: 150 },
    { field: 'permissionsTotal', headerName: 'Permisos Activos:', width: 150 },
    { field: 'notificationsTotal', headerName: 'Notificaciones Activas', width: 180 },
    {
      field: 'actions',
      filterable: false,
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => (
        <Stack direction="row">
          <IconButton onClick={() => handleMenuClick('edit', String(record.id))}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleMenuClick('delete', String(record.id))}>
            <DeleteIcon color="error" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const [columns, setColumns] = useState(columnsDefault);

  useEffect(() => {
    const newColumns: GridColDef[] = [];
    if (
      query.data?.rows
      && query.data?.rows.length > 0
      && query.data?.rows[0]?.additional
    ) {
      query.data?.rows[0].additional?.forEach((a, index) => {
        newColumns.push(
          {
            field: `additional${index}`,
            headerName: a.name,
            width: 100,
            renderCell: (row) => {
              const { row: { additional } } = row;
              const data = additional.find((i:Additional) => i.name === a.name);
              if (data.value) {
                return <CircleIcon fontSize="small" color="success" />;
              }
              return <CircleIcon fontSize="small" style={{ color: grey[500] }} />;
            },
          },
        );
      });

      setColumns([...columnsDefault, ...newColumns]);
    }
    return () => {
      setColumns([]);
    };
  }, [query.data?.rows, variables]);

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setSelect('');
  };

  return (
    <Container maxWidth="xl" style={{ height: '100%' }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ height: 60, width: 200, marginBottom: '1%' }}
      >
        {t<string>('managements.roles.addRole')}
      </Button>
      {query.isLoading || query.isFetching ? (
        <h3>Loading...</h3>
      ) : (
        <DataGrid
          loading={query.isLoading || query.isFetching}
          pinnedColumns={{ right: ['actions'] }}
          pageSize={12}
          actions={[
            <IconButton key="more-id" size="large" onClick={handleRefresh}>
              <CachedIcon width={20} height={20} />
            </IconButton>,
          ]}
          columns={columns}
          rows={query.data?.rows || []}
          mode="server"
          serverOptions={{
            totalRowCount: query.data?.total || 0,
            handleChange: handleDataGridEvents,
          }}
        />
      )}

      <DialogComponent
        title="Nuevo Role"
        open={open}
        handleClose={handleClose}
        okButtonVisibility={false}
        cancelButtonVisibility={false}
        fullWidth
        maxWidth="lg"
      >
        <CreateRoleForm
          closeDialog={handleClose}
        />
      </DialogComponent>

      {select !== '' && (
      <DialogComponent
        title="Editar Role"
        open={edit}
        handleClose={handleClose}
        okButtonVisibility={false}
        cancelButtonVisibility={false}
        fullWidth
        maxWidth="lg"
      >
        <Suspense fallback={<h3>Loading...</h3>}>
          <UpdateForm
            closeDialog={handleClose}
            id={select}
            handleRefresh={handleRefresh}
          />
        </Suspense>
      </DialogComponent>
      )}
    </Container>
  );
}
