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
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import CachedIcon from '@mui/icons-material/Cached';
import { t } from 'i18next';

import { DataGrid } from '@gsuite/ui/DataGrid';
import { usePagination } from '@/hooks'

import { useRules } from '../api/getRules';
import { useDrawer } from '../hooks/useDrawer';

const DrawerForm = loadable(() => import('./DrawerForm'), { fallback: <h3>Loading...</h3> });

export default function List() {
  const { variables, handleDataGridEvents } = usePagination();
  const { data, refetch, isLoading, isFetching } = useRules({ variables });
  const { ruleId, handleDrawerOpen, handleDrawerClose, handleMenuClick } = useDrawer();

  const handleRefresh = () => refetch();

  return (
    <Container maxWidth="xl">
      <DrawerForm
        open={Boolean(ruleId)}
        onClose={handleDrawerClose}
        ruleId={ruleId}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleDrawerOpen}
        sx={{ height: 60, width: 200, marginBottom: '1%' }}
      >
        {t('managements.rules.addNewRule')}
      </Button>
      <DataGrid
        loading={isLoading || isFetching}
        pinnedColumns={{ right: ['actions'] }}
        columns={[{
          field: 'section',
          headerName: 'Section',
          width: 150,
        }, {
          field: 'field',
          headerName: 'Field',
          width: 150,
        }, {
          field: 'type',
          headerName: 'Type',
          width: 150,
        }, {
          field: 'message',
          headerName: 'Message',
          flex: 1,
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
