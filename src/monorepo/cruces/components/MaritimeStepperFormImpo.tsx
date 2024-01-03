import { useState, useEffect } from 'react';
import { ControlledTextField, Dropzone } from '@gsuite/shared/ui';
import axios from '@gsuite/shared/utils/crossingAxios';
import dayjs from 'dayjs';
import * as yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { FileDropZone } from '@gsuite/typings/files';
import {
  Box, Drawer, Stepper, Step, Grid,
  StepButton, Paper, Typography, Stack,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
} from '@mui/material';
import { Crossing } from '@gsuite/shared/contexts/cruces/CrossingContext';

const stepRequiringFiles = ['revalidated', 'finishedInspection'];

const stepWithInputs = ['etaDeclaration', 'revalidated', 'awaitingAppointmentForInspection', 'finishedInspection', 'arrivedAndWaitingForUnload'];

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
      return 'finishedInspection';
    default:
      return 'mblCommercialInvoicePackingList';
  }
};

interface Props {
  crossing: Crossing;
  open: boolean;
  handleClose: () => void;
}

export function MaritimeStepperFormImpo({ crossing, open, handleClose }: Props) {
  const lastStepCompleted = () => {
    if (!crossing?.maritimeFlow) {
      return 'mblCommercialInvoicePackingList';
    }
    const lastStep = crossing?.maritimeFlow?.find((step) => step.completed === false);
    if (lastStep) {
      return lastStep.step.key;
    }
    return 'finishedInspection';
  };
  const [activeStep, setActiveStep] = useState(lastStepCompleted());
  const [radioValue, setRadioValue] = useState('');
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

  const [completed, setCompleted] = useState<{
    [k: string]: boolean;
  }>(getCompletedSteps());
  const schema = yup.object().shape({
    eta: yup.date().required('Required').typeError('La Fecha es invalida'),
    containerNumber: yup.string().required('El numero de contenedor es requerido'),
    appointmentDate: yup.date().nullable().default(null).transform((curr, orig) => (orig === '' ? null : curr)),
  });
  const {
    register,
    getValues,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<FieldValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const onSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        data: {
          ...(activeStep === 'etaDeclaration' && {
            eta: getValues('eta'),
            containerNumber: getValues('containerNumber'),
          }),
          ...(activeStep === 'awaitingAppointmentForInspection' && {
            appointmentDate: getValues('appointmentDate'),
          }),
          ...(activeStep === 'arrivedAndWaitingForUnload' && {
            inspection: radioValue === 'yes',
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
      if (activeStep === 'finishedInspection' || (activeStep === 'arrivedAndWaitingForUnload' && radioValue === 'no')) {
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
          if (step.step.key === 'etaDeclaration') {
            setValue('eta', dayjs(step.data?.eta).format('YYYY-MM-DD').toString());
            setValue('containerNumber', step.data?.containerNumber);
          }
          if (step.step.key === 'awaitingAppointmentForInspection') {
            setValue('appointmentDate', dayjs(step.data?.appointmentDate).format('YYYY-MM-DD').toString());
          }
          if (step.step.key === 'arrivedAndWaitingForUnload') {
            setRadioValue(step.data?.inspection ? 'yes' : 'no');
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
      key: 'etaDeclaration',
      label: 'Buque en transito',
      description: 'Declaracion de ETA',
      content: (
        <>
          <ControlledTextField
            fieldName="eta"
            label="ETA"
            errors={errors}
            register={register}
            defaultValue={undefined}
            key="etaDate"
            inputType="date"
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
      key: 'revalidationInProcess',
      label: 'Revalidacion en proceso',
      description: 'Declaracion de revision',
      labelButton: 'Revalidar',
    },
    {
      key: 'revalidated',
      label: 'Revalidado',
      description: 'Declaracion de revision',
      content: (
        <Dropzone
          label="Archivos"
          files={files}
          filesSetter={setFiles}
        />
      ),
    },
    {
      key: 'arrivedAndWaitingForUnload',
      label: 'Arribado y en espera de descarga',
      description: 'Espera de descarga',
      optionalButton: 'Lista de espera',
      labelButton: 'Arribar',
      content: (
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">¿Se va a realizar la revision?</FormLabel>
          <RadioGroup
            row
            defaultValue={radioValue}
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(e) => setRadioValue(e.target.value)}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Si" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      ),
    },
    {
      key: 'awaitingAppointmentForInspection',
      label: 'Espera de cita para revisar',
      description: 'Espera de cita',
      content: (
        <ControlledTextField
          fieldName="appointmentDate"
          label="Fecha de revision"
          errors={errors}
          register={register}
          key="revisionDate"
          inputType="date"
        />
      ),
    },
    {
      key: 'inspectionInProcess',
      label: 'Revision en proceso',
      description: 'Revision',
      labelButton: 'Revisar',
    },
    {
      key: 'finishedInspection',
      label: 'Revision finalizada',
      description: 'Terminar revision',
      content: (
        <Dropzone
          label="Archivos"
          files={files}
          filesSetter={setFiles}
        />
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
              <Step key={step.label}>
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
