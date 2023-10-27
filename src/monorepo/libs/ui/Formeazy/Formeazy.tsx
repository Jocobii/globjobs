import { useEffect } from 'react';
import {
  Stack,
  Typography,
  DialogActions,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoadingButton from '@mui/lab/LoadingButton';
import { Dropzone } from '@gsuite/shared/ui';
import { useFormWithSchema } from '@gsuite/shared/lib/react-hook-form';
import { capitalizeFirstLetter } from '@gsuite/shared/utils/format';
import {
  Control,
  DeepPartial,
  FieldValues,
  SubmitHandler,
} from 'react-hook-form';

import {
  TextField,
  SwitchField,
  SelectField,
  AutocompleteField,
} from './Fields';
import { FormInput } from './typings';

interface Props<TFormValues extends FieldValues> {
  formId?: string;
  title: string;
  schema: any;
  extraContent?: React.ReactNode;
  onSubmit: SubmitHandler<TFormValues>;
  initialValues?: DeepPartial<TFormValues> | null,
  inputProps?: {
    [field in keyof Partial<any>]: FormInput;
  };
  withHeader?: boolean;
  onClose?: () => void;
  submitLabel?: string;
}

type ActiveComponent = {
  control: Control;
  hasActiveField: boolean;
};

function RenderActiveComponent({ control, hasActiveField }: ActiveComponent) {
  if (!hasActiveField) return null;

  return <SwitchField control={control} name="active" title="Disabled" color="error" />;
}

function Formeazy<TFormValues extends Record<string, unknown>>({
  formId = 'formeazy-form-id',
  title,
  schema,
  onSubmit,
  extraContent = null,
  initialValues = null,
  inputProps = undefined,
  withHeader = false,
  onClose = () => null,
  submitLabel = 'Submit',
}: Props<TFormValues>) {
  const { t } = useTranslation();
  const {
    control,
    formState: {
      isSubmitting,
    },
    handleSubmit,
    reset,
  } = useFormWithSchema(schema, {
    defaultValues: initialValues,
  });
  const hasActiveField = Object.prototype.hasOwnProperty.call(schema.fields, 'active');

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form id={formId} autoComplete="off" onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
      <Stack spacing={3} sx={{ py: 2, px: 3 }}>
        {withHeader ? (
          <DialogActions style={{ padding: 0 }}>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {extraContent}
            <RenderActiveComponent control={control} hasActiveField={hasActiveField} />
            <Button variant="outlined" color="inherit" onClick={onClose}>{t('cancel')}</Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              form={formId}
            >
              {submitLabel}
            </LoadingButton>
          </DialogActions>
        ) : (
          <Stack
            direction={extraContent ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h4" gutterBottom>{title}</Typography>
            {extraContent}
            <RenderActiveComponent control={control} hasActiveField={hasActiveField} />
          </Stack>
        )}
        {Object.keys(schema.fields).filter((n) => n !== 'active').map((name) => {
          const field = schema.fields[name];
          const isObject = field.type === 'object';

          const fieldsKeys = isObject ? Object.keys(field.fields) : [name];

          return fieldsKeys.map((fieldKey) => {
            let nameField = fieldKey;
            let subField = field;

            if (isObject) {
              nameField = `${name}.${fieldKey}`;
              subField = field.fields[fieldKey];
            }

            const otherInputProps = {
              label: capitalizeFirstLetter(nameField),
              ...inputProps && inputProps[nameField],
            };

            const {
              label,
              multiline,
              minRows,
              type,
              options,
              keywords,
              customOnChange,
              filesSetter,
              files,
              optionLabel,
              valueSerializer,
              helperText,
            } = otherInputProps;

            const inputLabel = `${label}${subField.exclusiveTests.required ? '*' : ''}`;

            if (subField.type === 'mixed' && type === 'select' && options) {
              return (
                <SelectField
                  key={nameField}
                  name={nameField}
                  label={inputLabel}
                  control={control}
                  options={options}
                  customOnChange={customOnChange}
                />
              );
            }

            if (type === 'autocomplete' && keywords) {
              return (
                <AutocompleteField
                  key={nameField}
                  name={nameField}
                  label={inputLabel}
                  control={control}
                  options={keywords}
                  customOnChange={customOnChange}
                  optionLabel={optionLabel}
                  valueSerializer={valueSerializer}
                />
              );
            }

            if (type === 'file') {
              return (
                <Dropzone
                  key={nameField}
                  label={nameField}
                  files={files}
                  filesSetter={filesSetter}
                />
              );
            }

            return (
              <TextField
                key={nameField}
                name={nameField}
                label={inputLabel}
                type={subField.type}
                control={control}
                multiline={multiline}
                minRows={minRows}
                customOnChange={customOnChange}
                helperText={helperText}
              />
            );
          });
        })}
        {!withHeader ? (
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }} spacing={2}>
            <Button variant="outlined" sx={{ borderRadius: 5 }} onClick={onClose}>{t('cancel')}</Button>
            <LoadingButton type="submit" variant="contained" sx={{ borderRadius: 5 }} loading={isSubmitting}>{submitLabel}</LoadingButton>
          </Stack>
        ) : null}
      </Stack>
    </form>
  );
}

export default Formeazy;
