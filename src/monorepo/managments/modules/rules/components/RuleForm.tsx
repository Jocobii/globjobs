import {
  Grid,
  Card,
  Stack,
  Switch,
  MenuItem,
  Typography,
} from '@mui/material';
import Button from '@mui/lab/LoadingButton';
import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';

import Scrollbar from '@gsuite/ui/Scrollbar';
import { ControlledTextField, ControlledSelect, ControlledAutocomplete } from '@gsuite/shared/ui';

import { Rule } from '../types';

type Props = {
  handleSubmit: any;
  errors: FieldErrors;
  register: UseFormRegister<Rule>;
  control: Control<Rule>;
  isSubmitting?: boolean;
};

export default function RuleForm({
  handleSubmit,
  errors,
  register,
  control,
  isSubmitting = false,
}: Props) {
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
                  <Typography variant="h4" gutterBottom>Create Rule</Typography>
                  <Switch defaultChecked color="error" />
                </Stack>
                <ControlledTextField
                  fieldName="section"
                  label="Section"
                  errors={errors}
                  register={register}
                  infoText="Ejm: 501,551, etc."
                />
                <ControlledTextField
                  inputType="number"
                  fieldName="field"
                  label="Field number"
                  errors={errors}
                  register={register}
                  infoText="Ejm: numeric (0,1,...,n)"
                />
                <ControlledSelect
                  name="type"
                  label="Type"
                  errors={errors}
                  control={control}
                >
                  <MenuItem value="error">Error</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="information">Information</MenuItem>
                </ControlledSelect>
                <ControlledAutocomplete
                  freeSolo
                  name="validator"
                  label="Rule validator"
                  options={['null', '!null', 'number', '!number', 'string', '!string', '<[value]', '>[value]', '<=[value]', '>=[value]', '!==[value]', '===[value]']}
                  optionLabel={(name: string) => name}
                  valueSerializer={(r: string) => r}
                  key="validator-autocomplete"
                  control={control}
                  errors={errors}
                  infoText="You can type regular expressions."
                />
                <ControlledTextField
                  multiline
                  minRows={4}
                  fieldName="message"
                  label="Message"
                  errors={errors}
                  register={register}
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
