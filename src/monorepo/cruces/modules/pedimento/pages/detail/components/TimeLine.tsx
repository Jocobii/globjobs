/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import * as status from '@gsuite/shared/seeders/status';
import { globalizationrow } from '@gsuite/shared/assets';

const crossingStatus = new Map([
  [status.PROFORMA_SUBMITTED, 0],
  [status.PROFORMA_AUTHORIZATION_STATUS, 1],
  [status.PAID_DOCUMENTS_STATUS, 2],
]);

const getStepByStatus = (currentStatus: string) => crossingStatus.get(currentStatus) ?? -1;

export default function StatusTimeLine({
  currentStatus,
}: {
  currentStatus: string;
}) {
  const steps = [
    'Proforma enviada',
    'Proforma Autorizada',
    'Pedimento Pagado',
  ];
  const transparentColor = 'rgba(255, 0, 0, 0)';
  const QontoConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: transparentColor,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: transparentColor,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: transparentColor,
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
      color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
      display: 'flex',
      height: 50,
      alignItems: 'center',
      ...(ownerState.active && {
        color: '#508FE1',
      }),
      '& .QontoStepIcon-completedIcon': {
        color: '#508FE1',
        zIndex: 1,
        fontSize: 10,
      },
    }),
  );

  function QontoStepIcon(props: StepIconProps) {
    const { active, className } = props;
    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {
          (
            active
            && (
              <img
                src={globalizationrow}
                alt=""
                style={{ width: '90%', height: '100%' }}
              />
            )
          ) || null
        }
      </QontoStepIconRoot>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        activeStep={getStepByStatus(currentStatus)}
        alternativeLabel
        connector={<QontoConnector />}
      >
        {
          steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={QontoStepIcon}
              >
                {label}
              </StepLabel>
            </Step>
          ))
        }
      </Stepper>
    </Box>
  );
}
