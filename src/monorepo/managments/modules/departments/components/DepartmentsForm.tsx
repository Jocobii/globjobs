import { DeepPartial, SubmitHandler } from 'react-hook-form';
import { Formeazy } from '@gsuite/ui/Formeazy';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';

import { Department, departmentSchema } from '../types';
import { useCreateDepartment } from '../api/createDepartment';
import { useGetDepartment } from '../api/getDepartment';
import { useUpdateDepartment } from '../api/updateDepartment';

type BaseProps = {
  onClose: () => void;
};

type UpdateProps = {
  departmentId: string;
} & BaseProps;

type Props = {
  open: boolean;
  departmentId?: string | null;
} & BaseProps;

type FormProps = {
  initialValues?: DeepPartial<Department>;
  onSubmit: SubmitHandler<Department>;
  title: string;
} & BaseProps;

function DepartmentsForm({
  initialValues = {}, onSubmit, onClose, title,
}: FormProps) {
  return (
    <Formeazy<Department>
      withHeader
      title={title}
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
      initialValues={initialValues}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
}

function UpdateContent({ departmentId, onClose }: UpdateProps) {
  const { data: lastDepartment } = useGetDepartment({ departmentId });
  const { mutateAsync } = useUpdateDepartment();

  const onSubmit: SubmitHandler<Department> = async (data: Department) => {
    await mutateAsync({ data, departmentId });
    onClose();
  };

  return <DepartmentsForm title="Edit Department" initialValues={lastDepartment} onSubmit={onSubmit} onClose={onClose} />;
}

function DepartmentCreate({ onClose }: BaseProps) {
  const { mutateAsync } = useCreateDepartment();

  const onSubmit: SubmitHandler<Department> = async (data: Department) => {
    await mutateAsync({ data });
    onClose();
  };
  return <DepartmentsForm title="Create Department" onSubmit={onSubmit} onClose={onClose} />;
}

export default function DepartmentsDrawer({ open, onClose, departmentId = null }: Props) {
  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      {
        departmentId && departmentId !== 'create'
          ? <UpdateContent departmentId={departmentId} onClose={onClose} />
          : <DepartmentCreate onClose={onClose} />
      }
    </Dialogeazy>
  );
}
