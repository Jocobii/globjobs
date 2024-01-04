import { useState, useEffect } from 'react';
import axios from '@gsuite/shared/utils/crossingAxios';
import {
  Drawer, Stepper, Step, Grid, StepLabel,
  Paper, Typography, Stack, Alert,
} from '@mui/material';
import { ControlledAutocomplete } from '@gsuite/shared/ui';
import { useSnackNotification } from '@gsuite/shared/hooks';
import * as yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const stepsForm = [
  {
    key: 'captureEmails',
    label: 'Capturar emails',
    labelButton: 'Guardar',
  },
  {
    key: 'assignedTransport',
    label: 'Asignar transporte',
    labelButton: 'Enviar documentos',
  },
];

interface Props {
  crossingId: string;
  maritimeFlow: any;
  existsDodaFile: boolean;
  open: boolean;
  handleClose: () => void;
}

export function TransportationAndAppointmentForm({
  crossingId, maritimeFlow, existsDodaFile,
  open, handleClose,
}: Readonly<Props>) {
  const { successMessage, errorMessage } = useSnackNotification();
  const lastStepCompleted = () => {
    if (!maritimeFlow) {
      return 'captureEmails';
    }
    const onlyTransportationSteps = maritimeFlow?.filter((step: any) => ['captureEmails', 'assignedTransport'].includes(step.step.key));
    const lastStep = onlyTransportationSteps?.find((step: any) => step.completed === false);
    if (lastStep) {
      return lastStep.step.key;
    }
    return 'assignedTransport';
  };
  const [activeStep, setActiveStep] = useState<string>(lastStepCompleted());
  const [loading, setLoading] = useState(false);
  const getCompletedSteps = () => {
    const completedSteps: {
      [k: string]: boolean;
    } = {};
    maritimeFlow?.forEach((step: any) => {
      if (step.completed) {
        completedSteps[step.step.key] = true;
      }
    });
    return completedSteps;
  };
  const schema = yup.object().shape({
    emails: yup.array().of(
      yup.string()
        .min(3, 'El correo electronico debe tener al menos 3 caracteres')
        .email(({ value }) => `${value} no es valido`),
    )
      .min(1, 'Por favor ingrese al menos un correo electronico')
      .required('Por favor ingrese al menos un correo electronico'),
  });
  const {
    getValues,
    formState: { errors },
    setValue,
    handleSubmit,
    control,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const [completed, setCompleted] = useState<{
    [k: string]: boolean;
  }>(getCompletedSteps());

  useEffect(() => {
    if (maritimeFlow.length > 0) {
      setActiveStep(lastStepCompleted());
      setCompleted(getCompletedSteps());

      const getCompletedStepsValues = maritimeFlow?.filter((step: any) => step.completed);
      if (getCompletedStepsValues?.length) {
        getCompletedStepsValues.forEach((step: any) => {
          if (step.step.key === 'captureEmails') {
            setValue('emails', step.data?.emails);
          }
        });
      }
    }
  }, [maritimeFlow]);

  const handleNext = async () => {
    setActiveStep(activeStep === 'captureEmails' ? 'assignedTransport' : 'captureEmails');
  };

  const handleBack = () => {
    if (activeStep === 'captureEmails') return;
    setActiveStep('captureEmails');
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      setLoading(true);
      const dataForm = {
        data: {
          emails: data['emails'],
        },
        needStatusUpdate: !completed[activeStep],
        step: activeStep,
        files: [],
      };
      await axios.put(`/maritime-flow/${crossingId}`, dataForm);
      setCompleted({ ...completed, [activeStep]: true });

      if (activeStep === 'assignedTransport') {
        handleClose();
        successMessage('Se han enviado los documentos');
        return;
      }
      successMessage('Datos guardados correctamente');
      handleNext();
    } catch (error) {
      errorMessage('Ocurrio un error al guardar los datos');
    } finally {
      setLoading(false);
    }
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
      <Paper square elevation={0} sx={{ p: 3 }}>
        <Stepper activeStep={stepsForm.findIndex((e) => e.key === activeStep)}>
          {stepsForm.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {
          // eslint-disable-next-line sonarjs/cognitive-complexity
          stepsForm.map((step) => {
            if (step.key === activeStep) {
              return (
                <Stack key={step.key}>
                  {
                    !existsDodaFile && activeStep === 'assignedTransport' ? (
                      <Alert severity="error" sx={{ m: 2 }}>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                          No se puede continuar con el proceso de transporte y cita
                          {' '}
                          <b> ya que no existe un archivo DODA o PITA en la carpeta de despacho</b>
                        </Typography>
                      </Alert>
                    ) : (
                      <Alert severity={step.key === 'captureEmails' ? 'info' : 'success'} sx={{ m: 2 }}>
                        <Typography>
                          {
                            step.key === 'captureEmails'
                              ? 'Ingresa tu correo y pulsa enter para agregarlo'
                              : 'Todos listo para enviar documentos'
                          }
                        </Typography>
                      </Alert>
                    )
                  }
                  <form onSubmit={handleSubmit(onSubmit)} style={{ margin: 2 }}>
                    {
                      step.key === 'captureEmails' && (
                        <ControlledAutocomplete
                          multiple
                          errors={errors}
                          name="emails"
                          options={[]}
                          label="Correo electronicos"
                          control={control}
                          freeSolo
                          defaultValue={getValues('emails')}
                          key="actions-autocomplete"
                          optionLabel={(actionValue: any) => {
                            if (actionValue) {
                              return (
                                typeof actionValue === 'string'
                                  ? actionValue
                                  : actionValue?.name
                              );
                            }
                            return null;
                          }}
                          valueSerializer={
                            (actionValue: string[]) => actionValue.map((value) => value)
                          }
                        />
                      )
                    }
                    <Grid container spacing={2} sx={{ marginTop: 4 }}>
                      <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-end">
                          <LoadingButton
                            variant="contained"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                            disabled={activeStep === 'captureEmails'}
                            loading={loading}
                          >
                            Regresar
                          </LoadingButton>
                          <LoadingButton
                            variant="contained"
                            type="submit"
                            loading={loading}
                            disabled={!existsDodaFile && activeStep === 'assignedTransport'}
                          >
                            {step.labelButton}
                          </LoadingButton>
                        </Stack>
                      </Grid>
                    </Grid>
                  </form>
                </Stack>
              );
            }
            return null;
          })
        }
      </Paper>
    </Drawer>
  );
}
