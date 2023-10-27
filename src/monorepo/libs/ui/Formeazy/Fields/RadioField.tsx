import { memo } from 'react';
import { isEqual } from 'lodash';
import { Controller, Control } from 'react-hook-form';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';

import { InputOption } from '../typings';

type Props = {
  name: string;
  options?: InputOption[];
  control: Control;
};

function SelectField({
  name, options = [], control,
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
        <RadioGroup
          name={inputName}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          ref={ref}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio color={error ? 'error' : 'primary'} />}
              label={option.title}
            />
          ))}
        </RadioGroup>
      )}
    />
  );
}

export default memo(
  SelectField,
  (prevProps, nextProps) => isEqual(prevProps.options, nextProps.options),
);
