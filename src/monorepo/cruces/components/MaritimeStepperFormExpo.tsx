import { useState, useEffect } from 'react';
import { ControlledTextField, Dropzone } from '@gsuite/shared/ui';
import axios from '@gsuite/shared/utils/crossingAxios';
import dayjs from 'dayjs';
import * as yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { FileDropZone } from '@gsuite/typings/files';
import {
  Box, Drawer, Stepper, Step, Grid,
  StepButton, Paper, Typography, Stack,
} from '@mui/material';
import { Crossing } from '@gsuite/shared/contexts/cruces/CrossingContext';

const stepRequiringFiles = ['ballotReleasedAndAwaitingDeparture'];

const stepWithInputs = ['applicationForPortEntry', 'preDischargeConfirmation', 'ballotReleasedAndAwaitingDeparture'];

const getNextStepByName = (stepName: string) => {
  switch (stepName) {
    case 'applicationForPortEntry':
      return 'preDischargeConfirmation';
    case 'preDischargeConfirmation':
      return 'terminalBallotRelease';
    case 'terminalBallotRelease':
      return 'containerInPort';
    case 'containerInPort':
      return 'ballotReleasedAndAwaitingDeparture';
    case 'ballotReleasedAndAwaitingDeparture':
      return 'ballotReleasedAndAwaitingDeparture';
    default:
      return 'applicationForPortEntry';
  }
};

interface Props {
  crossing: Crossing;
  open: boolean;
  handleClose: () => void;
}

