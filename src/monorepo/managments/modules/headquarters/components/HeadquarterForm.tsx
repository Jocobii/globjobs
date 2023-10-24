import { Formeazy } from '@gsuite/ui/Formeazy';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import { DeepPartial, SubmitHandler } from 'react-hook-form';

import { Headquarter, headquarterSchema } from '../types';
import { useCreateHeadquarter, useUpdateHeadquarter, useGetHeadquarter } from '../api';

type BaseProps = {
  onClose: () => void;
};

type UpdateProps = {
  headquarterId: string;
} & BaseProps;

type Props = {
  open: boolean;
  headquarterId?: string | null;
} & BaseProps;

type FormProps = {
  initialValues?: DeepPartial<Headquarter>;
  onSubmit: SubmitHandler<Headquarter>;
  title: string;
} & BaseProps;

function HeadquarterForm({
  initialValues = {}, onSubmit, onClose, title,
}: FormProps) {
  return (
    <Formeazy<Headquarter>
      withHeader
      title={title}
      schema={headquarterSchema}
      inputProps={{
        name: {
          label: 'name',
        },
        type: {
          label: 'type',
          type: 'select',
          options: [
            { value: 'Office', title: 'Office' },
            { value: 'Warehouse', title: 'Warehouse' },
          ],
        },
        phone: {
          label: 'phone',
        },
        'address.address1': {
          label: 'Address 1',
        },
        'address.address2': {
          label: 'Address 2',
        },
        'address.city': {
          label: 'City',
        },
        'address.state': {
          label: 'State or Province',
        },
        'address.postalCode': {
          label: 'Postal Code',
        },
        'address.country': {
          label: 'Country',
        },
      }}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
}

function UpdateContent({ headquarterId, onClose }: UpdateProps) {
  const { data: lastHeadquarter } = useGetHeadquarter({ headquarterId });
  const { mutateAsync } = useUpdateHeadquarter();

  const onSubmit: SubmitHandler<Headquarter> = async (data: Headquarter) => {
    await mutateAsync({ data, headquarterId });

    onClose();
  };

  return <HeadquarterForm title="Edit Headquarter" initialValues={lastHeadquarter} onSubmit={onSubmit} onClose={onClose} />;
}

function HeadquarterCreate({ onClose }: BaseProps) {
  const { mutateAsync } = useCreateHeadquarter();

  const onSubmit: SubmitHandler<Headquarter> = async (data: Headquarter) => {
    await mutateAsync({ data });

    onClose();
  };
  return <HeadquarterForm title="Create Headquarter" onSubmit={onSubmit} onClose={onClose} />;
}

export default function HeadquarterDrawer({
  open, onClose, headquarterId = null,
}: Props) {
  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      {
        headquarterId && headquarterId !== 'create'
          ? <UpdateContent headquarterId={headquarterId} onClose={onClose} />
          : <HeadquarterCreate onClose={onClose} />
      }
    </Dialogeazy>
  );
}
