import { t } from 'i18next';
import { Formeazy } from '@gsuite/ui/Formeazy';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';

import { Department, departmentSchema, Props } from '../types';
import { useCreateDepartment } from '../api/createDepartment';
import { useGetDepartment } from '../api/getDepartment';
import { useUpdateDepartment } from '../api/updateDepartment';

export default function DrawerForm({ open, onClose, departmentId = undefined }: Props) {
  const { mutateAsync: createDepartment } = useCreateDepartment();
  const { mutateAsync: updateDepartment } = useUpdateDepartment();
  const { data } = useGetDepartment({ departmentId });

  const isUpdate = departmentId && departmentId !== 'create';
  const handleSubmit = (data: Department) => {
    if (isUpdate) {
      updateDepartment({ data, departmentId });
    } else {
      createDepartment({ data });
    }
    onClose();
  };
  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      <Formeazy<Department>
        withHeader
        title={isUpdate ? t('managements.departments.edit_department') : t('managements.departments.create_department')}
        schema={departmentSchema}
        inputProps={{
          name: {
            label: 'Name',
          },
          abbreviation: {
            label: 'Abbreviation',
          },
          email: {
            label: 'Email',
          },
        }}
        initialValues={data ?? {}}
        onSubmit={handleSubmit}
        onClose={onClose}
      />
    </Dialogeazy>
  );
}
