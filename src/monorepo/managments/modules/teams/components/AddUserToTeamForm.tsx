import { DeepPartial, SubmitHandler } from 'react-hook-form';

import { TFunctionType } from '@gsuite/typings/common';
import { Formeazy } from '@gsuite/ui/Formeazy';

import { AssignTeam, assignToTeamSchema } from '../types';
import { useFindUser } from '../../../services/findUser';

type AddUserToTeamFormProps = {
  onClose: () => void;
  onSubmit: SubmitHandler<AssignTeam>;
  initialValues?: DeepPartial<AssignTeam>;
  t: TFunctionType;
};

export default function AddUserToTeamForm({
  initialValues = {},
  onClose,
  onSubmit,
  t,
}: AddUserToTeamFormProps) {
  const { debouncedUser, data } = useFindUser();
  return (
    <Formeazy<AssignTeam>
      withHeader
      title={t('managements.teams.addSpecialist')}
      schema={assignToTeamSchema({ t })}
      inputProps={{
        target: {
          label: t('managements.nameSingular'),
          type: 'autocomplete',
          customOnChange: debouncedUser,
          keywords: data?.userFind || [],
          valueSerializer: (dataValue: { id: string, name: string }) => {
            if (dataValue) {
              const { id, name } = dataValue;
              return {
                id,
                name,
              };
            }
            return null;
          },
          optionLabel: (dataValue: { name: string; lastName: string }) => {
            if (dataValue) {
              const { name, lastName } = dataValue;
              return `${name} ${lastName}`;
            }
            return '';
          },
        },
      }}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
}
