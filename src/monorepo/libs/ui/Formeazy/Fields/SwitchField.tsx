import { memo } from 'react';
import { Controller, Control } from 'react-hook-form';
import { Switch, Tooltip } from '@mui/material';

import { FieldColor } from '../typings';

type Props = {
  name: string;
  title: string;
  control: Control;
  color: FieldColor;
};

function SwitchField({
  name, title, color, control,
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Tooltip title={title} arrow>
          <Switch
            value={value}
            onChange={onChange}
            color={color}
            defaultChecked
          />
        </Tooltip>
      )}
    />
  );
}

export default memo(SwitchField, ({ name: prevName }, { name }) => prevName === name);
