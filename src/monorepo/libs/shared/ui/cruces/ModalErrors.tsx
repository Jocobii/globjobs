import Accordion from '@mui/material/Accordion';
import { useTranslation } from 'react-i18next';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NodeModels, Issues } from '@gsuite/typings/files';
import DialogComponent from '../DialogComponent';

interface Props {
  node: NodeModels;
  open: boolean;
  onClose: () => void;
}

function ModalErrors({ node, open, onClose }: Props) {
  const { t } = useTranslation();
  const detailErrors = node.data?.issues?.issues?.filter((issue: Issues) => issue.type === 'error');
  const detailWarnings = node.data?.issues?.issues?.filter((issue: Issues) => issue.type === 'warning');
  const detailInformation = node.data?.issues?.issues?.filter((issue: Issues) => issue.type === 'information') ?? [];

  return (
    <DialogComponent
      title={`${node.text}.${node.data?.ext}` ?? 'Asuntos en el archivo'}
      open={open}
      maxWidth="md"
      handleClose={onClose}
      handleConfirm={onClose}
      okText={t('accept')}
      cancelText={t('cancel')}
    >
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              <ErrorIcon sx={{ color: '#DC3546' }} />
              {' '}
              {detailErrors?.length ?? 0}
              {' '}
              errores
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {detailErrors?.map(({ field, line, message }) => (
              <>
                <b>{` Error en el campo ${field} linea ${line}` }</b>
                <p>{message}</p>
                <br />
              </>
            ))}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>
              <ErrorIcon sx={{ color: '#FF972F' }} />
              {' '}
              {detailWarnings?.length ?? 0}
              {' '}
              advertencias
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {detailWarnings?.map(({ field, line, message }) => (
              <>
                <b>{` Advertencia en el campo ${field} linea ${line}` }</b>
                <p>{message}</p>
                <br />
              </>
            ))}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>
              <ErrorIcon sx={{ color: '#3A8FE8' }} />
              {' '}
              {detailInformation?.length ?? 0}
              {' '}
              informativos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {detailInformation?.map(({ field, line, message }) => (
              <>
                <b>{` Informativo en el campo ${field} linea ${line}` }</b>
                <p>{message}</p>
                <br />
              </>
            ))}
          </AccordionDetails>
        </Accordion>
      </div>
    </DialogComponent>
  );
}

export default ModalErrors;
