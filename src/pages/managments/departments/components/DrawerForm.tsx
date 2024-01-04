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
  // eslint-disable-next-line @typescript-eslint/no-shadow
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
        title={isUpdate ? t('managements.deparments.editDeparment') : t('managements.departments.create_department')}
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
