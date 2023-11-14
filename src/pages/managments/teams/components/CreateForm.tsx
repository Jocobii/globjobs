import TeamsForm from './MainForm';
import { FormBaseProps, Team } from '../types';
import { useCreateTeam } from '../api/createTeam';

export default function CreateContent({ onClose, t }: FormBaseProps) {
  const { mutateAsync } = useCreateTeam();

  const handleSubmit = async (data: Team) => {
    await mutateAsync({ data });

    onClose();
  };

  return (
    <TeamsForm
      t={t}
      title={t('managements.teams.createTeam')}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
