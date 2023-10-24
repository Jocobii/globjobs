import { memo } from 'react';
import { Controller, Control } from 'react-hook-form';
import MTextField from '@mui/material/TextField';
import { getThemeMode } from '@gsuite/shared/utils';
import { FieldType } from '../typings';

type Props = {
  control: Control;
  name: string;
  label: string;
  type: FieldType;
  multiline?: boolean;
  minRows?: number;
  customOnChange?: (value: any) => void,
  helperText?: string;
};
function TextField({
  name, label, type, control, multiline = false, minRows = undefined, customOnChange = undefined,
  helperText = '',
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({
        field: {
          onChange,
          onBlur,
          value,
          name: inputName,
          ref,
        },
        fieldState: {
          error,
        },
      }) => (
        <MTextField
          fullWidth
          label={label}
          placeholder={label}
          helperText={error?.message || helperText}
          error={Boolean(error)}
          name={inputName}
          type={type}
          onChange={(e) => {
            onChange(e);
            if (customOnChange && typeof customOnChange === 'function') {
              customOnChange(e.target?.value);
            }
          }}
          sx={{ input: { color: getThemeMode() === 'dark' ? 'white' : 'black' } }}
          onBlur={onBlur}
          value={value}
          ref={ref}
          multiline={multiline}
          minRows={minRows}
        />
      )}
    />
  );
}

export default memo(TextField, ({ name: prevName }, { name }) => prevName === name);
