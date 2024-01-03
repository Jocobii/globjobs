import { get } from 'lodash';
import {
  Box, Typography, Button,
  Alert, AlertTitle,
} from '@mui/material';
import { Crossing } from '@gsuite/shared/contexts/cruces/CrossingContext';
import { TransportationAndAppointmentForm } from './TransportationAndAppointmentForm';
import { MaritimeStepperFormImpo } from './MaritimeStepperFormImpo';
import { MaritimeStepperFormExpo } from './MaritimeStepperFormExpo';

interface Props {
  crossing: Crossing;
  open: boolean;
  handleOpen: () => void;
}

const getNextStepByName = (stepName: string) => {
  switch (stepName) {
    case 'mblCommercialInvoicePackingList':
      return 'etaDeclaration';
    case 'etaDeclaration':
      return 'revalidationInProcess';
    case 'revalidationInProcess':
      return 'revalidated';
    case 'revalidated':
      return 'arrivedAndWaitingForUnload';
    case 'arrivedAndWaitingForUnload':
      return 'awaitingAppointmentForInspection';
    case 'awaitingAppointmentForInspection':
      return 'inspectionInProcess';
    case 'inspectionInProcess':
      return 'finishedInspection';
    case 'finishedInspection':
      return 'terminalBallotRelease';
    case 'terminalBallotRelease':
      return 'captureEmails';
    case 'captureEmails':
      return 'assignedTransport';
    case 'assignedTransport':
      return 'completed';
    default:
      return 'mblCommercialInvoicePackingList';
  }
};

export function MaritimeBanner({ crossing, open, handleOpen }: Props) {
  const isStatusCompleted = get(crossing, 'status._id', '') === '64cc0e0d995cbc1823b46bd4';
  const crossingType = get(crossing, 'type', '').toLowerCase().trim();

  const lastStepCompleted = () => {
    if (!crossing?.maritimeFlow) {
      return {
        step: 'mblCommercialInvoicePackingList',
        next: 'etaDeclaration',
      };
    }
    const lastStepComplete = crossing?.maritimeFlow?.find((step: any) => !step.completed);
    if (lastStepComplete) {
      return {
        step: lastStepComplete.step.key,
        next: getNextStepByName(lastStepComplete.step.key),
      };
    }
    return {
      step: 'assignedTransport',
      next: 'completed',
    };
  };
  console.log('lastStepCompleted', lastStepCompleted());
  const { step } = lastStepCompleted();
  const existsDodaFile = () => {
    const dispatchFileNode = crossing?.nodes?.dispatchFileNode;
    if (!dispatchFileNode || dispatchFileNode.length === 0) return false;
    return dispatchFileNode
      .some((node) => node.data?.tags?.toLocaleLowerCase() === 'doda / pita');
  };

  const arrivaStep = crossing?.maritimeFlow?.find((currStep) => currStep.step.key === 'arrivedAndWaitingForUnload' && currStep.completed);
  let wasSkipped = false;
  if (arrivaStep) {
    wasSkipped = !arrivaStep.data?.inspection;
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Alert
        severity={isStatusCompleted ? 'success' : 'info'}
        action={(
          <Button onClick={handleOpen}>
            Ver acciones
          </Button>
        )}
      >
        <AlertTitle>{isStatusCompleted ? 'Pasos completados' : 'Pasos pendientes'}</AlertTitle>
        <Typography variant="body1">
          {
            isStatusCompleted
              ? 'Felicidades, has completado todos los pasos'
              : 'Tienes acciones pendientes para esta operación'
          }
        </Typography>
      </Alert>
      {
        ['captureEmails', 'assignedTransport'].includes(step) || wasSkipped ? (
          <TransportationAndAppointmentForm
            crossingId={crossing?.id ?? ''}
            maritimeFlow={crossing?.maritimeFlow ?? []}
            existsDodaFile={existsDodaFile()}
            open={open}
            handleClose={handleOpen}
          />
        ) : null
      }
      {
        crossingType === 'importacion' ? (
          <MaritimeStepperFormImpo
            crossing={crossing}
            open={open}
            handleClose={handleOpen}
          />
        ) : (
          <MaritimeStepperFormExpo
            crossing={crossing}
            open={open}
            handleClose={handleOpen}
          />
        )
      }
    </Box>
  );
}
