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
import CachedIcon from '@mui/icons-material/Cached';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import { useTranslation } from 'react-i18next';

import { DataGrid, ModelOptions } from '@gsuite/ui/DataGrid';

import { useHeadquarters } from './api/getHeadquarters';
import { useDeleteHeadquarter } from './api/deleteHeadquarter';

const DrawerForm = loadable(() => import('./components/HeadquarterForm'), { fallback: <h3>Loading...</h3> });

export default function List() {
  const [variables, setVariables] = useState({});
  const query = useHeadquarters({ variables });
  const { t } = useTranslation();
  const { mutateAsync } = useDeleteHeadquarter();
  const [headquarterId, setHeadquarterId] = useState<string | null>(null);

  const handleDrawerClose = () => setHeadquarterId(null);
  const handleDrawerOpen = () => setHeadquarterId('create');

  const handleMenuClick = (type: string, rowId: string) => {
    if (type === 'delete') {
      mutateAsync({ headquarterId: rowId });

      return;
    }

    setHeadquarterId(rowId);
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
        open={Boolean(headquarterId)}
        onClose={handleDrawerClose}
        headquarterId={headquarterId}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleDrawerOpen}
        sx={{ height: 60, width: 200, marginBottom: '1%' }}
      >
        {t('managements.headquarters.addNewHeadquarters')}
      </Button>
      <DataGrid
        pinnedColumns={{ right: ['actions'] }}
        getRowId={({ id }) => id}
        loading={query.isLoading || query.isFetching}
        columns={[{
          field: 'name',
          headerName: 'Name',
          flex: 1,
        }, {
          field: 'type',
          headerName: 'Type',
          width: 150,
        }, {
          field: 'phone',
          headerName: 'Phone number',
          width: 150,
        }, {
          field: 'active',
          headerName: 'Status',
          width: 120,
          renderCell({ value }) {
            return <Chip variant="outlined" color={value ? 'success' : 'error'} label={value ? 'Active' : 'Banned'} size="small" />;
          },
        }, {
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
