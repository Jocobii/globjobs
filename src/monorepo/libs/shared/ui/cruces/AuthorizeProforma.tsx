import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  DialogContent,
  Grid,
  Stack,
  IconButton,
  Typography,
  Box,
  Divider,
  Button,
  Stepper,
  Step,
  StepLabel,
  Container,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import { Dropzone, ControlledTextField } from '@gsuite/shared/ui';
import { FileData, FileDropZone, NodeModels } from '@gsuite/typings/files';
import { TFunctionType, PaymentMethods } from '@gsuite/typings/common';
import { History, useCrossing } from '@gsuite/shared/contexts';
import { useCruceDetail } from '@gsuite/shared/services/cruces/cruce-detail';
import { useTranslation } from 'react-i18next';
import { useProformaReview } from '@gsuite/shared/services/cruces';
import * as yup from 'yup';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useUpdateCruce } from '@gsuite/shared/services/cruces/cruce-update';
import { useUpdateCruceHistory } from '@gsuite/shared/services/cruces/update-history';
import * as status from '@gsuite/shared/seeders/status';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FieldValues,
  useForm,
  UseFormRegister,
  FieldErrors,
} from 'react-hook-form';
import UnauthorizeProforma from './UnauthorizeProforma';
import { uploadFiles, extension } from '../../utils/uploadFile';
import { downloadProformaFiles } from '../../services/cruces/downloadProformaFiles';

type PredeterminedPayments = `${PaymentMethods}`;

type Props = {
  node: NodeModels;
  crossingId: string;
  fileId: string;
  fileName: string;
  fileUrl: string;
  onClose: () => void;
};

type ProformaRevisionProps = {
  patente: string;
  aduana: string;
  pedimento: string;
  amount: string;
  predeterminedPayment: PredeterminedPayments;
  t: TFunctionType;
};

type AuthorizeProformaProps = {
  amount: string;
  predeterminedPayment: PredeterminedPayments;
  t: TFunctionType;
  setFiles: Dispatch<SetStateAction<FileDropZone[]>>;
  files: FileDropZone[];
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  requiredFilesError: boolean;
};

const getPredeterminedPaymentAlias = (
  predeterminedPayment: PredeterminedPayments,
  t: TFunctionType,
) => {
  switch (predeterminedPayment) {
    case PaymentMethods.CAPTURE_LINE:
      return t('cruces.proform.captureLinePaymentMethodLabel');
    case PaymentMethods.FINANCING:
      return t('cruces.proform.financingPaymentMethodLabel');
    case PaymentMethods.PECE:
      return t('cruces.proform.peceLinePaymentMethodLabel');
    case PaymentMethods.PECE_AGENCY:
      return t('cruces.proform.peceAgencyLinePaymentMethodLabel');
    default:
      return 'unknown';
  }
};

