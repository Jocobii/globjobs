import { useCallback, useEffect } from 'react';
import {
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { NodeModels } from '@gsuite/typings/files';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { PaymentMethods } from '@gsuite/typings/common';
import { getUserSession } from '@gsuite/shared/contexts/AuthContext';
import { ControlledTextField } from '@gsuite/shared/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FieldValues, useForm } from 'react-hook-form';
import { History } from '@gsuite/shared/contexts';
import PanelBody from '@gsuite/shared/components/panel/PanelBody';
import { useRejectProform, useDeleteProform } from '../../services/cruces/rejectProforma';

type PredeterminedPayments = `${PaymentMethods}`;

type Props = {
  onClose: (success:boolean) => void;
  crossingId: string;
  history: History[];
  node: NodeModels;
  submitUnauthorized: boolean;
  deleteProforma: boolean;
  amount: string;
  predeterminedPayment: PredeterminedPayments;
  setComments?: (comments: string) => void;
};
const GENERIC_MESSAGE = 'generic.requiredField';

export default function UnuthorizeProforma({
  onClose,
  crossingId,
  node,
  history,
  submitUnauthorized,
  deleteProforma,
  amount,
  predeterminedPayment,
  setComments = () => {},
}: Props) {
  const { t } = useTranslation();
  const { errorMessage, successMessage } = useSnackNotification();
  const [handleProformRejection] = useRejectProform();
  const [handleProformDeletion] = useDeleteProform();

  const schema = yup.object().shape({
    reason: yup.string().required(t<string>(GENERIC_MESSAGE))
      .min(5, t<string>('cruces.proform.unauthorizeReasonMinLength'))
      .max(150, t<string>('cruces.proform.unauthorizeReasonMinLength')),
  });

  const {
    register,
    getValues,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleSubmit = useCallback(async () => {
    const getUser = await getUserSession();
    if (isValid && submitUnauthorized) {
      await handleProformRejection({
        variables: {
          crossingId,
          nodeId: node.id,
          userId: getUser?.user?.id,
          ...getValues(),
        },
      }).then((resp) => {
        const { name } = resp.data.rejectProforma.data;
        onClose(true);
        errorMessage(t<string>('cruces.proform.confirmUnauthorizedPayment', { file: name }));
      })
        .catch((error: Error) => {
          onClose(false);
          errorMessage(error.message);
        });
    }
    if (deleteProforma) {
      await handleProformDeletion({
        variables: {
          crossingId,
          nodeId: node.id,
          userId: getUser?.user?.id,
        },
      }).then((resp) => {
        const { name } = resp.data.deleteProforma.data;
        onClose(true);
        successMessage(t<string>('cruces.proform.confirmDeletedFile', { file: name }));
      })
        .catch((error: Error) => {
          onClose(false);
          errorMessage(error.message);
        });
    }
  }, [
    crossingId,
    t,
    errorMessage,
    successMessage,
    getValues,
    onClose,
    handleProformRejection,
    handleProformDeletion,
    isValid,
    node.id,
    submitUnauthorized,
    deleteProforma,
  ]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit, submitUnauthorized, deleteProforma]);

  return (
    <Stack alignItems="center" direction="column" spacing={3} px={5}>
      {!node.data?.unauthorized && (
      <>
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
              {t<string>('cruces.proform.unauthorizeWarning')}
            </Typography>
            <CloseIcon
              sx={{ fontSize: 30 }}
              style={{ backgroundColor: 'red', color: 'white', borderRadius: 25 }}
            />
            <Typography color="gray">{t<string>('cruces.proform.cashAmount')}</Typography>
            <Typography color="primary" sx={{ fontSize: 25, fontWeight: 800 }}>{`${amount}.00 MX`}</Typography>
            {node?.data?.unauthorized === false
            && (
              <>
                <Typography color="gray">{t<string>('cruces.proform.predeterminedPayment')}</Typography>
                <Typography color="primary" sx={{ fontSize: 20, fontWeight: 600 }}>{`${predeterminedPayment}`}</Typography>
              </>
            )}
          </Stack>
        </Stack>
        <ControlledTextField
          minRows={4}
          multiline
          customOnChange={(e) => setComments(e || '')}
          label="Reason"
          register={register}
          inputType="text"
          errors={errors}
          fieldName="reason"
          key="patente-field"
        />
      </>
      )}
      {node?.data?.unauthorized && (
      <Stack
        direction="column"
        alignItems="center"
        p={2}
        m={3}
        spacing={1}
        sx={{
          borderColor: 'transparent',
          backgroundColor: 'lightgray',
          border: 1.5,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{ fontSize: 20, fontWeight: 600, color: 'red' }}
        >
          <CloseIcon
            sx={{ fontSize: 20, lineHeight: '50%' }}
            style={{ backgroundColor: 'red', color: 'white', borderRadius: 25 }}
          />
          {'   '}
          {t<string>('cruces.proform.unauthorizedProforma')}
        </Typography>
        <PanelBody history={history} />
      </Stack>
      )}
    </Stack>

  );
}
