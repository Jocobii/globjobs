import { Dialogeazy } from '@gsuite/ui/Dialogeazy';

import AlertRedTeamStepper from './AlertRedTeamStepper';

type BaseProps = {
  onClose: () => void;
};

type FormProps = {
  open: boolean;
  number?: string;
  id?: string;
  title: string;
  teamId: string;
} & BaseProps;

export default function DrawerAlertRedTeam({
  open,
  onClose,
  title,
  id = undefined,
  number = undefined,
  teamId,
}: FormProps) {
  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      <AlertRedTeamStepper
        title={title}
        teamId={teamId}
        id={id}
        number={number}
        onClose={onClose}
      />
    </Dialogeazy>
  );
}
