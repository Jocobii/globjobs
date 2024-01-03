import {
  Box, Container, Grid, Typography,
} from '@mui/material';
import { lazy } from 'react';
import clsx from 'clsx';
import { NotificationsProvider } from '@gsuite/shared/contexts/NotificationsContext';
import { PageContent } from '@gsuite/shared/ui';
import { useReferences } from '../../services/referencesGops';

const TableReferences = lazy(() => import('../../components/TableReferences'));

export function References() {
  const { data } = useReferences();

  const applyStyle = ({ row }: { row: { id: string, gop: string } }) => clsx('status-line', {
    red: row.gop === null,
  });

  const columns = [
    {
      field: 'reference',
      headerName: 'References',
      flex: 1,
      cellClassName: applyStyle,
    },
    {
      field: 'gop',
      headerName: 'G-OP',
      flex: 1,
      cellClassName: applyStyle,
    },
  ];

  return (
    <NotificationsProvider>
      <PageContent>
        <Container maxWidth={false}>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                sx: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              },
              '& .red': {
                backgroundColor: '#FF4242',
              },
            }}
          >
            <Grid>
              <Typography variant="h4">Customs Document</Typography>
              <TableReferences
                columns={columns}
                rows={data?.customsDocuments || []}
              />
            </Grid>
            <Grid>
              <Typography variant="h4">Invoice</Typography>
              <TableReferences
                columns={columns}
                rows={data?.invoice || []}
              />
            </Grid>
            <Grid>
              <Typography variant="h4">Transport</Typography>
              <TableReferences
                columns={columns}
                rows={data?.transport || []}
              />
            </Grid>
            <Grid>
              <Typography variant="h4">Shipping</Typography>
              <TableReferences
                columns={columns}
                rows={data?.shipping || []}
              />
            </Grid>
            <Grid>
              <Typography variant="h4">Extra Charge</Typography>
              <TableReferences
                columns={columns}
                rows={data?.extraCharges || []}
              />
            </Grid>
          </Box>
        </Container>
      </PageContent>
    </NotificationsProvider>
  );
}

export default References;
