import { Dialogeazy } from '@gsuite/ui/Dialogeazy';

import { useGetModule } from '../api/getModule';
import { useUpdateModule } from '../api/updateModule';
import { useCreateModule } from '../api/createModule';
import Form from './Form';
import { Module } from '../types';

type Props = {
  open: boolean;
  moduleId?: string;
  onClose: () => void;
};

export default function DrawerForm({
  open,
  moduleId,
  onClose,
}: Props) {
  const { data } = useGetModule({ id: moduleId });
  const { mutateAsync: updateModule } = useUpdateModule({ moduleId });
  const { mutateAsync: createModule } = useCreateModule();
  const isUpdate = moduleId && moduleId !== 'create';

  const handleSubmit = (data: Module) => {
    if (isUpdate) {
      updateModule({ data, moduleId });
    } else {
      createModule({ data });
    }
    onClose();
  };

  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      <Form
        initialValues={data}
        moduleId={moduleId}
        onSubmit={handleSubmit}
      />
    </Dialogeazy>
  );
}