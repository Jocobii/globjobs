import {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  TextField,
  InputAdornment,
  Grid,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';
import { Dropzone } from '@gsuite/shared/ui';
import useInput from '@gsuite/shared/hooks/useInput';
import { FileDropZone } from '@gsuite/typings/files';
import { validateProforma } from '@gsuite/shared/services/cruces';

type Props = {
  setDisabled: (prop: boolean) => void;
  setValFile: (file: FileDropZone) => void;
  setAmount: (amount: number) => void;
  setFiles: Dispatch<SetStateAction<FileDropZone[]>>;
};

function ProformaModal({
  setDisabled,
  setValFile,
  setAmount,
  setFiles: setFilesState,
}: Props) {
  const {
    handleBlur,
    handleValueChange,
    isValid,
    value: inputValue,
    hasError,
  } = useInput<number>({ validateValue: (v) => !!v });
  const [fileAmount, setFileAmount] = useState(0);
  const [amountMatchError, setAmountMatchError] = useState(false);
  const [file, setFiles] = useState<FileDropZone[]>([]);
  const { setSnackBar } = useContext(NotificationsContext);
  const { t } = useTranslation();
  useEffect(() => {
    if (file.length) {
      validateProforma({ files: file as FileDropZone[] })
        .then(({ data }) => {
          if ('amount' in data) {
            if (data.amount === 0) {
              setSnackBar('warning', t('cruces.proform.validationFileWithoutPayment'));
            }
            setDisabled(data.needsValidation);
            setFileAmount(data.amount);
            setValFile(file[0]);
            setFilesState((prev) => [...prev, ...file]);
            if (inputValue && Number(inputValue) !== data.amount) {
              setAmountMatchError(true);
              setDisabled(true);
            }
          } else {
            setSnackBar('error', data.message);
          }
        })
        .catch((error) => {
          setSnackBar('error', error.message);
        });
    } else {
      setDisabled(false);
      setAmount(0);
    }
  }, [file]);

  useEffect(() => {
    setDisabled(!isValid);
  }, [inputValue, isValid]);

  const handleAmountChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(target.value);
    if (fileAmount) {
      const isAmountEqual = value === fileAmount;
      setDisabled(!isAmountEqual);
      setAmountMatchError(!isAmountEqual);
    }
    handleValueChange(value);
    setAmount(value);
  };

  let errorText = t('generic.requiredField');
  if (amountMatchError) {
    errorText = t('cruces.proform.amountDiscrepancy');
    setDisabled(amountMatchError);
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">{t('cruces.proform.addingValidationFile')}</Typography>
        <Typography fontSize={10}>{t('cruces.proform.missingFields')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Dropzone
          label="Archivo de validacion"
          files={file}
          filesSetter={setFiles}
          accept={{
            // 'octet-stream': ['application/octet-stream'],
          }}
          maxFiles={1}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          type="number"
          onBlur={handleBlur}
          label="Pago en Efectivo"
          id="outlined-start-adornment"
          InputProps={{
            endAdornment: <InputAdornment position="start">MXN</InputAdornment>,
          }}
          onChange={handleAmountChange}
          error={hasError || amountMatchError}
          helperText={(hasError || amountMatchError) && errorText}
        />
      </Grid>
    </Grid>
  );
}

export default ProformaModal;
