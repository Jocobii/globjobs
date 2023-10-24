import { memo } from 'react';
import { isEqual } from 'lodash';
import { Controller, Control } from 'react-hook-form';
import { TextField, Autocomplete } from '@mui/material';

type Props = {
  name: string;
  label: string;
  options?: string[];
  control: Control;
  valueSerializer?: any;
  customOnChange?: (value: any) => void;
  optionLabel?: any;
};

function SelectField({
  name,
  label,
  options = [],
  control,
  customOnChange = undefined,
  optionLabel = undefined,
  valueSerializer = undefined,
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
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
        <Autocomplete
          freeSolo
          disableClearable
          options={options}
          getOptionLabel={optionLabel}
          onChange={(_, word) => {
            let onChangeValue = word;
            if (valueSerializer && typeof value === 'function') {
              onChangeValue = valueSerializer(word);
            }
            onChange(onChangeValue);

            return word;
          }}
          value={value ?? ''}
          renderInput={({ InputLabelProps, InputProps, inputProps }) => (
            <TextField
              fullWidth
              inputRef={ref}
              label={label}
              placeholder={label}
              helperText={error?.message}
              error={Boolean(error)}
              name={inputName}
              onBlur={onBlur}
              onChange={(e) => {
                if (customOnChange && typeof customOnChange === 'function') {
                  return customOnChange(e.target?.value);
                }
                return onChange(e);
              }}
              value={value ?? ''}
              InputLabelProps={InputLabelProps}
              InputProps={InputProps}
              inputProps={inputProps}
            />
          )}
        />
      )}
    />
  );
}

export default memo(
  SelectField,
  (prevProps, nextProps) => isEqual(prevProps.options, nextProps.options),
);
