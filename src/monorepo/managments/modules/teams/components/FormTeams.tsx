import loadable from '@loadable/component';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import { TFunctionType } from '@gsuite/typings/common';

const UpdateContent = loadable(() => import('./UpdateForm'), { fallback: <h3>Loading...</h3> });
const CreateContent = loadable(() => import('./CreateForm'), { fallback: <h3>Loading...</h3> });

type BaseProps = {
  onClose: () => void;
  t: TFunctionType;
};

type Props = {
  open: boolean;
  teamId: string | null;
} & BaseProps;

export default function DrawerForm({
  open, onClose, teamId, t,
}: Props) {
  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      {
        teamId
          ? <UpdateContent teamId={teamId} onClose={onClose} t={t} />
          : <CreateContent onClose={onClose} t={t} />
      }
    </Dialogeazy>
  );
}
