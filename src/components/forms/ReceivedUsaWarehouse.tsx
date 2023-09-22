// UsA warehouse receipt
import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Grid,
  Container,
  ListItem,
  ListItemText,
  List,
  Box,
  InputAdornment,
  Alert,
} from "@mui/material";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";

import { FileDropZone } from "@/typings/files";
import { NotificationsContext } from "@/contexts/NotificationsContext";
import ControlledTextField from "../ControlledTextField";
import Dropzone from "../Dropzone";
import ControlledAutocomplete from "../ControlledAutocomplete";
import { useStepInfo } from "@/services/stepInfo";

import { uploadFiles, createArrayFiles } from "@/services/uploadFiles";
import { useReceivedStockAndTrace } from "@/services/receivedStockAndTrace";
import {
  useAddHistory,
  useSkipStep,
  useUpdateHistory,
} from "@/services/operation-detail";
import { useCompanies } from "@/services/companies";
import TableReceived from "../TableReceived";
import { difference } from "@/utils/func";

type Lines = {
  receiveLineItemPackageName: string;
  receiveLineItemReceivedQty: number;
  packagesQuantity: number;
  receiveOrderCreationDate: string;
};

type ReceivedType = {
  number: string;
  receivedDate: string;
  lines: Lines[];
};

type Props = {
  submitFrom?: () => void;
  onClose: () => void;
  operationId?: string;
  isCreateOperation?: boolean;
  isEdit: boolean;
  isOnlyView?: boolean;
};

type AutoComplete = {
  _id: string;
  name: string;
  number: string;
};

interface ReceivedTypeStep extends Record<string, unknown> {
  receiptNumber?: string;
  notes: string;
}

const getReceiptRows = (receiptFound: ReceivedType) =>
  receiptFound?.lines?.map((receipt: Lines, index) => ({
    ...receipt,
    id: index,
  })) ?? [];

