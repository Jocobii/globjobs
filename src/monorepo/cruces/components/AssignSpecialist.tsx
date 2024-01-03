import {
  Button, Grid, Stack,
} from '@mui/material';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DialogComponent, ControlledAutocomplete } from '@gsuite/shared/ui';
import { useTranslation } from 'react-i18next';
import { Option, renderOptions } from './OptionsRender';
import { useCoachTeam } from '../services/get-coach-teams';

type Props = {
  open: boolean;
  handleClose: () => void;
  handleAssignUser: (data: FieldValues) => void;
  coachId: string;
};

export default function AssignSpecialist({
  open,
  handleClose,
  handleAssignUser,
  coachId,
}: Props) {
  const { t } = useTranslation();
  const { data } = useCoachTeam(coachId);
  const schema = yup.object().shape({
    userId: yup.string().required('El usuario es requerido'),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  return (
    <DialogComponent
      open={open}
      okButtonVisibility={false}
      cancelButtonVisibility={false}
      maxWidth="md"
      title={t<string>('cruces.assign_specialist')}
    >
      <Grid
        container
        spacing={5}
        sx={{
          padding: 3,
          width: {
            lg: '500px',
            md: '500px',
          },
        }}
      >
        <Grid item lg={12} md={12} sm={12} xs={12} gap={3}>
          <form>
            <ControlledAutocomplete
              errors={errors}
              name="userId"
              label={t<string>('cruces.name')}
              control={control}
              options={data?.getCoachTeams ?? []}
              key="userId-autocomplete"
              optionLabel={({ name, lastName }: Option) => `${name} ${lastName}`}
              renderOptions={renderOptions}
              freeSolo
              isOptionEqualToValue={
                (option: Option, value: Option) => option.id === value.id
              }
              valueSerializer={(option: Option) => option.id}
            />
          </form>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={3}
          >
            <Button
              variant="contained"
              onClick={handleClose}
              color="error"
            >
              {t<string>('cruces.cancel')}
            </Button>
            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmit(handleAssignUser)}
            >
              {t<string>('cruces.table.assign')}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </DialogComponent>
  );
}
