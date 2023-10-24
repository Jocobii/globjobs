import { useState } from 'react';
import {
  Container,
  Button,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import CachedIcon from '@mui/icons-material/Cached';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@gsuite/ui/DataGrid';
import Conditional from '@gsuite/ui/Conditional';
import { GridColumns } from '@mui/x-data-grid-pro';
import loadable from '@loadable/component';

import { useGetAreas } from './api/getAreas';
import { useDeleteArea } from './api/deleteArea';

const CreateAreaDrawer = loadable(() => import('./components/CreateAreaDrawer'), { fallback: <h3>Loading...</h3> });
const UpdateAreaDrawer = loadable(() => import('./components/UpdateAreaDrawer'), { fallback: <h3>Loading...</h3> });

export default function List() {
  const [variables, setVariables] = useState({});
  const query = useGetAreas({ variables });
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [areaId, setAreaId] = useState<string>('');
  const handleDrawerClose = () => setOpenDrawer(false);
  const handleDrawerOpen = () => setOpenDrawer(true);
  const handleEditDrawerClose = () => setAreaId('');
  const { mutateAsync } = useDeleteArea();

  const handleMenuClick = async (type: string, rowId: string) => {
    if (type === 'delete') {
      await mutateAsync({ areaId: rowId });

      return;
    }
    setAreaId(rowId);
  };

  const handleRefresh = () => query.refetch();

  const handleDataGridEvents = (event: any) => {
    if (Object.keys(event).length > 0) {
      setVariables(event);
    }
  };

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
    <Container maxWidth="xl">
      <Conditional
        loadable={openDrawer}
        initialComponent={null}
      >
        <CreateAreaDrawer
          open={openDrawer}
          onClose={handleDrawerClose}
        />
      </Conditional>
      <Conditional
        loadable={Boolean(areaId)}
        initialComponent={null}
      >
        <UpdateAreaDrawer
          open={Boolean(areaId)}
          onClose={handleEditDrawerClose}
          areaId={areaId}
        />
      </Conditional>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleDrawerOpen}
        sx={{ height: 60, width: 200, marginBottom: '1%' }}
      >
        {t<string>('managements.areas.addNewArea')}
      </Button>
      <DataGrid
        loading={query.isLoading || query.isFetching}
        getRowId={({ id }) => id}
        pinnedColumns={{ right: ['actions'] }}
        columns={columns}
        rows={query.data?.rows || []}
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
