import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Stepper, Step, StepLabel, Typography, Button, Stack, Card, Box, CircularProgress,
} from '@mui/material';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { STEPS_NAMES } from '@gsuite/shared/constants';
import loadable from '@loadable/component';
import DialogComponent from '@gsuite/shared/ui/DialogComponent';
import SteperButtons from './SteperButtons';
import { useStepInfo } from '../services/stepInfo';

import {
  ArrivalEEUU,
  InboundEEUU,
  CollectionTransport,
  ReceivedUsaWarehouse,
  DocumentsReadyMX,
  USAMXCrossover,
  ArrivalWarehouseMX,
} from './forms';

const Finished = loadable(() => import('./forms/Finished'), { fallback: <h3>Loading...</h3> });

type From = {
  body: JSX.Element;
  title: string;
};

type Steps = {
  step: string;
  date: string;
};

type AutoComplete = {
  _id: string;
  number: string;
};

type Props = {
  step: number;
  timeElapsed: string;
  steps: Steps[];
  operationId: string;
  number: string;
  skipStepUsa: boolean;
  clientNumber?: string;
  isInvoiced?: boolean;
  isAdmin: boolean;
};

export default function OperationStep({
  step,
  timeElapsed,
  steps,
  operationId,
  number,
  skipStepUsa,
  clientNumber = '',
  isInvoiced = false,
  isAdmin,
}: Props) {
  const {
    ARRIVAL_EEUU, INBOUND_EEUU, COLLECTION_RANSPORT, RECEIVED_USA_WAREHOUSE,
    DOCUMENTS_READY_MX, USA_MX_CROSSOVER, ARRIVAL_WAREHOUSE_MX, FINISHED,
  } = STEPS_NAMES;
  const { t } = useTranslation();
  const theme = useTheme();
  const { setSnackBar } = useContext(NotificationsContext);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [defaultValue, setDefaultValue] = useState<AutoComplete>();
  const [form, setForm] = useState<From>();
  const [getStepInfo] = useStepInfo();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const progressValue = step ? (100 / steps.length) * step : 100;
  const isFinished = steps.some((e) => e.step === 'step9' && e.date);
  const isOnlyView = (isFinished || !isAdmin || isInvoiced);

  useEffect(() => {
    if (isInvoiced) {
      setSnackBar('info', t('broker.opsInvoicedMessage'));
      return;
    }
    if (isFinished) setSnackBar('info', t('broker.gopFinished'));
  }, [isInvoiced]);

  const onClose = () => {
    setOpenDialog(false);
  };

  const handleNextStep = () => {
    setActiveStep(activeStep + 1);
    onClose();
  };

  const getStepData = async (stepIndex: number) => {
    const { data: stepInfo } = await getStepInfo({
      variables: {
        id: operationId,
        step: stepIndex,
      },
    });
    const receiptNumber = stepInfo?.getStepInfo?.receiptNumber || '';
    setDefaultValue({
      _id: receiptNumber,
      number: receiptNumber,
    });
  };

  const openFromStep = (stepIndex: number) => {
    switch (stepIndex) {
      case ARRIVAL_EEUU:
        setForm({
          body: <ArrivalEEUU
            submitFrom={handleNextStep}
            onClose={onClose}
            operationId={operationId}
            isEdit={stepIndex < step}
            isOnlyView={isOnlyView && stepIndex < step}
          />,
          title: t('broker.arrivalUsa'),
        });
        break;
      case INBOUND_EEUU:
        setForm({
          body: <InboundEEUU
            submitFrom={handleNextStep}
            onClose={onClose}
            operationId={operationId}
            number={number}
            clientNumber={clientNumber}
            isEdit={stepIndex < step}
            isOnlyView={isOnlyView && stepIndex < step}
          />,
          title: t('broker.usaImport'),
        });
        break;
      case COLLECTION_RANSPORT:
        setForm({
          body: <CollectionTransport
            submitFrom={handleNextStep}
            onClose={onClose}
            operationId={operationId}
            handleCreateOperation={() => null}
            isEdit={stepIndex < step}
            isOnlyView={isOnlyView && stepIndex < step}
          />,
          title: t('broker.transportCollection'),
        });
        break;
      case RECEIVED_USA_WAREHOUSE:
        setForm({
          body: <ReceivedUsaWarehouse
            submitFrom={handleNextStep}
            onClose={onClose}
            operationId={operationId}
            isEdit={stepIndex < step}
            isOnlyView={isOnlyView && stepIndex < step}
          />,
          title: t('broker.usaWarehouse'),
        });
        break;
      case DOCUMENTS_READY_MX:
        setForm({
          body: (
            <DocumentsReadyMX
              submitFrom={handleNextStep}
              onClose={onClose}
              operationId={operationId}
              skipStepUsa={skipStepUsa}
              isEdit={stepIndex < step}
              isOnlyView={isOnlyView && stepIndex < step}
            />
          ),
          title: t('broker.mxImport'),
        });
        break;
      case USA_MX_CROSSOVER:
        setForm({
          body: (
            <USAMXCrossover
              submitFrom={handleNextStep}
              onClose={onClose}
              operationId={operationId}
              isEdit={stepIndex < step}
              isOnlyView={isOnlyView && stepIndex < step}
            />
          ),
          title: t('broker.borderCrossing'),
        });
        break;
      case ARRIVAL_WAREHOUSE_MX:
        setForm({
          body: (
            <ArrivalWarehouseMX
              submitFrom={handleNextStep}
              onClose={onClose}
              operationId={operationId}
              isEdit={stepIndex < step}
              isOnlyView={isOnlyView && stepIndex < step}
            />
          ),
          title: t('broker.mxWarehouse'),
        });
        break;
      case FINISHED:
        if (stepIndex < step) getStepData(stepIndex);

        setForm({
          body: <Finished
            submitFrom={handleNextStep}
            onClose={onClose}
            operationId={operationId}
            isEdit={stepIndex < step}
            defaultValue={defaultValue}
            isOnlyView={isOnlyView && stepIndex < step}
          />,
          title: t('broker.endUp'),
        });
        break;
      default:
        break;
    }
    setOpenDialog(true);
  };

  return (
    <>
      {/* Desktop view */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 0,
          width: '100%',
          overflowX: 'auto',
          display: {
            xs: 'none',
            sm: 'flex',
          },
        }}
      >
        <Stepper
          alternativeLabel
          activeStep={step}
          sx={{
            mt: 5,
          }}
        >
          {steps.map(({ step: stepName, date }, index) => (
            <Step
              key={stepName}
              sx={{
                justifyContent: 'center',
                display: 'flex',
                '& .MuiStepLabel-root .Mui-completed': {
                  color: theme.palette.success.light,
                },
                '& .MuiStepLabel-root .Mui-active': {
                  color: theme.palette.success.main,
                },
              }}
            >
              <Stack direction="column" alignItems="center">
                <SteperButtons
                  isAdmin={isAdmin}
                  isAdd={step >= index && index !== 0 && !isFinished}
                  openFromStep={openFromStep}
                  index={index}
                  step={step}
                  isInvoiced={isInvoiced}
                />
                <StepLabel>
                  <Typography variant="body2">{t<string>(`broker.steps.${stepName}`)}</Typography>
                  <Typography color="GrayText" variant="body2">
                    {date}
                  </Typography>
                </StepLabel>
              </Stack>
            </Step>
          ))}
        </Stepper>
        <Card
          sx={{
            borderColor: `${theme.palette.warning.light} !important`,
            borderLeft: 2,
            minWidth: 300,
          }}
        >
          <Stack spacing={1} sx={{ p: 2, width: '100%' }}>
            <Typography variant="subtitle2" align="center">
              {timeElapsed ?? 'Not started'}
            </Typography>
            <Typography variant="subtitle2" align="center">
              {t<string>('broker.timeTotal')}
            </Typography>
          </Stack>
        </Card>
      </Stack>

      {/* MobileView */}
      <>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          sx={{
            display: {
              sm: 'none',
            },
            py: 3,
            px: 0,
            width: '100%',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 'fit-content',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress
              variant="determinate"
              value={step && step === 9 ? 100 : progressValue}
              color="success"
              size={110}
              sx={{ padding: 0 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                position: 'absolute',
              }}
            >
              {step ? (
                <>
                  {step}
                  {' '}
                  {t<string>('broker.stepOf')}
                  {' '}
                  {steps.length}
                  <br />
                </>
              ) : (
                <p>{t<string>('broker.finished')}</p>
              )}
            </Typography>
          </Box>
          <Stack>
            <Typography variant="subtitle1">{t<string>(`broker.steps.${steps[(step && step - 1) || 0].step}`)}</Typography>
            <Typography variant="caption">
              {t<string>('broker.nextStep')}
              :
              {t<string>(`broker.steps.${steps[step]?.step}`) || 'No More steps available'}
            </Typography>
          </Stack>
        </Stack>

        <Card
          sx={{
            borderColor: `${theme.palette.warning.light} !important`,
            borderLeft: 2,
            width: 'auto',
            my: 2,
            display: {
              sm: 'none',
            },
          }}
        >
          <Stack
            spacing={1}
            sx={{
              p: 2,
              width: '100%',
              display: {
                sm: 'none',
              },
            }}
          >
            <Typography variant="subtitle2" align="center">
              {timeElapsed ?? 'Not started'}
            </Typography>
            <Typography variant="subtitle2" align="center">
              {t<string>('broker.timeTotal')}
            </Typography>
          </Stack>
        </Card>

        {step < 9 && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            sx={{
              mt: 1,
              width: '100%',
              display: {
                sm: 'none',
              },
            }}
            onClick={() => openFromStep(step)}
          >
            {t<string>('add')}
          </Button>
        )}
      </>

      {/* Modal */}
      <DialogComponent
        title={form?.title}
        open={openDialog}
        maxWidth="xl"
        cancelButtonVisibility={false}
        okButtonVisibility={false}
        handleClose={handleNextStep}
      >
        {form?.body}
      </DialogComponent>
    </>
  );
}
