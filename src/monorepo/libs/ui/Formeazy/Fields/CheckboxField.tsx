import { memo } from 'react';
import { Controller, Control } from 'react-hook-form';
import { FormControlLabel, Checkbox } from '@mui/material';

type Props = {
  control: Control;
  name: string;
  label: string;
};

function TextField({
  name, label, control,
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={false}
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
        <FormControlLabel
          control={(
            <Checkbox
              name={inputName}
              onChange={onChange}
              onBlur={onBlur}
              checked={value}
              ref={ref}
              color={error ? 'error' : 'primary'}
            />
          )}
          label={label}
        />
      )}
    />
  );
}

export default memo(TextField, ({ name: prevName }, { name }) => prevName === name);
