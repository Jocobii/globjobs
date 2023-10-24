import { DeepPartial, SubmitHandler } from 'react-hook-form';

import { Formeazy } from '@gsuite/ui/Formeazy';

import { AssignTeam, assignToTeamSchema } from '../types';
import { useFindCompany } from '../../../services/findCompany';

type AddClientToTeamFormProps = {
  onClose: () => void;
  onSubmit: SubmitHandler<AssignTeam>;
  initialValues?: DeepPartial<AssignTeam>;
  t: <T>(key: string | string[]) => T;
};

export default function AddClientToTeamForm({
  initialValues = {},
  onClose,
  onSubmit,
  t,
}: AddClientToTeamFormProps) {
  const { debouncedCompany, data } = useFindCompany();
  return (
    <Formeazy<AssignTeam>
      withHeader
      title={t<string>('managements.teams.addClient')}
      schema={assignToTeamSchema({ t })}
      inputProps={{
        target: {
          label: t<string>('managements.teams.companySearch'),
          type: 'autocomplete',
          customOnChange: (value) => debouncedCompany(value as string),
          keywords: data?.companiesFind || [],
          valueSerializer: (dataValue: { name: string, number: string }) => {
            if (dataValue) {
              const { name, number } = dataValue;
              return {
                name,
                number,
              };
            }
            return null;
          },
          optionLabel: (dataValue: { name: string; number: string }) => {
            if (dataValue) {
              const { name, number } = dataValue;
              return `${name} ${number}`;
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
