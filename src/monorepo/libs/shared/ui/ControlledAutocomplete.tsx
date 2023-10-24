/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete, TextField, useTheme, SxProps,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
  control: any;
  options: any;
  name: string;
  optionLabel: any;
  label: string;
  placeholder?: string;
  valueSerializer: any;
  errors: any;
  defaultValue?: any;
  customOnChange?: (value?: string) => void;
  freeSolo?: boolean;
  infoText?: string;
  disabled?: boolean;
  multiple?: boolean;
  onSelect?: (value: string) => void;
  sx?: SxProps;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
  renderOptions?: ((props: object, option: any) => JSX.Element) | null;
};

export default function ControlledAutocomplete({
  name,
  control,
  options,
  optionLabel,
  label,
  placeholder = '',
  valueSerializer,
  errors,
  customOnChange = () => null,
  defaultValue = null,
  freeSolo = false,
  onSelect = () => null,
  infoText = '',
  sx = {},
  disabled = false,
  multiple = false,
  isOptionEqualToValue = () => false,
  renderOptions = null,
}: Props) {
  const theme = useTheme();
  const color = theme.palette.mode !== 'light' ? '#000' : '#fff';
  let errorHelperText = errors[name]?.message;

  // If name is part of array of fields
  if (name.includes('[')) {
    const arrayFieldName = name.split('[')[0];
    const regexMatch = name.match(/\[(.*?)\]/);
    if (regexMatch) {
      const fieldIndex = Number(regexMatch[1]);
      const arrayOfErrors = errors[arrayFieldName];
      const childFieldName = name.split('.')[1];
      if (
        arrayOfErrors?.length > 0
        && arrayOfErrors[fieldIndex] !== undefined
        && arrayOfErrors[fieldIndex][childFieldName]?.message
      ) {
        errorHelperText = arrayOfErrors[fieldIndex][childFieldName]?.message || null;
      }
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <Autocomplete
          {
            ...(defaultValue && { defaultValue })
          }
          sx={sx}
          id={`controlled-autocomplete-${name}`}
          options={options}
          autoHighlight
          onSelect={(e: React.ChangeEvent<HTMLInputElement>) => onSelect(e.target.value)}
          disabled={disabled}
          multiple={multiple}
          getOptionLabel={optionLabel}
          {
            ...(multiple && { isOptionEqualToValue })
          }
          ChipProps={{ deleteIcon: <ClearIcon /> }}
          {
            ...(renderOptions && { renderOption: renderOptions })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              style={{ color }}
              onChange={(e) => {
                if (customOnChange) {
                  customOnChange(e.target.value);
                }
              }}
              helperText={errorHelperText || infoText}
              error={!!errorHelperText}
              label={label}
              placeholder={placeholder}
            />
          )}
          onChange={(_, data) => {
            const serializedData = valueSerializer(data);
            onChange(serializedData);
            return data;
          }}
          freeSolo={freeSolo}
        />
      )}
    />
  );
}
