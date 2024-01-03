import { useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  CircularLoader,
} from '@gsuite/shared/ui';
import { useCruceDetail } from '@gsuite/shared/services/cruces';
import { TreeList } from '@gsuite/shared/ui/cruces';
import { Panel } from '@gsuite/shared/components/panel';
import TimeLine from './TimeLine';
import { FilesModal } from './FilesModal';
import { CRUSE_QUERY_SUB } from '../hooks/cruceDetailSub';

const loading = false;
export function Layout() {
  const { id } = useParams<{ id: string }>();
  const { data, subscribeToMore, refetch } = useCruceDetail(id ?? '');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  if (!data) {
    return null;
  }
  const { _id: statusId } = data.getCrossing?.status ?? {};
  subscribeToMore({
    document: CRUSE_QUERY_SUB,
    variables: { id },
    updateQuery: (prev, { subscriptionData }: any) => {
      if (!subscriptionData.data) return prev;
      const newCruce = subscriptionData.data.CRUCES_UPDATE;
      return {
        getCrossing: {
          ...prev.getCrossing,
          ...newCruce,
        },
      };
    },

  });

  return (
    <Paper elevation={10} sx={{ width: '100%' }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        spacing={2}
        sx={{ p: '20px' }}
      >
        <Grid
          container
          direction="row"
        >
          <Stack spacing={6} sx={{ marginLeft: '1%' }} direction="row">
            <Typography color="#3A8FE8" variant="h5" component="div" gutterBottom>
              Pedimento
              {' '}
              {data.getCrossing?.pedimento}
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
              {data.getCrossing?.type}
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
              Patente
              {' '}
              {data.getCrossing?.patente}
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
              Aduana
              {' '}
              {data.getCrossing?.aduana}
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
              {data.getCrossing?.client}
              {' / '}
              {data.getCrossing?.clientNumber}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={9}>
          <Grid
            container
            direction="row"
            justifyContent="left"
            sx={{ mb: '3%' }}
          >
            <TimeLine currentStatus={statusId} />
          </Grid>
          <Paper elevation={12} style={{ height: '80vh', backgroundColor: '#00000010' }}>
            {loading && (
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ height: '100%', width: '100%' }}
            >
              <CircularLoader />
            </Grid>
            )}
            {
            !loading ? (
              <TreeList
                isCostumer
                crossingId={' '}
                tree={[]}
                externalNode={data.getCrossing.nodes.externalNode}
                dispatchFileNode={[]}
                handleDropTree={() => {}}
              />
            ) : null
          }
          </Paper>
          <Stack
            direction="row-reverse"
            spacing={3}
            mt={2}
          >
            <Button
              variant="contained"
              onClick={handleOpen}
            >
              Agregar
            </Button>
          </Stack>
        </Grid>
        <FilesModal
          open={open}
          handleClose={handleOpen}
          refetch={refetch}
        />
        <Panel
          history={data.getCrossing.history ?? []}
          requiredActionsMenuIsOpen={false}
          setRequiredActionsMenuIsOpen={() => {}}
        />
      </Grid>
    </Paper>
  );
}
