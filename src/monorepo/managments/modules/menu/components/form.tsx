import {
  Grid,
  Card,
  Stack,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/lab/LoadingButton';
import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form/dist/types';
import { FieldValues } from 'react-hook-form';

import Scrollbar from '@gsuite/ui/Scrollbar';
import { ControlledTextField, ControlledAutocomplete } from '@gsuite/shared/ui';
import { useRestfulEnvironments } from '../../modules/api/getEnvironments';
import { useRestfulModules } from '../../modules/api/getModulesRestful';

  type Props = {
    handleSubmit: any;
    errors: FieldErrors;
    register: UseFormRegister<FieldValues>;
    isSubmitting?: boolean;
    control: Control<FieldValues>;
    data?: any;
    watch: (formValues: FieldValues) => void;
  };

  type Environment = {
    id: string;
  };

  type AutoComplete = {
    id?: string;
    name?: string;
    environment?: Environment;
  };

export default function Form({
  handleSubmit,
  errors,
  register,
  isSubmitting = false,
  control,
  data = null,
  watch,
}: Props) {
  const { t } = useTranslation();
  const { data: environmentsData } = useRestfulEnvironments();
  const { data: modulesData } = useRestfulModules();
  const [nameVisible, setNameFieldVisible] = useState(false);
  const [modulesFieldDisabled, setDisabled] = useState(true);
  const [environmentFieldDisabled, setEnvironmentDisabled] = useState(false);
  const [modulesOptions, setModulesOptions] = useState(modulesData?.modulesRestful || []);

  const filterModules = (environment: Environment) => {
    if (modulesData) {
      setModulesOptions(
        modulesData.modulesRestful
          .filter((row: AutoComplete) => row.environment && row.environment.id === environment.id),
      );
    }
  };

  watch((formValues: FieldValues) => {
    const { modules, environment } = formValues;
    if (modules) {
      setNameFieldVisible(modules.length > 1);
      setEnvironmentDisabled(!!modules.length);
    }
    if (environment && modulesData) {
      setDisabled(false);
      filterModules(environment);
    }
  });

  useEffect(() => {
    if (data) {
      const { modules, environment } = data;
      setNameFieldVisible(modules.length > 1);
      setEnvironmentDisabled(!!modules.length);

      if (environment && modulesData) {
        setDisabled(false);
        filterModules(environment);
      }
    }
  }, [data, modulesData]);

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
                  <Typography variant="h4" gutterBottom>{t<string>(`managements.menu.${data ? 'edit' : 'create'}`)}</Typography>
                </Stack>
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
                  disabled={environmentFieldDisabled}
                />
                <ControlledAutocomplete
                  defaultValue={data?.modules}
                  multiple
                  errors={errors}
                  name="modules"
                  label={t<string>('managements.modules.list')}
                  control={control}
                  options={modulesOptions.filter((m) => !m.toolbox)}
                  key="modules-autocomplete"
                  optionLabel={(actionValue: AutoComplete) => {
                    if (actionValue) {
                      return actionValue?.name;
                    }
                    return null;
                  }}
                  isOptionEqualToValue={
                    (option: AutoComplete, value: AutoComplete) => option.id === value.id
                  }
                  valueSerializer={(actionValue: AutoComplete[]) => actionValue}
                  disabled={modulesFieldDisabled}
                />
                {
                  nameVisible && (
                    <ControlledTextField
                      errors={errors}
                      fieldName="name"
                      inputType="text"
                      label={t<string>('managements.menu.name')}
                      register={register}
                      key="name-field"
                    />
                  )
                }
                {
                  data && (
                    <ControlledTextField
                      errors={errors}
                      fieldName="order"
                      inputType="number"
                      label={t<string>('managements.menu.order')}
                      register={register}
                      key="order-field"
                    />
                  )
                }
                <ControlledTextField
                  errors={errors}
                  fieldName="icon"
                  inputType="text"
                  label={t<string>('managements.menu.icon')}
                  register={register}
                  key="icon-field"
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
