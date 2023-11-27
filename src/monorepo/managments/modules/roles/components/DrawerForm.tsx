import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import { Props } from '../types';

import Form from './Form';

export default function DrawerForm({ open, onClose, roleId = undefined }: Props) {
  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      <Form
        roleId={roleId}
        onClose={onClose}
      />
    </Dialogeazy>
  );
}
