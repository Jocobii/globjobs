import { DeepPartial, SubmitHandler } from 'react-hook-form';

import { Formeazy } from '@gsuite/ui/Formeazy';
import { TFunctionType } from '@gsuite/typings/common';

import { AssignTeam, assignToTeamSchema } from '../types';
import { useFindCompany } from '../../../services/findCompany';

type AddClientToTeamFormProps = {
  onClose: () => void;
  onSubmit: SubmitHandler<AssignTeam>;
  initialValues?: DeepPartial<AssignTeam>;
  t: TFunctionType;
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
      title={t('managements.teams.addClient')}
      schema={assignToTeamSchema({ t })}
      inputProps={{
        target: {
          label: t('managements.teams.companySearch'),
          type: 'autocomplete',
          customOnChange: debouncedCompany,
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
