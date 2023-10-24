import { TFunctionType } from '@gsuite/typings/common';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import { SubmitHandler } from 'react-hook-form';
import { AssignTeam } from '../types';
import { useChangeUsersFromTeam } from '../api/changeUsersFromTeam';
import { useChangeCompaniesFromTeam } from '../api/changeCompaniesFromTeam';
import AddUserToTeamForm from './AddUserToTeamForm';
import AddClientToTeamForm from './AddClientToTeamForm';

type BaseProps = {
  onClose: () => void;
  t: TFunctionType;
};

type ContentProps = {
  teamId: string;
} & BaseProps;

type PropsDrawer = {
  open: boolean;
  isCustomer: boolean;
  teamId: string;
} & BaseProps;

function ClientContent({ onClose, teamId, t }: ContentProps) {
  const { mutateAsync } = useChangeCompaniesFromTeam({});
  const onSubmit: SubmitHandler<AssignTeam> = async (data: Partial<AssignTeam>) => {
    await mutateAsync({ teamId, ids: [data.target?.number as string] });
    onClose();
  };

  return (
    <AddClientToTeamForm
      key="assign-client-form"
      onClose={onClose}
      onSubmit={onSubmit}
      t={t}
    />
  );
}

function SpecialistContent({ onClose, teamId, t }: ContentProps) {
  const { mutateAsync } = useChangeUsersFromTeam({});
  const onSubmit: SubmitHandler<AssignTeam> = async (data: Partial<AssignTeam>) => {
    await mutateAsync({ teamId, ids: [data.target?.id as string] });
    onClose();
  };

  return (
    <AddUserToTeamForm
      key="assign-user-form"
      onClose={onClose}
      onSubmit={onSubmit}
      t={t}
    />
  );
}

export default function DrawerAssignToTeamForm({
  open, onClose, isCustomer, teamId, t,
}: PropsDrawer) {
  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      {
        isCustomer
          ? <ClientContent onClose={onClose} teamId={teamId} t={t} />
          : <SpecialistContent onClose={onClose} teamId={teamId} t={t} />
      }
    </Dialogeazy>
  );
}
