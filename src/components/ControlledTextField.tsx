import { TextField } from '@mui/material';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import { getThemeMode } from '../utils/format';

type Props = {
  register: UseFormRegister<any>;
  label: string;
  fieldName: string;
  errors: any;
  sx?: React.CSSProperties;
  inputType?: string;
  registerOptions?: RegisterOptions;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  disabled?: boolean;
  customOnChange?: (value?: string) => void;
  multiline?: boolean;
  defaultValue?: string;
  minRows?: number | string;
  infoText?: string;
};

const getError = (fieldName: string, errors: any): string => {
  const keys = fieldName.split('.');

  let errorMessage = errors;
  keys.forEach((key) => {
    if (!errorMessage) return false;
    errorMessage = errorMessage[key];

    return errorMessage && errorMessage.message && errorMessage.type;
  });

  if (!errorMessage) return '';

  return errorMessage.message;
};

export default function ControlledTextField({
  register,
  label,
  fieldName,
  errors,
  sx = {},
  inputType = 'text',
  registerOptions = {},
  customOnChange = () => null,
  endAdornment = null,
  startAdornment = null,
  disabled = false,
  multiline = false,
  defaultValue = '',
  minRows = '',
  infoText = '',
}: Props) {
  let registerFieldName = fieldName;
  let errorHelperText = getError(fieldName, errors);

  // If name is part of array of fields
  if (fieldName.includes('[')) {
    const arrayFieldName = fieldName.split('[')[0];
    const regexMatch = fieldName.match(/\[(.*?)\]/);
    if (regexMatch) {
      const fieldIndex = Number(regexMatch[1]);
      const arrayOfErrors = errors[arrayFieldName];
      const childFieldName = fieldName.split('.')[1];
      if (
        arrayOfErrors?.length > 0
        && arrayOfErrors[fieldIndex] !== undefined
        && arrayOfErrors[fieldIndex][childFieldName]?.message
      ) {
        errorHelperText = arrayOfErrors[fieldIndex][childFieldName]?.message || null;
      }
      registerFieldName = `${arrayFieldName}.${fieldIndex}.${childFieldName}`;
    }
  }
  const { onChange, onBlur, ref } = register(registerFieldName, registerOptions);

  return (
    <TextField
      ref={ref}
      sx={{
        ...sx,
        input: { color: getThemeMode() === 'dark' ? 'white' : 'black' },
      }}
      label={label}
      name={fieldName}
      disabled={disabled}
      onChange={(e) => {
        onChange(e);
        if (customOnChange) {
          customOnChange(e.target.value);
        }
      }}
      InputProps={{
        ...(endAdornment && {
          endAdornment,
        }),
        ...(startAdornment && {
          startAdornment,
        }),
      }}
      onBlur={onBlur}
      defaultValue={defaultValue}
      type={inputType}
      helperText={errorHelperText || infoText}
      error={!!errorHelperText}
      multiline={multiline}
      minRows={minRows}
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
