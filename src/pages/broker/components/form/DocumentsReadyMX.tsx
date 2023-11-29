// MX Import
import { useState, useContext, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FieldValues, useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container,
  DialogContent,
  Grid,
  Stack,
  DialogActions,
  Button,
  Card,
  Typography,
  Box,
  InputAdornment,
  Alert,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import { TXT } from '../../utils/constants';
import { ControlledTextField } from '@/components';
import { NotificationsContext } from '@/contexts/NotificationsContext';
import ShipperValidationIcon from '../ShipperValidationIcon';
import ChildrenDropzone from '../ChildrenDropzone';
import ListShipping from '../ListShipping';

import { useAddHistory, useUpdateHistory } from '../../hooks/operation-detail';
import { uploadFiles, createArrayFiles } from '@/services/uploadFiles';
import { usePedimentoValidation } from '../../hooks/verifyPedimento';
import { useShippingStockAndTrace } from '../../hooks/verifyShippingOrder';
import { useShipperValidation } from '../../hooks/verifyTransit';
import { useStepInfo } from '../../hooks/stepInfo';
import { difference } from '@/utils/func';

type Pedimentos = {
  pedimento: string;
  fileId: string;
};

type Props = {
  submitFrom: () => void;
  onClose: () => void;
  operationId: string;
  skipStepUsa: boolean;
  isEdit?: boolean;
  isOnlyView?: boolean;
};

type ShippingOrders = {
  shippingOrderId: string;
  receiveOrders: string[];
};

interface Inputs extends Record<string, any> {
  arrayFields: {
    requirementNumber: string,
    remesa: string,
    businessName: string,
    references: string,
    invoiceNumber: string,
    packagesQuantity: string,
    patente: string,
    aduana: string,
  }[];
  shippingOrder?: string;
  shippingOrders: ShippingOrders[];
  gop?: {
    _id?: string,
    number?: string,
  };
  shipper?: string,
}

export function DocumentsReadyMX({
  submitFrom,
  onClose,
  operationId,
  skipStepUsa,
  isEdit = false,
  isOnlyView = true,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { setSnackBar } = useContext(NotificationsContext);
  const [addHistory, { loading }] = useAddHistory(operationId);
  const [oldValue, setOldValue] = useState<Inputs>();
  const [getStepInfo] = useStepInfo();
  const [updateHistory] = useUpdateHistory(operationId);
  const {
    debouncedValidation,
    data: shipperData,
    loading: loadingShipper,
    hasError: shipperError,
  } = useShipperValidation();
  const [getReceiptByExit, { loading: loadingShipping }] = useShippingStockAndTrace();
  const {
    validatePedimento, data: pedimentoValid, hasError, loading: loadingPedimento,
  } = usePedimentoValidation();
  const [arrayOfTxtFiles, setArrayOfTxtFiles] = useState<any[]>([]);
  const [indexInfo, setIndexInfo] = useState<number>(0);
  const [pedimentosValid, setPedimentosValid] = useState<Pedimentos[]>([]);
  const [shippings, setShippings] = useState<ShippingOrders | null>(null);
  const schema = yup.object({
    arrayFields: yup.array().of(
      yup.object().shape({
        requirementNumber: yup.string(),
        remesa: yup.string(),
        businessName: yup.string(),
        references: yup.string(),
        invoiceNumber: yup.string(),
        packagesQuantity: yup.string(),
        patente: yup.string(),
        aduana: yup.string(),
      }),
    ).min(1).required(),
    shippingOrder: yup.string().optional().nullable(),
    shippingOrders: yup.array().of(yup.object().shape({
      shippingOrderId: yup.string(),
      receiveOrders: yup.array().of(yup.string()),
    })),
    shipper: yup.string().optional().nullable(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors },
    control,
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      arrayFields: [
        {
          requirementNumber: '',
          remesa: '',
          businessName: '',
          references: '',
          invoiceNumber: '',
          packagesQuantity: '',
          patente: '',
          aduana: '',
        },
      ],
      shippingOrders: [],
      shipper: '',
    },
    resolver: yupResolver(schema) as any,
  });
  const getErrors = (name: 'shippingOrders' | 'arrayFields') => {
    const error = errors[name];
    if (error) {
      return error.message;
    }
    return null;
  };

  const searchInFile = (contentFile: string) => {
    let pedimento = '';
    let clave = '';
    let tipo = 0;
    let invoiceNumber = '';
    let totalPrice = 0;
    const splitSection = contentFile.split('\n');
    const section501 = splitSection.find((text) => text.startsWith('501|'));
    const section505 = splitSection.find((text) => text.startsWith('505|'));
    if (section501) {
      totalPrice = parseFloat(section501?.split('|')[TXT['501'].TOTAL_PRICE]);
      pedimento = section501?.split('|')[TXT['501'].PEDIMENTO];
      clave = section501?.split('|')[TXT['501'].CLAVE];
      tipo = parseInt(section501?.split('|')[TXT['501'].TIPO], 10);
    }
    if (section505) {
      invoiceNumber = section505?.split('|')[TXT['505'].INVOICE_NUMBER];
    }
    setSnackBar('error', String(totalPrice));
    return {
      pedimento,
      clave,
      tipo,
      invoiceNumber,
      totalPrice,
    };
  };

  const {
    fields, append, remove,
  } = useFieldArray({
    control,
    name: 'arrayFields',
  });

  const inputAddornment = <ShipperValidationIcon loadingShipper={loadingShipper} shipper={getValues('shipper')} shipperError={shipperError} />;

  const removeArrayField = (index: number) => {
    const filesRemove = arrayOfTxtFiles[index];
    if (filesRemove) {
      let newPedimentosValid = pedimentosValid;
      arrayOfTxtFiles.splice(index, 1);
      setArrayOfTxtFiles([...arrayOfTxtFiles]);
      filesRemove.forEach(({ id }: { id: string }) => {
        newPedimentosValid = newPedimentosValid.filter((pedimento) => pedimento.fileId !== id);
      });
      setPedimentosValid([...newPedimentosValid]);
    }
    remove(index);
  };

  const getStepData = async () => {
    const { data: stepInfo } = await getStepInfo({
      variables: {
        id: operationId,
        step: 5,
      },
    });

    reset({
      ...stepInfo?.getStepInfo,
    });
    setOldValue({
      ...stepInfo?.getStepInfo,
    } as unknown as Inputs);
  };

  useEffect(() => {
    if (isEdit) {
      getStepData();
    }
  }, [isEdit]);

  const checkFile = (index: number) => {
    const filesCheck = arrayOfTxtFiles[index];
    const quantityFiles = filesCheck.length;
    if (quantityFiles === 0) {
      return setSnackBar('error', 'No file selected');
    }
    if (quantityFiles > 1) {
      return setSnackBar('error', 'Only one file is allowed');
    }
    const documentCheck = filesCheck[0];
    if (documentCheck?.name?.split('.').pop()?.toLocaleLowerCase() === 'txt') {
      setIndexInfo(index);
      const lector = new FileReader();
      lector.onload = async (e) => {
        if (e.target?.result) {
          const content = e?.target.result as string;
          const {
            pedimento,
            clave,
            tipo,
            invoiceNumber,
          } = searchInFile(content);
          await validatePedimento(pedimento, clave, Number(tipo), documentCheck?.id, invoiceNumber);
        }
      };
      lector.readAsText(documentCheck as unknown as Blob);
      return null;
    }
    return setSnackBar('error', 'Only txt files are allowed');
  };

  useEffect(() => {
    if (pedimentoValid) {
      const {
        requirementNumber,
        remesa,
        businessName,
        reference,
        invoiceNumber,
        packagesQuantity,
        fileId,
        patente,
        aduana,
      } = pedimentoValid;
      const pedimentoExists = pedimentosValid.find(
        ({ pedimento }: { pedimento: string }) => pedimento === requirementNumber,
      );
      if (!pedimentoExists) {
        setPedimentosValid([...pedimentosValid, { pedimento: requirementNumber, fileId }]);
        setValue(`arrayFields.${indexInfo}`, {
          requirementNumber,
          remesa,
          businessName,
          references: reference,
          invoiceNumber,
          packagesQuantity,
          patente,
          aduana,
        });
        setSnackBar('success', 'Pedimento validado');
      } else {
        setSnackBar('warning', 'El pedimento ya fue validado');
      }
    }
    if (hasError) {
      setSnackBar('error', 'Pedimento no válido');
    }
  }, [pedimentoValid, hasError]);

  const submitHandler = async ({
    arrayFields, shippingOrders, shipper,
  }: FieldValues) => {
    const txtFiles = arrayOfTxtFiles.flat(1);
    const completeTxtFiles = arrayOfTxtFiles.every((arr) => arr?.length > 0);
    if (!skipStepUsa && shippingOrders.length === 0) {
      return setError('shippingOrders', {
        type: 'manual',
        message: 'Required',
      });
    }
    if ((txtFiles.length < 1 || !completeTxtFiles) && !isEdit) {
      return setSnackBar('error', t('broker.requirementFilesSchema'));
    }

    let txtDocs;
    const [txt] = await Promise.all(
      [uploadFiles(txtFiles)],
    );
    if (Array.isArray(txt)) {
      txtDocs = createArrayFiles(txt);
    }

    const stepData = {
      id: operationId,
      arrayFields,
      shippingOrders,
      txtFiles: txtDocs,
      step: 5,
      ...((shipperData || shipper) && {
        shipper: shipperData?.shipperCheck?.shipper ?? shipper,
        invoiceNumber: shipperData?.shipperCheck?.invoice,
      }),
    };

    if (isEdit) {
      const newValue = {
        arrayFields,
        shipper,
        shippingOrders,
      };

      const changes = difference<Inputs>(oldValue!, newValue);

      await updateHistory({
        variables: {
          ...stepData,
          logInput: {
            system: 'operations',
            user: '',
            action: 'update',
            newValue: JSON.stringify(changes),
            date: new Date(),
          },
        },
        onError: (e) => {
          setSnackBar('error', e.message);
        },
        onCompleted: () => {
          setSnackBar('success', t('broker.updateStepSuccess'));
        },
      });
      submitFrom();
      return null;
    }

    await addHistory({
      variables: stepData,
      onCompleted: () => {
        setSnackBar('success', t('broker.importMxSuccess'));
        submitFrom();
      },
      onError: (err: ApolloError) => {
        setSnackBar('error', err.message || t('broker.importMxError'));
      },
    });
    return null;
  };
  const removeTxtFile = (id: string, index: number) => {
    const files = arrayOfTxtFiles[index];
    const findFile = files.find((file: { id: string; }) => file.id === id);

    if (findFile && findFile.name?.split('.').pop()?.toLocaleLowerCase() === 'txt') {
      const pedimento = pedimentosValid.find(({ fileId }: { fileId: string }) => fileId === id);
      if (pedimento) {
        setValue(`arrayFields.${index}`, {
          requirementNumber: '',
          remesa: '',
          businessName: '',
          references: '',
          invoiceNumber: '',
          packagesQuantity: '',
          patente: '',
          aduana: '',
        });
        setPedimentosValid(pedimentosValid.filter(({ fileId }) => fileId !== id));
      }
    }
  };

  const addFieldHandler = () => append({
    requirementNumber: '',
    remesa: '',
    businessName: '',
    references: '',
    invoiceNumber: '',
    packagesQuantity: '',
    patente: '',
    aduana: '',
  });

  const searchExit = async () => {
    const soId = getValues('shippingOrder');
    await getReceiptByExit({
      variables: {
        soId,
      },
      onCompleted: (data) => {
        const arr = data
          .getReceiptByExit
          .receiveOrders;
        setShippings({
          receiveOrders: arr.filter((item: string, index: number) => arr.indexOf(item) === index),
          shippingOrderId: data.getReceiptByExit.shippingOrderId,
        });
      },
      onError: () => {
        setSnackBar('error', 'shipping not found');
      },
    });
  };
  const shippingOrdersData = getValues('shippingOrders');

  const addShipping = () => {
    if (shippings) {
      const idsShippings = shippingOrdersData?.map(({ shippingOrderId }) => shippingOrderId) ?? [];
      if (idsShippings.includes(shippings.shippingOrderId)) {
        setValue('shippingOrder', '');
        setShippings(null);
        return setSnackBar('error', 'shipping already added');
      }
      setValue('shippingOrders', [...shippingOrdersData, shippings]);
      setShippings(null);
    }
    return null;
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
        <DialogContent
          sx={{
            width: 'auto',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Grid
            container
            sx={{
              padding: 0,
              width: {
                lg: '800px',
                md: '600px',
              },
            }}
            spacing={2}
          >
            {/* Dynamic fields */}
            {
              fields.map((item, index) => (
                <Grid
                  container
                  sx={{
                    padding: 0,
                    width: {
                      lg: '800px',
                      md: '600px',
                    },
                    marginBottom: 4,
                  }}
                  spacing={2}
                  key={item.id}
                >
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Stack spacing={2} sx={{ mt: 1 }} direction="row">
                      <ControlledTextField
                        fieldName={`arrayFields[${index}].requirementNumber`}
                        errors={errors}
                        inputType="Txt"
                        label={t('broker.requirementLabel')}
                        register={register}
                        key="requirementNumber-field"
                        disabled
                      />
                      <ControlledTextField
                        fieldName={`arrayFields[${index}].patente`}
                        errors={errors}
                        inputType="Txt"
                        label="Patente"
                        register={register}
                        key="patente-field"
                        disabled
                      />
                      <ControlledTextField
                        fieldName={`arrayFields[${index}].aduana`}
                        errors={errors}
                        inputType="Txt"
                        label="Aduana"
                        register={register}
                        key="aduana-field"
                        disabled
                      />
                      <ControlledTextField
                        fieldName={`arrayFields[${index}].remesa`}
                        errors={errors}
                        inputType="Txt"
                        label="Remesa"
                        register={register}
                        key="remesa-field"
                        disabled
                      />
                      <ControlledTextField
                        fieldName={`arrayFields[${index}].businessName`}
                        errors={errors}
                        inputType="Txt"
                        label="Razón social"
                        register={register}
                        key="businessName-field"
                        disabled
                      />
                    </Stack>
                    <Stack spacing={2} sx={{ mt: 1 }} direction="row">
                      <ControlledTextField
                        fieldName={`arrayFields[${index}].references`}
                        errors={errors}
                        inputType="Txt"
                        label="Referencia"
                        register={register}
                        key="references-field"
                        disabled
                      />
                      <ControlledTextField
                        fieldName={`arrayFields[${index}].invoiceNumber`}
                        errors={errors}
                        inputType="Txt"
                        label="Factura"
                        register={register}
                        key="invoiceNumber-field"
                        disabled
                      />
                      <ControlledTextField
                        fieldName={`arrayFields[${index}].packagesQuantity`}
                        errors={errors}
                        inputType="Txt"
                        label="Total de bultos"
                        register={register}
                        key="packagesQuantity-field"
                        disabled
                      />
                    </Stack>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Stack
                      spacing={2}
                      sx={{ pt: 1 }}
                      direction="row"
                      justifyContent="space-around"
                      alignItems="center"
                    >
                      <ChildrenDropzone
                        fileSetter={setArrayOfTxtFiles}
                        index={index}
                        label="Txt Files *"
                        fileRemove={(id: string) => removeTxtFile(id, index)}
                        disabled={isOnlyView}
                      />
                      <LoadingButton variant="contained" onClick={() => checkFile(index)} loading={loadingPedimento} disabled={isOnlyView}>
                        Verificar
                      </LoadingButton>
                    </Stack>
                  </Grid>
                  {
                    fields.length > 1 && (
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Stack spacing={2} sx={{ pt: 1 }}>
                          <Button variant="contained" color="error" startIcon={<RemoveIcon />} onClick={() => removeArrayField(index)}>Remove</Button>
                        </Stack>
                      </Grid>
                    )
                  }
                </Grid>
              ))
            }
            <Container>
              <Button variant="contained" startIcon={<AddIcon />} onClick={addFieldHandler} disabled={isOnlyView}>Add requirement</Button>
            </Container>
          </Grid>
          {/* Dynamic fields end */}
          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ py: 2 }}>
                <ControlledTextField
                  fieldName="shippingOrder"
                  errors={errors}
                  inputType="text"
                  label="Numero de salida"
                  register={register}
                  key="shippingOrder-field"
                  disabled={isOnlyView}
                  startAdornment={(
                    <InputAdornment position="start">
                      S-
                    </InputAdornment>
                  )}
                />
                {getErrors('shippingOrders') && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} style={{ marginTop: 16 }}>
                    <Alert severity="error" style={{ width: '100%' }}>
                      {t('broker.messageShippingOrders')}
                    </Alert>
                  </Stack>
                )}
                <LoadingButton variant="contained" onClick={searchExit} loading={loadingShipping} disabled={isOnlyView}>
                  Buscar salida
                </LoadingButton>
                <Button variant="contained" onClick={addShipping} disabled={!shippings}>Agregar salida</Button>
                {shippings && (
                  <ListShipping
                    shipping={shippings}
                    showChildren
                  />
                )}
              </Stack>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ py: 2 }}>
                <Typography variant="h6" align="center">Salidas agregadas</Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: {
                      sx: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(2, 1fr)',
                    },
                  }}
                >
                  {shippingOrdersData && shippingOrdersData.map(({ shippingOrderId }) => (
                    <Card key="shippingOrderId-Key">
                      <Typography variant="h6" sx={{ p: 2 }} align="center">
                        {shippingOrderId}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <ControlledTextField
                fieldName="shipper"
                errors={errors}
                inputType="text"
                label="Shipper"
                register={register}
                key="shipper-field"
                disabled={isOnlyView}
                customOnChange={(value) => {
                  debouncedValidation(value);
                }}
                endAdornment={inputAddornment}
              />
            </Grid>
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <LoadingButton variant="contained" type="submit" loading={loading || loadingShipper} disabled={!!shipperError || isOnlyView}>
            {isEdit ? t('update') : t('register')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Container>
  );
}
