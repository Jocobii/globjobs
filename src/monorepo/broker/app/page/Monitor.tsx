import {
  Box, Container, Typography,
} from '@mui/material';
import { lazy } from 'react';
import ThemeProvider from '@gsuite/shared/theme';
import { NotificationsProvider } from '@gsuite/shared/contexts/NotificationsContext';
import { PageContent } from '@gsuite/shared/ui';
import { DataProvider } from '@gsuite/shared/contexts/AppContext';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { useTranslation } from 'react-i18next';

import { DataGrid } from '@gsuite/ui/DataGrid';
import DataGridSkeleton from '../../components/DataGridSkeleto';
import { useMonitor } from '../../services/monitor';
import { useMonitors } from '../hooks/monitor';

const Detail = lazy(() => import('../../components/Detail'));

export function Monitor() {
  const query = useMonitor();
  const { t } = useTranslation();
  const { cards } = useMonitors();

  if (query.loading) {
    return <DataGridSkeleton />;
  }

  if (!query.data) {
    return null;
  }

  return (
    <ThemeProvider>
      <DataProvider>
        <NotificationsProvider>
          <PageContent>
            <Container maxWidth={false}>
              <Typography variant="h4" color="primary">Monitor:</Typography>
              <Box
                sx={{
                  p: 3,
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                    lg: 'repeat(6, 1fr)',
                  },
                }}
              >
                {cards.map(({
                  quantity, name, color, icon,
                }) => (
                  <Detail
                    key={name}
                    quantity={quantity}
                    name={name}
                    color={color}
                    icon={icon}
                    onClick={() => ''}
                  />
                ))}
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gap: 6,
                  gridTemplateColumns: {
                    sx: 'repeat(1, 1fr)',
                  },
                  '& .red': {
                    backgroundColor: '#FF4242',
                  },
                }}
              >
                <DataGrid
                  getRowId={({ id: _id }) => _id}
                  columns={[{
                    headerName: t<string>('broker.tableMonitor.week'),
                    width: 200,
                    field: 'week',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.gOps'),
                    width: 200,
                    field: 'gops',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.warehouse'),
                    width: 200,
                    field: 'warehouse',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.estimate'),
                    minWidth: 200,
                    maxWidth: 400,
                    field: 'estimation',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.court'),
                    width: 200,
                    field: 'court',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.shippingOrder'),
                    width: 200,
                    field: 'shippingOrder',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.type'),
                    width: 200,
                    field: 'type',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.client'),
                    width: 200,
                    field: 'client',
                  },
                  {
                    headerName: '7501',
                    width: 100,
                    field: 'rule7501',
                    renderCell: (row) => {
                      const { value } = row;
                      if (value) {
                        return <CheckIcon fontSize="large" color="success" />;
                      }
                      return <CloseIcon fontSize="large" color="error" />;
                    },
                  },
                  {
                    headerName: '321',
                    width: 100,
                    field: 'rule321',
                    renderCell: (row) => {
                      const { value } = row;
                      if (value) {
                        return <CheckIcon fontSize="large" color="success" />;
                      }
                      return <CloseIcon fontSize="large" color="error" />;
                    },
                  },
                  {
                    headerName: '8501',
                    width: 100,
                    field: 'rule8501',
                    renderCell: (row) => {
                      const { value } = row;
                      if (value) {
                        return <CheckIcon fontSize="large" color="success" />;
                      }
                      return <CloseIcon fontSize="large" color="error" />;
                    },
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.transit'),
                    width: 200,
                    field: 'transit',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.driveType'),
                    width: 200,
                    field: 'driveType',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.economic'),
                    width: 200,
                    field: 'economic',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.unitArrival'),
                    width: 200,
                    field: 'unitArrival',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.documentGeneration'),
                    width: 200,
                    field: 'documentGeneration',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.immex'),
                    width: 200,
                    field: 'immex',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.invoice'),
                    width: 200,
                    field: 'invoice',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.sentDocuments'),
                    width: 200,
                    field: 'sentDocuments',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.documentsDelivered'),
                    width: 200,
                    field: 'documentsDelivered',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.unitDispatch'),
                    width: 200,
                    field: 'unitDispatch',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.moduleMX'),
                    width: 200,
                    field: 'moduleMX',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.moduleUSA'),
                    width: 200,
                    field: 'moduleUSA',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.weighingMachine'),
                    width: 200,
                    field: 'weighingMachine',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.arrivalAlmUsa'),
                    width: 200,
                    field: 'arrivalAlmUsa',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.offloadAlmUsa'),
                    width: 200,
                    field: 'offloadAlmUsa',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.delivered'),
                    width: 200,
                    field: 'delivered',
                  },
                  {
                    headerName: t<string>('broker.tableMonitor.totalTime'),
                    width: 200,
                    field: 'totalTime',
                  }]}
                  rows={query.data.monitors.rows}
                />
              </Box>
            </Container>
          </PageContent>
        </NotificationsProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default Monitor;
