import { Dispatch, SetStateAction } from 'react';
import { ControlledAutocomplete } from '@gsuite/shared/ui';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFindCompanies } from '@gsuite/shared/services/cruces';

type Props = {
  setSapNumber: Dispatch<SetStateAction<string>>;
};

export function CompaniesAutoCompleted({ setSapNumber }: Props) {
  const { data } = useFindCompanies();

  const schema = yup.object().shape({
    clientNumber: yup.string().required('El cliente es requerido'),
  });
  const {

    formState: { errors },
    control,
  } = useForm<FieldValues>({
    mode: 'onChange',
    resolver: yupResolver(schema) as any,
  });

  return (
    <ControlledAutocomplete
      errors={errors}
      name="client"
      freeSolo
      sx={{ marginBottom: 2 }}
      label="Cliente"
      placeholder="Escribe la clave sap del cliente"
      control={control}
      options={data?.companiesFind ?? []}
      key="cliente-autocomplete"
      optionLabel={(clientValue: { name: string, number: string }) => {
        if (clientValue) {
          return `${clientValue?.number} - ${clientValue?.name}`;
        }
        return null;
      }}
      onSelect={(value) => {
        if (!value.includes('-')) return;
        const sapNumber = value.split('-')[0].trim() ?? '';
        setSapNumber(sapNumber);
      }}
      valueSerializer={(clientValue: { name: string, number: string }) => {
        if (clientValue) {
          return clientValue?.name;
        }
        return null;
      }}
      customOnChange={(value) => {
        if (!value) setSapNumber('');
      }}
    />
  );
}
