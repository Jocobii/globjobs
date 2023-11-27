import { Controller, Control } from 'react-hook-form';
import { Switch, Typography } from '@mui/material';

import { FieldColor } from '../../typings/controlled';

type Props = {
  name: string;
  title: string;
  control: Control;
  color: FieldColor;
  disabled: boolean;
};

export default function SwitchField({
  name, title, color, control, disabled = false,
}: Readonly<Props>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Typography title={title}>
          <Switch
            value={value}
            onChange={onChange}
            color={color}
            defaultChecked={value}
            disabled={disabled}
          />
          {title}
        </Typography>
      )}
    />
  );
}
