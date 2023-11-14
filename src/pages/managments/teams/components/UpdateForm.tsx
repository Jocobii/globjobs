import { useGetTeam } from '../api';
import TeamsForm from './MainForm';
import { FormBaseProps, Team } from '../types';
import { useUpdateTeam } from '../api/updateTeams';

type UpdateProps = {
  teamId: string;
} & FormBaseProps;

export default function UpdateContent({ teamId, onClose, t }: UpdateProps) {
  const { data } = useGetTeam({ teamId });
  const { mutateAsync } = useUpdateTeam();

  const handleSubmit = async (values: Team) => {
    await mutateAsync({ data: values, teamId });
    onClose();
  };

  return (
    <TeamsForm
      t={t}
      onSubmit={handleSubmit}
      onClose={onClose}
      title={t('managements.teams.editTeam')}
      initialValues={data}
    />
  );
}
