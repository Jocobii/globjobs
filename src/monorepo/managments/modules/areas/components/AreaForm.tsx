import {
  Grid,
  Card,
  Stack,
  Typography,
  Switch,
} from '@mui/material';

import Button from '@mui/lab/LoadingButton';
import Scrollbar from '@gsuite/ui/Scrollbar';
import { ControlledTextField, ControlledAutocomplete } from '@gsuite/shared/ui';
import { AreaCreateFormProps } from '../types';
import { useRestfulDepartments } from '../../departments/api/restful';

type AutoComplete = {
  id: string;
  name: string;
};

export default function AreaForm({
  handleSubmit,
  errors,
  register,
  control,
  isSubmitting = false,
  isEditing,
  data,
}: AreaCreateFormProps) {
  const { data: departmentsData } = useRestfulDepartments();
  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Scrollbar>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3, borderRadius: 0 }}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Typography variant="h4" gutterBottom>{isEditing ? 'Edit area' : 'Create area'}</Typography>
                  <Switch defaultChecked color="error" />
                </Stack>
                <ControlledTextField
                  fieldName="name"
                  label="Name"
                  errors={errors}
                  register={register}
                />
                <ControlledTextField
                  fieldName="abbreviation"
                  label="Abbreviation"
                  errors={errors}
                  register={register}
                />
                <ControlledAutocomplete
                  errors={errors}
                  defaultValue={data?.department || null}
                  name="department"
                  label="Department"
                  control={control}
                  options={departmentsData?.departmentsRestful || []}
                  key="departments-autocomplete"
                  optionLabel={(departmentValue: AutoComplete) => {
                    if (departmentValue) {
                      return departmentValue?.name;
                    }
                    return null;
                  }}
                  valueSerializer={(departmentValue: AutoComplete) => {
                    if (departmentValue) {
                      const { name, id } = departmentValue;
                      return {
                        name,
                        id,
                      };
                    }
                    return null;
                  }}
                />
                <Button type="submit" variant="contained" loading={isSubmitting} sx={{ m: 1.5 }}>Submit</Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Scrollbar>
    </form>
  );
}
