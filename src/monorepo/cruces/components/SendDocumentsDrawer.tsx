import { useState } from 'react';
import {
  Drawer,
  Typography,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

import { useSnackNotification, useResponsive } from '@gsuite/shared/hooks';
import { getIconImgeByExt } from '@gsuite/shared/utils/funcs';
import { normalizeString } from '@gsuite/shared/utils/format';
import { useCruceDetail } from '../services/cruce-detail';
import { useSendToTraffic } from '../services/send-to-traffic';
import useCruce from '../hooks/useCruce';

type Props = {
  open: boolean;
  onClose: () => void;
  crossingId: string;
};

const allowedTags: string[] = [
  'factura',
  'eei (shipper)',
  'entry',
  'e-manifest',
  'pedimento pagado',
  'hoja de seguridad',
  'carta porte',
  'cert fitosanitario',
  'guia aerea',
  'hoja de tratamiento',
  'registro de verificacion',
  'sello no shipper',
  'inbond',
  'in-bond',
  'hoja de ingreso',
  'bill of lading',
  'documentos americanos',
];

const CUSTOMER_OPTION = 1;

export default function SendDocumentsDrawer({
  open,
  onClose,
  crossingId,
}: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [sendOption, setSendOption] = useState(1);
  const { sendCrossingToTraffic } = useSendToTraffic();
  const [sendConfirm, setSendConfirm] = useState(false);
  const isDesktop = useResponsive('up', 'lg');
  const { successMessage, errorMessage } = useSnackNotification();
  const { data } = useCruceDetail(crossingId);
  const { flatTreeNodes } = useCruce();

  const dispatchFiles = flatTreeNodes({
    dispatchFileNode: data?.getCrossing.nodes.dispatchFileNode,
  })
    .filter((f) => f.data?.ext !== 'txt');

  const treeAndExternalFiles = flatTreeNodes({
    tree: data?.getCrossing?.nodes.tree,
    externaNode: data?.getCrossing?.nodes.externalNode,
  })
    .filter(
      (f) => f?.data?.ext !== 'txt' && f?.data?.tags && allowedTags.includes(normalizeString(f?.data?.tags)?.toLowerCase()),
    );

  const filesNames = [...dispatchFiles, ...treeAndExternalFiles].map((f) => {
    const splitedName = f?.data?.name?.split('.') as string[];
    return splitedName[1] ? f?.data?.name : `${f?.data?.name}.${f?.data?.ext}`;
  });

  const handleSendDocuments = async (): Promise<void> => {
    try {
      setIsLoading(true);
      sendCrossingToTraffic({
        variables: {
          sendTraffic: {
            id: data?.getCrossing.id,
            sendToCustomer: sendOption === CUSTOMER_OPTION,
          },
        },
        onError: () => errorMessage('Ocurrió un error al enviar los documentos'),
        onCompleted: () => successMessage('Se han enviado los documentos correctamente'),
      });
    } catch (error) {
      errorMessage(t<string>('cruces.an_error'));
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={isDesktop ? {
        sx: {
          width: '22%',
          minWidth: '470px',
        },
      } : {
        sx: {
          width: '90%',
          minWidth: '470px',
        },
      }}
      anchor="right"
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{
          minWidth: '100%',
          p: 5,
        }}
      >
        <Typography variant="h3">Envío de documentos de despacho</Typography>
        {data?.getCrossing.isAAUSDocComplete && (
          <Typography color="red" variant="body1">
            {
            `*La cantida de ${data.getCrossing.type === 'Importacion' ? 'documentos americanos' : 'entries'} no coinciden con las cantidades de facturas registradas en el cruce*`
          }
          </Typography>
        )}
        <Typography variant="subtitle1">Elige a donde quieres enviar los documentos de despacho.</Typography>
        <Stack
          sx={{ minWidth: '100%' }}
          direction="column"
          justifyContent="start"
        >
          <FormGroup>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={sendOption === 1}
                  onChange={() => setSendOption(1)}
                />
              )}
              label="Enviar a cliente."
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={sendOption === 2}
                  onChange={() => setSendOption(2)}
                />
              )}
              label="Enviar a tráfico."
            />
          </FormGroup>
        </Stack>
        <List sx={{ minWidth: '100%' }}>
          <ListItemButton
            onClick={() => setOpenList((prev) => !prev)}
            sx={{
              minWidth: '100%',
              px: 0,
            }}
          >
            <ListItemIcon>
              <FolderIcon color="primary" fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Despacho" />
            {openList ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openList} timeout="auto" unmountOnExit>
            <List>
              {filesNames?.map((fileName) => (
                <Stack direction="row" sx={{ minWidth: '100%', my: 1.5 }} alignItems="center" key={fileName}>
                  <IconButton
                    sx={{ pointerEvents: 'none' }}
                  >
                    <img
                      src={getIconImgeByExt(fileName?.split('.')[1])}
                      alt="file"
                      height={30}
                      width={30}
                      draggable={false}
                    />
                  </IconButton>
                  {fileName}
                </Stack>
              ))}
            </List>
          </Collapse>
        </List>

        <Stack
          sx={{ minWidth: '100%' }}
          direction="column"
          justifyContent="start"
        >
          <FormGroup>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={sendConfirm}
                  onChange={({ target }) => {
                    setSendConfirm(target.checked);
                  }}
                />
              )}
              label="Confirmo que todos los archivos están listos para enviarse."
            />
          </FormGroup>
        </Stack>

        <Stack
          sx={{ minWidth: '100%' }}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Button
            disableElevation
            variant="outlined"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <LoadingButton
            disabled={!sendConfirm}
            disableElevation
            loading={isLoading}
            variant="contained"
            onClick={handleSendDocuments}
          >
            Enviar archivos
          </LoadingButton>
        </Stack>
      </Stack>
    </Drawer>
  );
}