function AuthorizeProforma({
  amount,
  predeterminedPayment,
  t,
  files,
  errors,
  register,
  setFiles,
  requiredFilesError,
}: AuthorizeProformaProps) {
  const paymentLabel = getPredeterminedPaymentAlias(predeterminedPayment, t);
  return (
    <Stack alignItems="center" direction="column" spacing={3} m={3}>
      <Stack
        alignItems="center"
        direction="column"
        sx={{ width: '100%' }}
      >
        <Stack
          direction="column"
          alignItems="center"
          p={3}
          spacing={2}
          sx={{
            borderColor: 'lightgray',
            border: 1.5,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{ fontSize: 20, fontWeight: 600 }}
          >
            {t('cruces.proform.authorizeWarning')}
          </Typography>
          <CheckCircleIcon color="success" sx={{ fontSize: 30 }} />
          <Typography color="gray">{t('cruces.proform.cashAmount')}</Typography>
          <Typography color="primary" sx={{ fontSize: 25, fontWeight: 800 }}>{`$${amount} MX`}</Typography>
          <Typography color="gray">{t('cruces.proform.predeterminedPayment')}</Typography>
          <Typography color="primary" sx={{ fontSize: 20, fontWeight: 600 }}>{paymentLabel}</Typography>
        </Stack>
      </Stack>
      <Typography textAlign="justify" color="gray">
        {t('cruces.proform.optionalFiles')}
      </Typography>
      <Stack
        alignItems="center"
        direction="column"
        sx={{ width: '100%' }}
      >
        <Dropzone
          label="Archivos"
          files={files}
          filesSetter={setFiles}
        />
        <Stack direction="row" justifyContent="flex-start" sx={{ minWidth: '100%' }}>
          {requiredFilesError && (
            predeterminedPayment === PaymentMethods.CAPTURE_LINE
            || predeterminedPayment === PaymentMethods.PECE_AGENCY
          ) && (
            <Typography textAlign="left" color="error">
              {t('cruces.proform.requiredFilesByPayment', { predeterminedPayment })}
            </Typography>
          )}
        </Stack>
      </Stack>
      <ControlledTextField
        minRows={4}
        multiline
        label={t('cruces.addComments')}
        register={register}
        inputType="text"
        errors={errors}
        fieldName="comments"
        key="patente-field"
      />
    </Stack>
  );
}

function ProformaRevision({
  patente,
  aduana,
  pedimento,
  amount,
  predeterminedPayment,
  t,
}: ProformaRevisionProps) {
  const paymentLabel = getPredeterminedPaymentAlias(predeterminedPayment, t);
  return (
    <Stack alignItems="center" direction="column" spacing={4} px={5}>
      <Typography textAlign="justify" color="gray">
        {t('cruces.proform.revisionDescription')}
      </Typography>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ minWidth: '100%' }}
      >
        <Stack direction="column" alignItems="center">
          <Typography color="primary" sx={{ fontSize: 25, fontWeight: 600 }}>{patente}</Typography>
          <Typography color="gray">{t('cruces.table.patent')}</Typography>
        </Stack>
        <Stack direction="column" alignItems="center">
          <Typography color="primary" sx={{ fontSize: 25, fontWeight: 600 }}>{aduana}</Typography>
          <Typography color="gray">{t('cruces.table.customs')}</Typography>
        </Stack>
        <Stack direction="column" alignItems="center">
          <Typography color="primary" sx={{ fontSize: 25, fontWeight: 600 }}>{pedimento}</Typography>
          <Typography color="gray">{t('cruces.table.pediment')}</Typography>
        </Stack>
      </Stack>
      <Stack
        alignItems="center"
        direction="column"
        sx={{ width: '100%' }}
      >
        <Stack
          direction="column"
          alignItems="center"
          p={3}
          sx={{
            borderColor: 'lightgray',
            border: 1.5,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography color="gray">{t('cruces.proform.cashAmount')}</Typography>
          <Typography color="primary" sx={{ fontSize: 25, fontWeight: 800 }}>{`$${amount} MX`}</Typography>
        </Stack>
      </Stack>
      <Stack
        alignItems="center"
        direction="column"
        sx={{ width: '100%' }}
      >
        <Stack
          direction="column"
          alignItems="center"
          p={3}
          sx={{
            borderColor: 'lightgray',
            border: 1.5,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography color="gray">{t('cruces.proform.predeterminedPayment')}</Typography>
          <Typography color="primary" sx={{ fontSize: 20, fontWeight: 600 }}>{paymentLabel}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default function ProformaDialog({
  node,
  crossingId,
  fileId,
  fileName,
  fileUrl,
  onClose,
}: Props) {
  const [activeStep, setActiveStep] = useState(1);
  const [authorize, setAuthorize] = useState(false);
  const [submitUnauthorized, setSubmitUnauthorize] = useState(false);
  const [hasComments, setComments] = useState('');
  const [deleteProforma, setDeleteProforma] = useState(false);
  const { crossing } = useCrossing();
  const [unauthorize, setUnauthorize] = useState(false);
  const [canDisable, setCanDisable] = useState(false);
  const { t } = useTranslation();
  const { data: crossingData, refetch } = useCruceDetail(crossingId);
  const value = crossingData?.getCrossing;
  const { data, error: graphError } = useProformaReview(crossingId, fileId);
  const { successMessage, errorMessage } = useSnackNotification();
  const [files, setFiles] = useState<FileDropZone[]>([]);
  const [requiredFilesError, setRequiredFilesError] = useState(false);
  const { updateCrossing } = useUpdateCruce();

  useEffect(() => {
    if (requiredFilesError && files?.length > 0) setRequiredFilesError(false);
  }, [files?.length]);

  const schema = yup.object().shape({
    comments: yup.string().required('Este campo es requerido')
      .max(150, t('cruces.proform.comentMaxLenghtMessage')),
  });

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (!graphError) return;
    errorMessage(graphError.message, { vertical: 'top', horizontal: 'center' });
  }, [graphError]);

  const { updateHistory } = useUpdateCruceHistory();

  const findStatus = status.STATUS_CRUCE.find((s) => s.name === 'Autorización de Proforma');

  const updateHistoryProforma = async (newFiles?: FileData[]) => updateHistory({
    variables: {
      operation: {
        id: crossingId,
        action: 'update_proforma',
        files: findStatus?.name,
        ...(getValues().comments && {
          comments: getValues().comments,
        }),
        ...(newFiles && newFiles?.length > 0 && {
          files: newFiles.map((f) => `${f.key}`),
        }),
      },
    },
    context: { clientName: 'globalization' },
  });

  const handleFilesDownload = async () => {
    const filesResponse = await downloadProformaFiles(crossingId, String(node?.parent));
    if (filesResponse && filesResponse.size > 0) {
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(filesResponse);
      link.href = url;

      const attributeValue = String(filesResponse?.type).includes('zip')
        ? `${t('cruces.proform.proformFiles')}.zip`
        : `${node.data?.name}.pdf`;

      link.setAttribute('download', attributeValue);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const updateProforma = async (newFiles?: FileData[]) => {
    const newCrossing = { ...value };
    let newFileNodes;

    const targetActionIndex = newCrossing?.requiredActions?.findIndex(
      (f) => (f.nameFile === fileName) && !f.resolved,
    ) as number;

    const targetNodeIndex = newCrossing.nodes?.tree.findIndex(
      (n) => n.id === node.id,
    ) as number;

    if (
      targetNodeIndex >= 0
      && targetActionIndex >= 0
      && newCrossing.nodes?.tree
      && newCrossing.requiredActions
    ) {
      const newNodes = [...newCrossing.nodes.tree];
      newNodes[targetNodeIndex] = {
        ...newCrossing.nodes.tree[targetNodeIndex],
        data: {
          ...newCrossing.nodes.tree[targetNodeIndex]?.data,
          pendingAuthorization: false,
        },
      };

      const newActions = [...newCrossing.requiredActions];
      newActions[targetActionIndex] = {
        ...newCrossing.requiredActions[targetActionIndex],
        resolved: true,
      };

      if (newFiles && newFiles?.length > 0) {
        newFileNodes = newFiles.map(({ key, url }) => {
          const { ext, name } = extension(key as string);
          return {
            id: name,
            text: name,
            parent: node.parent,
            droppable: false,
            data: {
              file: {
                url,
                key,
                name,
              },
              ext,
              name,
              tags: null,
            },
          };
        });
      }

      const newCrossingUpdated = {
        ...newCrossing,
        nodes: {
          ...newCrossing.nodes,
          tree: newNodes,
          ...(newFileNodes && Array.isArray(newFileNodes) && {
            tree: [...newNodes, ...newFileNodes],
          }),
        },
        requiredActions: newActions,
      };

      delete newCrossingUpdated?.user;

      await updateCrossing({
        variables: {
          crossing: {
            ...newCrossingUpdated,
            id: crossingId,
          },
        },
        context: { clientName: 'globalization' },
        onCompleted: async () => {
          await updateHistoryProforma(newFiles);
          successMessage(t('cruces.proform.paymentSuccesfullyAuthorized'), { vertical: 'top', horizontal: 'right' });
          refetch();
        },
      });
    }
  };

  const updateToUnauthorized = async () => updateHistory({
    variables: {
      operation: {
        id: crossingId,
        action: 'unauthorize_proforma',
        comments: hasComments,
      },
    },
    context: { clientName: 'globalization' },
  });

  const handleSubmitUnauthorize = (success: boolean) => {
    const newCrossing = { ...value };
    const nodesToSearch = crossing?.isWithoutTxtFlow
      ? newCrossing?.nodes?.externalNode
      : newCrossing?.nodes?.tree;

    const proformaNode = nodesToSearch?.find((n: NodeModels) => n.data?.tags?.toLocaleLowerCase() === 'proforma');
    const proformaUpdated = {
      ...proformaNode,
      data: {
        ...proformaNode?.data,
        unauthorized: true,
        pendingAuthorization: false,
      },
    };

    setSubmitUnauthorize(false);
    setDeleteProforma(false);
    setUnauthorize(false);
    if (success) {
      updateCrossing({
        variables: {
          crossing: {
            ...newCrossing,
            requiredActions: newCrossing?.requiredActions?.map(
              (ra) => {
                if (ra.nameFile === proformaUpdated.data?.file?.name) {
                  return {
                    ...ra,
                    resolved: true,
                  };
                }
                return ra;
              },
            ) || [],
            nodes: {
              ...newCrossing.nodes,
              ...(crossing?.isWithoutTxtFlow ? {
                externalNode: [...newCrossing?.nodes?.externalNode?.filter((e) => e.data?.tags?.toLocaleLowerCase() !== 'proforma') || [], proformaUpdated],
              } : {
                tree: [...newCrossing?.nodes?.tree.filter((e) => e.data?.tags?.toLocaleLowerCase() !== 'proforma') || [], proformaUpdated],
              }),
            },
            id: crossingId,
          },
        },
        context: { clientName: 'globalization' },
        onCompleted: async () => {
          errorMessage('Proforma No Autorizada', { vertical: 'top', horizontal: 'right' });
          updateToUnauthorized();
          onClose();
          refetch();
        },
      });
    }
  };

  const {
    aduana,
    patente,
    paymentMethod,
    pedimento,
    amount,
  } = data?.infoProformaReview ?? {
    aduana: '',
    patente: '',
    paymentMethod: '',
    pedimento: '',
    amount: '',
  };

  useEffect(() => {
    if (
      files?.length < 1
      && (
        paymentMethod === PaymentMethods.CAPTURE_LINE
        || paymentMethod === PaymentMethods.PECE_AGENCY
      )) {
      setCanDisable(true);
      return;
    }
    setCanDisable(false);
  }, [files?.length, paymentMethod]);

  const updateHistoryStatus = async () => updateHistory({
    variables: {
      operation: {
        id: crossingId,
        action: 'update_status',
        files: findStatus?.name,
      },
    },
    context: { clientName: 'globalization' },
  });

  // WARD
  const updateStatus = async () => {
    await updateCrossing({
      variables: {
        crossing: {
          id: crossingId,
          status: findStatus,
        },
      },
      context: { clientName: 'globalization' },
      onCompleted: async () => {
        await updateHistoryStatus();
        refetch();
      },
    });
  };

  const onSubmit = async () => {
    if (
      (paymentMethod === PaymentMethods.CAPTURE_LINE
      || paymentMethod === PaymentMethods.PECE_AGENCY)
      && files?.length < 1
    ) {
      return setRequiredFilesError(true);
    }

    let newFiles: FileData[] | undefined;

    if (files.length > 0) {
      const filesResponse = await uploadFiles(files);
      if (Array.isArray(filesResponse)) {
        newFiles = filesResponse;
      }
    }
    await updateProforma(newFiles).then(() => updateStatus());
    return onClose();
  };

  if (graphError) onClose();

  return (
    <>
      <Stack
        sx={{
          p: 3,
          minWidth: '100%',
          textAlign: 'right',
        }}
        alignContent="center"
        justifyContent="space-between"
        direction="row"
      >
        <Typography sx={{ fontWeight: 800, fontSize: 25 }}>{fileName}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider />
      <Container sx={{ p: 2 }} maxWidth="sm">
        <Stepper activeStep={activeStep}>
          <Step key="1">
            <StepLabel>{t('cruces.proform.stepFileRevision')}</StepLabel>
          </Step>
          <Step key="2">
            <StepLabel>{t('cruces.proform.stepPaymentAuthorization')}</StepLabel>
          </Step>
        </Stepper>
      </Container>
      <Divider />
      <DialogContent sx={{ p: 3, width: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Box sx={{ minWidth: '100%', height: 800 }}>
              <iframe
                src={fileUrl}
                title={fileName}
                style={{ width: '100%', height: '100%', border: 'none' }}
                loading="lazy"
              />
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Box sx={{ minWidth: '100%', height: 800 }}>
              {(activeStep === 1) && (
                <ProformaRevision
                  t={t}
                  patente={patente}
                  aduana={aduana}
                  pedimento={pedimento}
                  amount={amount}
                  predeterminedPayment={paymentMethod as PredeterminedPayments}
                />
              )}
              {(activeStep === 2 && authorize)
                && (
                <AuthorizeProforma
                  requiredFilesError={requiredFilesError}
                  errors={errors}
                  files={files}
                  register={register}
                  setFiles={setFiles}
                  t={t}
                  amount={amount}
                  predeterminedPayment={paymentMethod as PredeterminedPayments}
                />
                )}
              {((activeStep === 2 && unauthorize) || node.data?.unauthorized)
                && (
                <UnauthorizeProforma
                  history={value?.history?.filter((h: History) => h.action === 'unauthorized_proforma'
                  && h.files.includes(node?.data?.name ?? '')) ?? []}
                  crossingId={crossingId}
                  onClose={handleSubmitUnauthorize}
                  deleteProforma={deleteProforma}
                  submitUnauthorized={submitUnauthorized}
                  node={node}
                  amount={amount}
                  setComments={setComments}
                  predeterminedPayment={paymentMethod as PredeterminedPayments}
                />
                )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <Stack
        sx={{ minWidth: '100%', p: 3 }}
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <IconButton
          sx={{ borderWidth: '1px', borderColor: 'primary', borderStyle: 'solid' }}
          color="primary"
          onClick={handleFilesDownload}
          title={t('downloadFiles')}
        >
          <DownloadIcon />
        </IconButton>
        <Stack
          direction="row"
          spacing={2}
        >
          {node.data?.unauthorized && (
          <Button
            startIcon={<CheckCircleIcon />}
            variant="outlined"
            onClick={() => setDeleteProforma(true)}
          >
            {t('cruces.proform.deleteFile')}
          </Button>
          )}
          {(activeStep === 1 && !authorize && !unauthorize && !node.data?.unauthorized) && (
          <>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={() => {
                setActiveStep((prev) => prev + 1);
                setUnauthorize(true);
              }}
            >
              {t('cruces.proform.unauthorize')}
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={() => {
                setActiveStep((prev) => prev + 1);
                setAuthorize(true);
              }}
            >
              {t('cruces.proform.authorize')}
            </Button>
          </>
          )}
          {(activeStep === 2 && authorize) && (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setActiveStep((prev) => prev - 1);
                setAuthorize(false);
              }}
            >
              {t('cruces.proform.goBack')}
            </Button>
            <Button
              variant="contained"
              disabled={canDisable}
              startIcon={<CheckCircleIcon />}
              onClick={() => onSubmit()}
            >
              {t('cruces.proform.authorizePayment')}
            </Button>
          </>
          )}
          {(activeStep === 2 && unauthorize) && (
          <>
            <Button
              variant="outlined"
              onClick={async () => {
                setActiveStep((prev) => prev - 1);
                setUnauthorize(false);
              }}
            >
              {t('cruces.proform.goBack')}
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              disabled={!hasComments}
              onClick={() => handleSubmitUnauthorize(true)}
            >
              {t('cruces.proform.confirmUnauthorize')}
            </Button>
          </>
          )}
        </Stack>
      </Stack>
    </>
  );
}
