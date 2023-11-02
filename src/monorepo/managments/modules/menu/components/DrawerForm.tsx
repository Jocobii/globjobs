import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import { useGetMenu } from '../api/getMenu';
import { useUpdateMenu } from '../api/updateMenu';
import { useCreateMenu } from '../api/createMenu';
import Form from './form';
import { Menu } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  rowId?: string,
};

export default function DrawerForm({ open, onClose, rowId = undefined }: Props) {
  const { data } = useGetMenu({ id: rowId });
  const { mutateAsync: updateMenu } = useUpdateMenu();
  const { createMenu } = useCreateMenu();
  const isUpdate = rowId && rowId !== 'create';

  const handleSubmit = (data: Menu) => {

    if (isUpdate) {
      updateMenu({ data, menuId: rowId });
    }

    if (!isUpdate) {
      createMenu({ variables: {
        name: data.name,
        icon: data.icon,
        modules: data.modules.map((m) => m.id),
        environment: data.environment,
      } });
    }
    onClose();
  }

  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      <Form
        rowId={rowId}
        initialValues={data}
        onSubmit={handleSubmit}
      />
    </Dialogeazy>
  );
}
