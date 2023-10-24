import { memo } from 'react';
import { isEqual } from 'lodash';
import { Controller, Control } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';

import { InputOption } from '../typings';

type Props = {
  name: string;
  label: string;
  options?: InputOption[];
  control: Control;
  customOnChange?: (value: any) => void,
};

function SelectField({
  name, label, options = [], control, customOnChange = undefined,
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
        <TextField
          fullWidth
          select
          defaultValue=""
          label={label}
          placeholder={label}
          helperText={error?.message}
          error={Boolean(error)}
          name={inputName}
          onChange={(e) => {
            onChange(e);
            if (customOnChange && typeof customOnChange === 'function') {
              customOnChange(e.target?.value);
            }
          }}
          onBlur={onBlur}
          value={value ?? ''}
          inputRef={ref}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.title}</MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}

export default memo(
  SelectField,
  (prevProps, nextProps) => isEqual(prevProps.options, nextProps.options),
);