export function MaritimeStepperFormExpo({ crossing, open, handleClose }: Props) {
  const lastStepCompleted = () => {
    if (!crossing?.maritimeFlow) {
      return 'applicationForPortEntry';
    }
    const lastStep = crossing?.maritimeFlow?.find((step) => step.completed === false);
    if (lastStep) {
      return lastStep.step.key;
    }
    return 'ballotReleasedAndAwaitingDeparture';
  };
  const [activeStep, setActiveStep] = useState(lastStepCompleted());
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileDropZone[]>([]);
  const { errorMessage, successMessage } = useSnackNotification();
  const getCompletedSteps = () => {
    const completedSteps: {
      [k: string]: boolean;
    } = {};
    crossing?.maritimeFlow?.forEach((step) => {
      if (step.completed) {
        completedSteps[step.step.key] = true;
      }
    });
    return completedSteps;
  };
  console.log('getCompletedSteps drawer expo', getCompletedSteps());
  const [completed, setCompleted] = useState<{
    [k: string]: boolean;
  }>(getCompletedSteps());
  const schema = yup.object().shape({
    closingDate: yup.date().required('Required').typeError('La Fecha es invalida'),
    containerNumber: yup.string().required('El numero de contenedor es requerido'),
    sailingDate: yup.date().nullable().default(null).transform((curr, orig) => (orig === '' ? null : curr)),
  });
  const {
    register,
    getValues,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const onSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        data: {
          ...(activeStep === 'applicationForPortEntry' && {
            closingDate: dayjs(getValues('closingDate')).format('YYYY-MM-DD HH:mm:ss'),
            containerNumber: getValues('containerNumber'),
          }),
          ...(activeStep === 'ballotReleasedAndAwaitingDeparture' && {
            sailingDate: dayjs(getValues('sailingDate')).format('YYYY-MM-DD'),
          }),
        },
        needStatusUpdate: !completed[activeStep],
        step: activeStep,
        files,
      };

      await axios.put(`/maritime-flow/${crossing?.id}`, data, {
        headers: {
          'Content-Type': files.length ? 'multipart/form-data' : 'application/json',
        },
      });
      if (['terminalBallotRelease', 'containerInPort', 'ballotReleasedAndAwaitingDeparture'].includes(activeStep)) {
        successMessage('Informacion guardada correctamente');
        handleClose();
        return;
      }
      setActiveStep(getNextStepByName(activeStep));
      setCompleted({ ...completed, [activeStep]: true });
      successMessage('Informacion guardada correctamente');
    } catch (e) {
      errorMessage('Error al guardar la informacion');
    } finally {
      setFiles([]);
      setLoading(false);
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (crossing?.maritimeFlow) {
      setActiveStep(lastStepCompleted());
      setCompleted(getCompletedSteps());

      const getCompletedStepsValues = crossing?.maritimeFlow?.filter((step) => step.completed);
      if (getCompletedStepsValues?.length) {
        getCompletedStepsValues.forEach((step) => {
          if (step.step.key === 'applicationForPortEntry') {
            setValue('closingDate', dayjs(step.data?.closingDate).format('YYYY-MM-DD HH:mm:ss').toString() as unknown as Date);
            setValue('containerNumber', step.data?.containerNumber ?? '');
          }
          if (step.step.key === 'ballotReleasedAndAwaitingDeparture') {
            setValue('sailingDate', dayjs(step.data?.sailingDate).format('YYYY-MM-DD').toString() as unknown as Date);
          }
        });
      }
    }
  }, [crossing?.maritimeFlow]);

  const steps = [
    {
      key: 'mblCommercialInvoicePackingList',
      label: 'Carga de documentos',
      description: 'Archivos',
    },
    {
      key: 'applicationForPortEntry',
      label: 'Solicitud de entrada a puerto',
      description: 'Declaracion de fecha de cierre y hora',
      content: (
        <>
          <ControlledTextField
            errors={errors}
            fieldName="closingDate"
            inputType="datetime-local"
            label="Fecha de cierre"
            register={register}
          />
          <ControlledTextField
            fieldName="containerNumber"
            label="Numero de contenedor"
            errors={errors}
            register={register}
            defaultValue={undefined}
            key="containerNumberInput"
            inputType="text"
          />
        </>
      ),
    },
    {
      key: 'preDischargeConfirmation',
      label: 'Confirmacion de pre-alta',
      description: 'Subir archivo de pre-alta',
      content: (
        <Dropzone
          label="Archivos"
          files={files}
          filesSetter={setFiles}
          accept={{
            pdf: ['application/pdf'],
          }}
        />
      ),
    },
    {
      key: 'terminalBallotRelease',
      label: 'Asignacion de transporte y en espera de cita',
      description: 'Asignar transporte',
      labelButton: 'Transporte asignado',
    },
    {
      key: 'containerInPort',
      label: 'Contenedor en puerto',
      description: 'Ingreso a puerto',
      labelButton: 'Ingresado a puerto',
    },
    {
      key: 'ballotReleasedAndAwaitingDeparture',
      label: 'Boleta liberada y en espera de zarpe',
      description: 'Declaracion de zarpe',
      content: (
        <>
          <ControlledTextField
            fieldName="sailingDate"
            label="Fecha de zarpe"
            errors={errors}
            register={register}
            key="sailingDate"
            inputType="date"
          />
          <Dropzone
            label="Archivos"
            files={files}
            filesSetter={setFiles}
            accept={{
              pdf: ['application/pdf'],
            }}
          />
        </>
      ),
    },
  ];
  const handleStep = (key: string) => () => {
    setActiveStep(key);
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { pb: 5, width: 600 } }}
      anchor="right"
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Typography variant="h4" sx={{ px: 3, pt: 3 }}>
        Acciones requeridas
      </Typography>
      <Paper square elevation={0} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stepper
            nonLinear
            activeStep={crossing?.maritimeFlow?.findIndex((step) => step.step.key === activeStep)}
            orientation="vertical"
          >
            {steps.map((step) => (
              <Step key={step.label} completed={completed[step.key]}>
                <StepButton color="inherit" onClick={handleStep(step.key)}>
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    sx={{ textAlign: 'left', width: '100%' }}
                    spacing={0.5}
                  >
                    <Typography variant="h6">
                      {step.label}
                    </Typography>
                    <Typography variant="caption">
                      {step.description}
                    </Typography>
                  </Stack>
                </StepButton>
                {
                  activeStep === step.key ? (
                    <Box sx={{ m: 2 }}>
                      {
                        (step.content && activeStep !== 'mblCommercialInvoicePackingList') ? (
                          <Stack spacing={2}>
                            {step.content}
                          </Stack>
                        ) : null
                      }
                      {
                        stepWithInputs.includes(step.key) && (
                          <Grid
                            container
                            direction="row-reverse"
                            justifyContent="right"
                            alignItems="flex-end"
                          >
                            <LoadingButton
                              variant="contained"
                              color="primary"
                              type="submit"
                              disabled={stepRequiringFiles.includes(step.key)
                                && files.length === 0}
                              loading={loading}
                              sx={{ m: 2 }}
                            >
                              Guardar
                            </LoadingButton>
                          </Grid>
                        )
                      }
                      {
                        !stepWithInputs.includes(step.key) && step.key !== 'mblCommercialInvoicePackingList' && (
                          <LoadingButton
                            variant="contained"
                            color="primary"
                            type="submit"
                            loading={loading}
                            sx={{ m: 2 }}
                          >
                            {step.labelButton ?? 'Guardar'}
                          </LoadingButton>
                        )
                      }
                    </Box>
                  ) : null
                }
              </Step>
            ))}
          </Stepper>
        </form>
      </Paper>
    </Drawer>
  );
}
