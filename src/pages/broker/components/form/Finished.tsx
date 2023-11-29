// End operation
import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogContent, DialogActions, Button, Stack, Grid, Container,
} from '@mui/material';
import { FieldValues, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';

import { ControlledTextField, Dropzone, ControlledAutocomplete } from '@/components';
import { NotificationsContext } from '@/contexts/NotificationsContext';
import { FileDropZone } from '@/typings/files';

import { useFindReceipt } from '../../hooks/findReceip';
import { uploadFiles, createArrayFiles } from '@/services/uploadFiles';
import { useAddHistory, useOmitReceiveWms, useUpdateHistory } from '../../hooks/operation-detail';
import { useStepInfo } from '../../hooks/stepInfo';
import { difference } from '@/utils/func';

type AutoComplete = {
  _id: string;
  number: string;
};

type Props = {
  submitFrom: () => void;
  onClose: () => void;
  operationId: string;
  isEdit: boolean;
  defaultValue?: AutoComplete;
  isOnlyView?: boolean;
};

const schema = Yup.object({
  receiptNumber: Yup.string().required(),
  notes: Yup.string().nullable().optional(),
});

interface FinishOp extends Record<string, any> {
  receiptNumber: string;
  notes: string;
}

export default function Fop({
  submitFrom, onClose, operationId, isEdit, defaultValue = { _id: '0', number: 'R-00000000' },
  isOnlyView = true,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { setSnackBar } = useContext(NotificationsContext);
  const [addHistory, { loading }] = useAddHistory(operationId);
  const [oldValue, setOldValue] = useState<FinishOp>();
  const [skipReceiveWms] = useOmitReceiveWms(operationId);
  const [updateHistory] = useUpdateHistory(operationId);
  const [getStepInfo] = useStepInfo();
  const [additionalDocs, setAdditionalDocs] = useState<FileDropZone[]>([]);
  const { debouncedReceipt, data } = useFindReceipt();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema) as any,
  });
  const skipStep = () => {
    skipReceiveWms({
      variables: {
        id: operationId,
        isEdit,
      },
      onError: (e) => {
        setSnackBar('error', e.message);
      },
      onCompleted: () => {
        setSnackBar('success', t('broker.skipStepUsaSuccess'));
      },
    });
    onClose();
  };

  useEffect(() => {
    const getStepData = async () => {
      const { data: stepInfo } = await getStepInfo({
        variables: {
          id: operationId,
          step: 8,
        },
      });
      const receiptNumber = stepInfo?.getStepInfo?.receiptNumber || '';
      const notes = stepInfo?.getStepInfo?.notes || '';
      reset({
        receiptNumber,
        notes,
      });

      setOldValue({
        receiptNumber,
        notes,
      });
    };

    if (isEdit) {
      getStepData();
    }
  }, [getStepInfo, isEdit, operationId, reset]);

  const submitHandler = async ({ notes, receiptNumber }: FieldValues) => {
    let additionalFiles = null;
    if (additionalDocs.length) {
      const files = await uploadFiles(additionalDocs);
      if (Array.isArray(files)) {
        additionalFiles = createArrayFiles(files);
      }
    }

    const stepData = {
      id: operationId,
      notes,
      receiptNumber: receiptNumber || '',
      additionalFiles,
      step: 8,
    };

    if (isEdit) {
      const newValue = {
        notes,
        receiptNumber,
      };

      const changes = difference<FinishOp>(oldValue!, newValue);

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
      return;
    }

    await addHistory({
      variables: stepData,
      onError: () => {
        setSnackBar('error', t('broker.endOperationError'));
      },
      onCompleted: () => {
        setSnackBar('success', t('broker.endOperationSuccess'));
        submitFrom();
      },
    });
    submitFrom();
  };

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
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledAutocomplete
                  defaultValue={defaultValue}
                  errors={errors}
                  name="receiptNumber"
                  label={`${t('broker.receiptLabel')} *`}
                  control={control}
                  options={data?.receiptFind ?? []}
                  key="receiptNumber-autocomplete"
                  optionLabel={({ number }: AutoComplete) => number}
                  valueSerializer={({ number }: AutoComplete) => number}
                  customOnChange={(value) => debouncedReceipt(value)}
                  disabled={isOnlyView}
                />
                <ControlledTextField
                  label={t('broker.notesLabel')}
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="notes"
                  key="notes-field"
                  disabled={isOnlyView}
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Dropzone label={t('broker.additionalFiles')} files={additionalDocs} filesSetter={setAdditionalDocs} disabled={isOnlyView} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={skipStep}
            disabled={isOnlyView}
          >
            {t('broker.skipStep')}
          </Button>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <LoadingButton variant="contained" type="submit" loading={loading} disabled={isOnlyView}>
            {isEdit ? t('update') : t('register')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Container>
  );
}
