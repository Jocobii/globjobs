import { DialogComponent, ControlledAutocomplete } from '@gsuite/shared/ui';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetCoaches } from '../../users/api/getCoaches';
import { RestfulTeamsResponse } from '../api/getFullTeams';
import { useAddCoachToTeam } from '../api/addCoachToTeam';

interface Props {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  teamId: string;
  teams: RestfulTeamsResponse | undefined;
}

type AutoComplete = {
  _id: string;
  name: string;
  lastName: string;
};
export default function DeleteFromTeam({
  isModalOpen, setModalOpen, teamId, teams,
}: Props) {
  const { t } = useTranslation();
  const { data } = useGetCoaches();
  const { mutateAsync } = useAddCoachToTeam({});
  const handleClose = () => setModalOpen(false);

  const schema = yup.object({
    teamId: yup.string().nullable(),
    coachId: yup.string().required(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema) as any,
  });

  const handleSave = async ({ coachId }: FieldValues) => {
    await mutateAsync({ teamId, coachId }).catch((err) => err);
    handleClose();
  };

  return (
    <DialogComponent
      title={t('managements.teams.addCoach')}
      aria-labelledby="customized-dialog-title"
      open={isModalOpen}
      cancelButtonVisibility={false}
      okButtonVisibility={false}
    >
      <form autoComplete="off" onSubmit={handleSubmit(handleSave)}>
        <DialogContent dividers>
          <Stack spacing={2}>
            <ControlledAutocomplete
              errors={errors}
              name="coachId"
              label="Coaches"
              control={control}
              options={data?.getCoaches ?? []}
              key="coaches-autocomplete"
              optionLabel={({ name, lastName }: AutoComplete) => `${name} ${lastName}`}
              valueSerializer={({ _id }: AutoComplete) => _id}
            />
            <ControlledAutocomplete
              errors={errors}
              name="teamId"
              label="Teams"
              control={control}
              options={teams?.teamsRestful ?? []}
              key="teams-autocomplete"
              disabled
              optionLabel={({ name }: AutoComplete) => name}
              valueSerializer={({ name }: AutoComplete) => name}
              defaultValue={teams?.teamsRestful?.find((team) => team.id === teamId)}
            />
          </Stack>
        </DialogContent>
        <DialogActions style={{ alignItems: 'flex-end' }}>
          <Button variant="outlined" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button variant="contained" type="submit">
            {t('managements.teams.addCoach')}
          </Button>
        </DialogActions>
      </form>
    </DialogComponent>
  );
}