export default function ReceivedUsaWarehouse({
  submitFrom = () => null,
  onClose,
  operationId = "",
  isCreateOperation = false,
  isEdit,
  isOnlyView = false,
}: Props) {
  const { t } = useTranslation();
  const [getReceivedStockAndTrace, { loading: loadingReceived }] =
    useReceivedStockAndTrace();
  const { setSnackBar } = useContext(NotificationsContext);
  const [addHistory, { loading }] = useAddHistory(operationId);
  const [oldValue, setOldValue] = useState<ReceivedTypeStep>();
  const [skipStepUsa] = useSkipStep(operationId);
  const [getStepInfo] = useStepInfo();
  const [updateHistory] = useUpdateHistory(operationId);
  const [receiptFound, setReceiptFound] = useState<ReceivedType>();
  const [omitReceived, setOmitReceived] = useState(false);
  const schema = Yup.object({
    receiptNumber: Yup.string().optional().nullable(),
    receiptNumbers: Yup.array().of(
      Yup.object().shape({
        number: Yup.string().required(),
        lines: Yup.array().of(
          Yup.object().shape({
            receiveLineItemPackageName: Yup.string(),
            receiveLineItemReceivedQty: Yup.number(),
            packagesQuantity: Yup.number(),
          })
        ),
        receivedDate: Yup.string().optional(),
      })
    ),
    notes: Yup.string().optional(),
    client: Yup.string().optional(),
    clientNumber: Yup.string().optional(),
  });

  type FormValues = Yup.InferType<typeof schema>;

  const { data: companiesData } = useCompanies();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [additionalDocs, setAdditionalDocs] = useState<FileDropZone[]>([]);

  const getErrorReceives = () => {
    const { receiptNumbers } = errors;
    return receiptNumbers;
  };

  useEffect(() => {
    const getStepData = async () => {
      const { data: stepInfo } = await getStepInfo({
        variables: {
          id: operationId,
          step: 4,
        },
      });

      const newData = {
        ...stepInfo?.getStepInfo,
        releaseDate: stepInfo?.getStepInfo?.releaseDate
          ? new Date(stepInfo?.getStepInfo?.releaseDate)
              .toISOString()
              .slice(0, 16)
          : null,
      };

      reset({
        ...newData,
      } as unknown as ReceivedTypeStep);

      setOldValue({
        ...newData,
      } as unknown as ReceivedTypeStep);
    };

    if (isEdit) {
      getStepData();
    }
  }, [getStepInfo, isEdit, operationId, reset]);

  const skipStep = () => {
    skipStepUsa({
      variables: {
        id: operationId,
        isEdit,
      },
      onError: (e) => {
        setSnackBar("error", e.message);
      },
      onCompleted: () => {
        setSnackBar("success", t("broker.skipStepUsaSuccess"));
      },
    });
    onClose();
  };

  const AddReceived = () => {
    const { receiptNumbers } = getValues();
    if (!receiptNumbers) {
      if (receiptFound) {
        setValue("receiptNumbers", [receiptFound]);
      }
    } else {
      const repeatedIndex = receiptNumbers.findIndex(
        (receive) => receive?.number === receiptFound?.number
      );
      if (repeatedIndex >= 0) {
        setSnackBar("error", t("broker.duplicatedReceive"), 3000);
        setValue("receiptNumber", "");
        return setReceiptFound(undefined);
      }
      setValue("receiptNumbers", [
        receiptFound!,
        ...(getValues("receiptNumbers") ?? []),
      ]);
    }

    setValue("receiptNumber", "");
    return setReceiptFound(undefined);
  };

  const searchReceived = async () => {
    await getReceivedStockAndTrace({
      variables: {
        received: `R-${getValues("receiptNumber")}`,
      },
      onCompleted(data) {
        setReceiptFound({
          number: `R-${getValues("receiptNumber")}`,
          receivedDate:
            data.getReceivedStockAndTrace[0]?.receiveOrderCreationDate,
          lines: data.getReceivedStockAndTrace.map(
            ({
              receiveLineItemPackageName,
              receiveLineItemReceivedQty,
              packagesQuantity,
              receiveOrderCreationDate,
            }: Lines) => ({
              receiveLineItemPackageName,
              receiveLineItemReceivedQty,
              packagesQuantity,
              receiveOrderCreationDate,
            })
          ),
        });
      },
      onError() {
        setSnackBar("error", t("broker.receivedNotFound"));
      },
    });
  };

  const submitHandler = async ({
    receiptNumbers,
    notes,
    client,
    clientNumber,
  }: FormValues) => {
    if (isCreateOperation && (!client || !clientNumber)) {
      return setError("client", {
        type: "manual",
        message: t("broker.clientSchema"),
      });
    }
    if (!omitReceived && !receiptNumbers) {
      return setError("receiptNumbers", {
        type: "manual",
        message: t("broker.receiptNumbersSchema"),
      });
    }
    let additionalFiles = null;
    if (additionalDocs.length) {
      const files = await uploadFiles(additionalDocs);
      if (Array.isArray(files)) {
        additionalFiles = createArrayFiles(files);
      }
    }

    const stepData = {
      id: operationId,
      receiptNumbers,
      notes,
      additionalFiles,
      step: 4,
      client,
      clientNumber,
      isCreateOperation,
      ...(omitReceived && { skipStepUsa: omitReceived }),
    };

    if (isEdit) {
      const newValue = {
        notes,
      };

      const changes = difference(
        oldValue ?? ({} as ReceivedTypeStep),
        newValue
      );
      await updateHistory({
        variables: {
          ...stepData,
          logInput: {
            system: "operations",
            user: "",
            action: "update",
            newValue: JSON.stringify(changes),
            date: new Date(),
          },
        },
        onError: (e) => {
          setSnackBar("error", e.message);
        },
        onCompleted: () => {
          setSnackBar("success", t("broker.updateStepSuccess"));
        },
      });
      submitFrom();
      return null;
    }

    await addHistory({
      variables: stepData,
      onError: () => {
        setSnackBar("error", t("broker.receiptUsaError"));
      },
      onCompleted: () => {
        setSnackBar("success", t("broker.receiptUsaSuccess"));
        onClose();
      },
    });
    return submitFrom();
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent
          sx={{
            width: "auto",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Grid
            container
            sx={{
              padding: 0,
              width: {
                lg: "800px",
                md: "600px",
              },
            }}
            spacing={2}
          >
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledTextField
                  errors={errors}
                  fieldName="receiptNumber"
                  inputType="text"
                  label={t("broker.receiptLabel")}
                  register={register}
                  key="receiptNumber-field"
                  disabled={omitReceived || isOnlyView}
                  startAdornment={
                    <InputAdornment position="start">R-</InputAdornment>
                  }
                />
                {isCreateOperation && (
                  <Button
                    onClick={() => setOmitReceived(true)}
                    disabled={omitReceived || isOnlyView}
                  >
                    {t("broker.omitReceipt")}
                  </Button>
                )}
              </Stack>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <LoadingButton
                  variant="contained"
                  loading={loadingReceived}
                  onClick={searchReceived}
                  disabled={omitReceived || isOnlyView}
                >
                  {t("broker.search")}
                </LoadingButton>
                <Button
                  onClick={AddReceived}
                  disabled={omitReceived || isOnlyView}
                >
                  {t("add")}
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <ControlledTextField
                errors={errors}
                fieldName="notes"
                inputType="text"
                label={t("broker.notesLabel")}
                register={register}
                key="notes-field"
                disabled={isOnlyView}
              />
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                {isCreateOperation && (
                  <ControlledAutocomplete
                    errors={errors}
                    name="client"
                    label={`${t("broker.clientLabel")} *`}
                    control={control}
                    options={companiesData?.findCompanies ?? []}
                    key="clients-autocomplete"
                    optionLabel={({ name, number }: AutoComplete) =>
                      `${number} - ${name}`
                    }
                    valueSerializer={({ name, number }: AutoComplete) => {
                      setValue("clientNumber", number);
                      return name;
                    }}
                  />
                )}
                {receiptFound?.lines && (
                  <TableReceived received={getReceiptRows(receiptFound)} />
                )}
              </Stack>
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {getErrorReceives() && (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 3, sm: 2 }}
                  style={{ marginTop: 16 }}
                >
                  <Alert severity="error" style={{ width: "100%" }}>
                    {t("broker.messageAddReceived")}
                  </Alert>
                </Stack>
              )}
              <List>
                <Box
                  sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: {
                      sx: "repeat(1, 1fr)",
                      sm: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    },
                  }}
                >
                  {getValues("receiptNumbers")?.map((received, index) => (
                    <ListItem
                      key={`${received.number + index} - ${
                        received.receivedDate
                      }`}
                    >
                      <ListItemText
                        primary={received.number}
                        secondary={received.receivedDate}
                      />
                    </ListItem>
                  ))}
                </Box>
              </List>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Dropzone
                disabled={isOnlyView}
                label={t("broker.additionalFiles")}
                files={additionalDocs}
                filesSetter={setAdditionalDocs}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {!isCreateOperation && (
            <Button onClick={skipStep} disabled={isOnlyView}>
              {t("broker.skipStep")}
            </Button>
          )}
          <Button onClick={onClose}>{t("cancel")}</Button>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={loading}
            disabled={isOnlyView}
          >
            {isEdit ? t("update") : t("register")}
          </LoadingButton>
        </DialogActions>
      </form>
    </Container>
  );
}
