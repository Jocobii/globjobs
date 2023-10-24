// USA import
import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Grid,
  Container,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { FieldValues, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';

import { FileDropZone } from '@gsuite/typings/files';
import { ControlledSelect, ControlledTextField, Dropzone } from '@gsuite/shared/ui';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';
import { STEPS_NAMES } from '@gsuite/shared/constants';
import { omit } from 'lodash';
import { useAddHistory, useUpdateHistory } from '../../services/operation-detail';
import { useInbondValidation, useInvoiceValidation, VerifyInvoice } from '../../services/verifyTransit';
import { uploadFiles, createArrayFiles } from '../../services/uploadFiles';
import { useStepInfo } from '../../services/stepInfo';
import { difference } from '../../helper';
import InboundValidationIcon from '../InboundValidationIcon';

type Props = {
  submitFrom: () => void;
  onClose: () => void;
  operationId: string;
  number: string;
  clientNumber: string;
  isEdit: boolean;
  isOnlyView: boolean;
};

interface ImpusaStep extends Record<string, unknown> {
  importType: string | undefined;
  entryType: string | undefined;
  releaseDate: string | null;
  notes: string | undefined;
  references: string | undefined;
}
const importTypes = ['Formal Entry', 'Inbond'];

export default function InboundEEUU({
  submitFrom, onClose, operationId, number, clientNumber,
  isEdit, isOnlyView,
}: Props) {
  const { t } = useTranslation();
  const { INBOUND_EEUU } = STEPS_NAMES;
  const { setSnackBar } = useContext(NotificationsContext);
  const [addHistory, { loading }] = useAddHistory(operationId);
  const {
    debouncedValidation,
    data,
    loading: loadingEntryType,
    hasError,
  } = useInbondValidation();
  const {
    debouncedValidation: invoiceValidation,
    data: invoiceData,
  } = useInvoiceValidation();
  const [updateHistory] = useUpdateHistory(operationId);
  const [getStepInfo] = useStepInfo();
  const [additionalDocs, setAdditionalDocs] = useState<FileDropZone[]>([]);
  const [label, setLabel] = useState<string>('');
  const [isInbond, setIsInbond] = useState(false);
  const [oldValue, setOldValue] = useState<ImpusaStep>();
  const schema = Yup.object({
    importType: Yup.string().required(t<string>('broker.importTypeSchema')),
    entryType: Yup.string().when('importType', {
      is: (importType: string) => importType === 'Inbond',
      then: Yup.string().required(t<string>('broker.entryTypeSchema'))
        .min(7, t<string>('broker.entryTypeMin')),
    }),
    releaseDate: Yup.string().required(t<string>('broker.releaseDateSchema')),
    notes: Yup.string().nullable().optional(),
    references: Yup.string().nullable().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    getValues,
    reset,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
  });

  watch((value) => {
    const { importType } = value;
    setIsInbond(importType === 'Inbond');
    setLabel(importType || 'Select entry type');
  });

  useEffect(() => {
    const getStepData = async () => {
      const { data: stepInfo } = await getStepInfo({
        variables: {
          id: operationId,
          step: INBOUND_EEUU,
        },
      });

      const newImpusa = {
        ...stepInfo?.getStepInfo,
        releaseDate: stepInfo?.getStepInfo?.releaseDate
          ? new Date(stepInfo?.getStepInfo?.releaseDate).toISOString().slice(0, 16)
          : null,
      };

      reset({
        ...newImpusa,
      });

      setOldValue({
        importType: newImpusa.importType,
        entryType: newImpusa.entryType,
        releaseDate: newImpusa.releaseDate,
        notes: newImpusa.notes,
        references: newImpusa.references,
      });
    };
    if (isEdit) {
      getStepData();
    }
  }, [INBOUND_EEUU, getStepInfo, isEdit, operationId, reset]);

  const submitHandler = async ({
    importType, entryType, releaseDate, notes, references,
  }: FieldValues) => {
    let additionalFiles = null;
    if (additionalDocs.length) {
      const files = await uploadFiles(additionalDocs);
      if (Array.isArray(files)) {
        additionalFiles = createArrayFiles(files);
      }
    }

    const dateForUpdateOrAdd = {
      id: operationId,
      importType,
      ...(entryType && { entryType }),
      ...(invoiceData?.transit
        && {
          additionalCharges: invoiceData.transit.map((transit: VerifyInvoice) => omit(transit, '__typename')),
        }),
      releaseDate,
      notes,
      references,
      additionalFiles,
      step: INBOUND_EEUU,
      number,
    };

    if (isEdit) {
      const newValue = {
        importType, entryType, releaseDate, notes, references,
      };

      const changes = difference<ImpusaStep>(
        oldValue ?? {} as ImpusaStep,
        newValue,
      );

      await updateHistory({
        variables: {
          ...dateForUpdateOrAdd,
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
          setSnackBar('success', t<string>('broker.updateStepSuccess'));
        },
      });
      submitFrom();
      return;
    }
    await addHistory({
      variables: dateForUpdateOrAdd,
      onCompleted: () => {
        setSnackBar('success', t('broker.importUsaSuccess'));
      },
      onError: (error) => {
        setSnackBar('error', error.message ?? t('broker.importUsaError'));
      },
    });
    submitFrom();
  };

  const inputAddornment = <InboundValidationIcon loadingEntryType={loadingEntryType} entryType={getValues('entryType')} hasError={hasError} />;
  return (
    <Container>
      <form onSubmit={handleSubmit(submitHandler)}>
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
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledSelect
                  name="importType"
                  label={`${t<string>('broker.importTypeLabel')} *`}
                  control={control}
                  defaultValue=""
                  key="importType-select"
                  errors={errors}
                  disabled={isOnlyView}
                >
                  {importTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </ControlledSelect>
                <ControlledTextField
                  errors={errors}
                  fieldName="releaseDate"
                  inputType="datetime-local"
                  label={`${t<string>('broker.releaseDateLabel')} *`}
                  register={register}
                  disabled={isOnlyView}
                />
              </Stack>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                {getValues('importType') === 'Inbond' && (
                  <ControlledTextField
                    label={label || t('broker.selectImportType')}
                    errors={errors}
                    fieldName="entryType"
                    inputType="text"
                    register={register}
                    disabled={isOnlyView}
                    customOnChange={(value) => {
                      debouncedValidation(value, clientNumber);
                      invoiceValidation(value);
                    }}
                    endAdornment={inputAddornment}
                  />
                )}
                <ControlledTextField
                  label={t<string>('broker.notesLabel')}
                  errors={errors}
                  fieldName="notes"
                  inputType="text"
                  register={register}
                  disabled={isOnlyView}
                />
              </Stack>
            </Grid>
            {data?.transit && data.transit?.map((invoice: { material?: string }) => (
              <Grid key="SoyUnaKeyGrid" item lg={6} md={6} sm={12} xs={12}>
                <List>
                  <ListItem key={invoice.material}>
                    <ListItemText primary={invoice.material} />
                  </ListItem>
                </List>
              </Grid>
            ))}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <ControlledTextField
                errors={errors}
                fieldName="references"
                inputType="text"
                label={t<string>('broker.referencesLabel')}
                register={register}
                disabled={isOnlyView}
              />
            </Grid>
          </Grid>
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
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Dropzone
                key="additional-docs-dropzone"
                label={t<string>('broker.additionalFiles')}
                files={additionalDocs}
                filesSetter={setAdditionalDocs}
                disabled={isOnlyView}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t<string>('cancel')}</Button>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={loading}
            disabled={(isInbond && hasError) || isOnlyView}
          >
            {isEdit ? t<string>('update') : t<string>('register')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Container>
  );
}
