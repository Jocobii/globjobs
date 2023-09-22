import { TextField } from '@mui/material';
import {
  Controller, ControllerProps, FieldErrors, FieldValues,
} from 'react-hook-form';

type Props = {
  name: string;
  label: string;
  control: ControllerProps<any>['control'];
  defaultValue?: string;
  children: React.ReactNode;
  errors: FieldErrors<FieldValues>;
  disabled?: boolean;
};

export default function ControlledSelect({
  name, children, control, label, defaultValue = '', errors, disabled = false,
}: Props) {
  const errorHelperText = errors[name]?.message as string;
  return (
    <Controller
      render={({ field: { onChange, onBlur, value } }) => (
        <TextField
          select
          InputLabelProps={{
            shrink: true,
          }}
          disabled={disabled}
          label={label}
          error={!!errorHelperText}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          fullWidth
          helperText={errorHelperText}
        >
          {children}
        </TextField>
      )}
      name={name}
      control={control}
      defaultValue={defaultValue}
    />
  );
}
