import { DeepPartial, SubmitHandler } from 'react-hook-form';

import { Formeazy } from '@gsuite/ui/Formeazy';
import { TFunctionType } from '@gsuite/typings/common';

import { Team, teamSchema } from '../types';
import { useRestfulHeadquarters } from '../../headquarters/api/restful';

type BaseProps = {
  onClose: () => void;
  t: TFunctionType
};

type FormProps = {
  initialValues?: DeepPartial<Team>;
  onSubmit: SubmitHandler<Team>;
  title: string;
} & BaseProps;

export default function TeamsForm({
  initialValues = {}, onSubmit, onClose, title, t,
}: FormProps) {
  const { data } = useRestfulHeadquarters();
  return (
    <Formeazy<Team>
      withHeader
      title={title}
      schema={teamSchema}
      inputProps={{
        name: {
          label: t<string>('managements.nameSingular'),
        },
        'headquarter.id': {
          type: 'select',
          label: t<string>('managements.site'),
          options: data?.headquartersRestful?.map(({ id, name }) => ({
            value: id as unknown as string,
            title: name as string,
          })) || [],
        },
        'headquarter.name': {
          label: t<string>('managements.site'),
          type: 'autocomplete',
          keywords: data?.headquartersRestful?.map((headquarter) => headquarter.name || '') || [],
        },
        groupEmail: {
          label: t<string>('managements.emailAddress'),
        },
      }}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
}
