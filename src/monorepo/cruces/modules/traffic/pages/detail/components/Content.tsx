import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Button,
  Grid,
  Paper,
  Stack,
  IconButton,
  Typography,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Panel } from '@gsuite/shared/components/panel';
import { CircularLoader, useDialog } from '@gsuite/shared/ui';
import TimeLine from '@gsuite/shared/ui/cruces/TimeLine';
import { TreeList } from '@gsuite/shared/ui/cruces';
import MultiFileDownloadDialog from '@gsuite/shared/ui/MultiFileDownloadDialog';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useCrossing } from '@gsuite/shared/contexts';
import { useTrafficDetail } from '@gsuite/shared/services/cruces/get-traffic-crossing-detail';
import DocumentsDelivery from './DocumentsDelivery';

type Params = {
  id: string;
};

export default function CruceDetail() {
  const { id } = useParams<keyof Params>() as Params;
  const { crossing } = useCrossing();
  const { loading, error } = useTrafficDetail(id, true);
  const [openSendDocuments, setSendDocumentsModal] = useState(false);
  const { errorMessage, successMessage } = useSnackNotification();
  const [openDialog, closeDialog] = useDialog();
  const crossingData = crossing;
  const { _id: statusId } = crossingData?.status ?? {};
  const { t } = useTranslation();

  const handleOpenDownloadMultiFilesDownloadDialog = () => openDialog({
    children: (
      <MultiFileDownloadDialog
        t={t}
        title="Despacho"
        onClose={closeDialog}
        successMessage={successMessage}
        nodes={crossingData?.nodes?.externalNode}
      />
    ),
  });

  if (error) {
    errorMessage('Error al cargar la operación');
  }
  return (
    <Paper elevation={10}>
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
              {t<string>('cruces.operation')}
              {' '}
              {crossingData?.number}
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
              {crossingData?.type}
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
              {t<string>('cruces.patent')}
              {' '}
              1674
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
              {t<string>('cruces.customsOffice')}
              {' '}
              {crossingData?.aduana}
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
              {crossingData?.client}
              {' / '}
              {crossingData?.clientNumber}
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
            <TimeLine currentStatus={statusId ?? ''} />
          </Grid>
          <Paper elevation={12} style={{ height: '80vh', backgroundColor: '#00000010' }}>
            {(loading || error) ? (
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ height: '100%', width: '100%' }}
              >
                <CircularLoader />
              </Grid>
            ) : (
              <TreeList
                crossingId={id}
                tree={[]}
                externalNode={crossingData?.nodes?.externalNode ?? []}
              />
            )}
          </Paper>
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
            py={2}
          >
            <IconButton
              sx={{ borderWidth: '1px', borderColor: 'primary', borderStyle: 'solid' }}
              color="primary"
              onClick={handleOpenDownloadMultiFilesDownloadDialog}
            >
              <FileDownloadIcon />
            </IconButton>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => setSendDocumentsModal(!openSendDocuments)}
              >
                Documentos entregados
              </Button>
            </Stack>
          </Stack>
        </Grid>
        <DocumentsDelivery
          open={openSendDocuments}
          setOpen={() => setSendDocumentsModal(!openSendDocuments)}
          crossingId={id}
        />
        <Panel
          isTrafficFlow
          history={crossingData?.history ?? []}
        />
      </Grid>
    </Paper>
  );
}
