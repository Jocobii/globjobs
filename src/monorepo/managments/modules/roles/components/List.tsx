import { useEffect, useState } from 'react';
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
import { DataGrid } from '@gsuite/ui/DataGrid';
import CachedIcon from '@mui/icons-material/Cached';
import { t } from 'i18next';
import CircleIcon from '@mui/icons-material/Circle';
import { grey } from '@mui/material/colors';
import { useDataGrid } from '@/hooks';
import { Additional, useRolesSummary } from '../api/getRolesSummary';
import DrawerForm from './DrawerForm';
import useDrawer from '../hooks/useDrawer';

export default function List() {
  const { variables, handleDataGridEvents } = useDataGrid();
  const {
    roleId, handleMenuClick, handleEditDrawerClose, handleDrawerOpen,
  } = useDrawer();
  const {
    refetch, data, isLoading, isFetching,
  } = useRolesSummary({ variables });

  const handleRefresh = () => refetch();

  const [columns, setColumns] = useState<GridColDef[]>([
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
  ]);

  useEffect(() => {
    const newColumns: GridColDef[] = columns;
    if (
      data?.rows
      && data?.rows.length > 0
      && data?.rows[0]?.additional
    ) {
      data?.rows[0].additional?.forEach((a, index) => {
        newColumns.push(
          {
            field: `additional${index}`,
            headerName: a.name,
            width: 100,
            renderCell: (row) => {
              const { row: { additional } } = row;
              // eslint-disable-next-line @typescript-eslint/no-shadow
              const data = additional.find((i:Additional) => i.name === a.name);
              if (data.value) {
                return <CircleIcon fontSize="small" color="success" />;
              }
              return <CircleIcon fontSize="small" style={{ color: grey[500] }} />;
            },
          },
        );
      });

      setColumns(newColumns);
    }
    return () => {
      setColumns([]);
    };
  }, [data?.rows, variables, columns]);

  return (
    <Container maxWidth="xl" style={{ height: '100%' }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleDrawerOpen}
        sx={{ height: 60, width: 200, marginBottom: '1%' }}
      >
        {t('managements.roles.addRole')}
      </Button>
      {isLoading || isFetching ? (
        <h3>Loading...</h3>
      ) : (
        <DataGrid
          loading={isLoading || isFetching}
          pinnedColumns={{ right: ['actions'] }}
          pageSize={12}
          actions={[
            <IconButton key="more-id" size="large" onClick={handleRefresh}>
              <CachedIcon width={20} height={20} />
            </IconButton>,
          ]}
          columns={columns}
          rows={data?.rows || []}
          mode="server"
          serverOptions={{
            totalRowCount: data?.total || 0,
            handleChange: handleDataGridEvents,
          }}
        />
      )}
      <DrawerForm onClose={handleEditDrawerClose} open={!!roleId} roleId={roleId} />
    </Container>
  );
}
