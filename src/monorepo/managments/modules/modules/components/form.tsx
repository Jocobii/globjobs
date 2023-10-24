/* eslint-disable react/jsx-props-no-spreading */
import {
  Grid,
  Card,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Button from '@mui/lab/LoadingButton';
import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form/dist/types';
import { FieldValues } from 'react-hook-form';

import Scrollbar from '@gsuite/ui/Scrollbar';
import { ControlledTextField, ControlledAutocomplete, ControlledCheckbox } from '@gsuite/shared/ui';
import { capitalizeFirstLetter } from '@gsuite/shared/utils/format';
import { useRestfulEnvironments } from '../api/getEnvironments';

type Props = {
  handleSubmit: any;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
  isSubmitting?: boolean;
  control: Control<FieldValues>;
  data?: any;
};

type AutoComplete = {
  id: string;
  name: string;
};

export default function Form({
  handleSubmit,
  errors,
  register,
  isSubmitting = false,
  control,
  data = null,
}: Props) {
  const { t } = useTranslation();
  const { data: environmentsData } = useRestfulEnvironments();

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Scrollbar>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Typography variant="h4" gutterBottom>{t<string>(`managements.modules.${data ? 'edit' : 'create'}`)}</Typography>
                </Stack>
                <ControlledTextField
                  errors={errors}
                  fieldName="name"
                  inputType="text"
                  label={t<string>('managements.modules.name')}
                  register={register}
                  key="name-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="description"
                  inputType="text"
                  label={t<string>('managements.modules.description')}
                  register={register}
                  key="description-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="route"
                  inputType="text"
                  label={t<string>('managements.modules.route')}
                  register={register}
                  key="route-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="component"
                  inputType="text"
                  label={t<string>('managements.modules.component')}
                  register={register}
                  key="component-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="icon"
                  inputType="text"
                  label={t<string>('managements.modules.icon')}
                  register={register}
                  key="icon-field"
                />
                <ControlledCheckbox
                  name="exact"
                  label={t<string>('managements.modules.exact')}
                  control={control}
                />
                <ControlledCheckbox
                  name="toolbox"
                  label={t<string>('managements.modules.toolbox')}
                  control={control}
                />
                <ControlledAutocomplete
                  defaultValue={data?.environment}
                  errors={errors}
                  name="environment"
                  label={t<string>('managements.environments.name')}
                  control={control}
                  options={environmentsData?.environmentsRestful || []}
                  key="environments-autocomplete"
                  optionLabel={(environmentValue: AutoComplete) => {
                    if (environmentValue) {
                      return environmentValue?.name;
                    }
                    return null;
                  }}
                  valueSerializer={(environmentValue: AutoComplete) => {
                    if (environmentValue) {
                      const { name, id } = environmentValue;
                      return {
                        name,
                        id,
                      };
                    }
                    return null;
                  }}
                />
                <ControlledAutocomplete
                  defaultValue={data?.actions}
                  multiple
                  errors={errors}
                  name="actions"
                  label={t<string>('managements.modules.actions')}
                  control={control}
                  options={
                    ['create', 'read', 'update', 'report', 'delete']
                      .map((action) => ({
                        id: action,
                        name: capitalizeFirstLetter(action),
                      }))
                    }
                  isOptionEqualToValue={
                    (option: AutoComplete, value: AutoComplete) => option.id === value.id
                  }
                  freeSolo
                  key="actions-autocomplete"
                  optionLabel={(actionValue: AutoComplete) => {
                    if (actionValue) {
                      return (
                        typeof actionValue === 'string'
                          ? actionValue
                          : actionValue?.name
                      );
                    }
                    return null;
                  }}
                  valueSerializer={(actionValue: AutoComplete[]) => actionValue.map((value) => {
                    if (typeof value === 'string') {
                      return {
                        id: value, name: value,
                      };
                    }
                    return value;
                  })}
                />
                <Button type="submit" variant="contained" loading={isSubmitting}>Submit</Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Scrollbar>
    </form>
  );
}
