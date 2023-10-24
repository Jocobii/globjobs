import { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
  Stack,
  Box,
  Grid,
} from '@mui/material';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { SubmitHandler } from 'react-hook-form';
import { useFormWithSchema } from '@gsuite/shared/lib/react-hook-form';
import {
  FileData, FileDropZone as File, FileDropZone,
} from '@gsuite/typings/files';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';
import loadable from '@loadable/component';
import AttachedFile from './AttachedFile';
import useNodes from '../../hooks/useNodes';
import {
  redTeamSchema, AlertCreateFormProps, DataAlert, RedTeam,
} from '../../types';
import { useUpdateCruce } from '../../services/updateNodes';

const AlertForm = loadable(() => import('./AlertForm'), { fallback: <p>Loading...</p> });

const steps = ['Datos', 'Confirmación'];

type BaseProps = {
  onClose: () => void;
};

type CreateAlertProps = {
  title: string;
  teamId: string;
  id?: string;
  number?: string;
} & BaseProps;

function renderStepContent(
  step: number,
  {
    control,
    register,
    errors,
    filesSetter = () => null,
    files = [],
    cruceNumber = undefined,
    dataAlert,
  }: AlertCreateFormProps,
) {
  switch (step) {
    case 0:
      return (
        <ReactQuery>
          <AlertForm
            control={control}
            register={register}
            errors={errors}
            filesSetter={filesSetter}
            files={files}
          />
        </ReactQuery>
      );
    case 1:
      return (
        <Box
          sx={{ p: 3 }}
        >
          <Typography paragraph align="justify">
            Notificaras al equipo rojo sobre la operación
            {' '}
            <b>{cruceNumber}</b>
            {' '}
            <b>Anden: </b>
            {dataAlert?.anden}
            {' '}
            <b>Verificador: </b>
            {dataAlert?.checker}
            {' '}
            <b>Comentarios: </b>
            {dataAlert?.additionalComment}
          </Typography>
          <Stack>
            <Typography paragraph align="left">
              <b>Archivo adjunto: </b>
            </Typography>
            <AttachedFile
              fileAttached={dataAlert?.fileAttached}
            />
          </Stack>
          <Typography>¿Está seguro de notificar al equipo rojo?</Typography>
        </Box>
      );
    default:
      return <div>Not Found</div>;
  }
}

function getFileExtension(filename: string) {
  return filename.slice((filename.lastIndexOf('.') - 1) + 2);
}

export default function AlertRedTeamStepper({
  onClose, title, id = '', number = '', teamId = '',
}: CreateAlertProps) {
  const { successMessage, errorMessage } = useSnackNotification();
  const [activeStep, setActiveStep] = useState(0);
  const [optionalDocs, setOptionalDocs] = useState<File[]>([]);
  const [dataAlert, setDataAlert] = useState<DataAlert>();
  const isLastStep = activeStep === steps.length - 1;
  const { updateNode } = useUpdateCruce();

  const {
    createNodes,
    uploadFiles,
    addFilesS3,
    dispatchFile,
  } = useNodes();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useFormWithSchema(redTeamSchema);

  const onSubmit: SubmitHandler<RedTeam> = async (data) => {
    const { anden, checker, additionalComment } = data;

    const arrayFiles = optionalDocs.map((file) => ({
      id: file.id,
      name: file.name,
      ext: getFileExtension(file.name),
      url: file.type,
    }));
    const newData: DataAlert = {
      anden: anden.name || '',
      checker: checker.name || '',
      additionalComment,
      teamId,
      fileAttached: arrayFiles,
    };

    setDataAlert(newData);

    if (isLastStep) {
      const newNodes = async () => {
        const { dispatchFileNodes } = await createNodes(optionalDocs, dispatchFile);

        const dispatchFiles = dispatchFileNodes.map((node) => node.data?.file);
        const filesUpload = [...dispatchFiles].filter((file) => file) as FileDropZone[];
        const filesResponse = await uploadFiles(filesUpload);

        const { updateNodes } = addFilesS3(
          filesResponse as unknown as FileData[],
          dispatchFileNodes,
        );
        await updateNode({
          variables: {
            crossingId: id,
            anden: newData.anden,
            checker: newData.checker,
            teamId: newData.teamId,
            comments: newData.additionalComment,
            dispatchFile: updateNodes,
          },
          context: { clientName: 'globalization' },
        }).then(() => {
          setOptionalDocs([]);
          reset();
          successMessage('Alerta enviada con éxito');
          onClose();
        }, (rej) => {
          errorMessage(`Ha ocurrido un error al enviar alerta: ${rej}`);
        });
      };
      newNodes();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  function handleBack() {
    setActiveStep(activeStep - 1);
  }

  return (
    <Box sx={{ width: '100%', p: 5 }}>
      <Typography component="h1" variant="h4" align="left">
        {title}
      </Typography>
      <Box sx={{ width: '100%', pt: 5 }}>
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box sx={{ width: '100%', p: 3 }}>
        <form id="123" onSubmit={handleSubmit((value) => onSubmit(value))}>
          {renderStepContent(activeStep, {
            control,
            register,
            errors,
            files: optionalDocs,
            filesSetter: setOptionalDocs,
            cruceNumber: number,
            dataAlert,
          })}

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ mt: 3 }}
          >
            {(activeStep !== 0 && !isSubmitting) && (
              <Grid item xs={6} sm={6} container justifyContent="flex-start">
                <Button variant="outlined" onClick={() => handleBack()}>Editar alerta</Button>
              </Grid>
            )}
            {(activeStep === 0 && !isSubmitting) && (
              <Grid item xs={6} sm={6} container justifyContent="flex-start">
                <Button variant="outlined" onClick={() => onClose()}>Cancelar</Button>
              </Grid>
            )}

            {isSubmitting ? (
              <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                sx={{ pt: 10 }}
              >
                <Grid item xs={12} sm={12} justifyContent="center">
                  <CircularProgress size={42} />
                </Grid>
              </Stack>
            ) : (
              <Grid item xs={6} sm={6} container justifyContent="flex-end">
                {isLastStep ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Si, quiero alertar
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Alertar
                  </Button>
                )}
              </Grid>
            )}
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
