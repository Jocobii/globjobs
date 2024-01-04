import { useState } from 'react';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import {
  Stack, Button, Collapse, Typography, Box,
} from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { useFindCompany } from '@gsuite/shared/services/cruces';
import { yupResolver } from '@hookform/resolvers/yup';
import { ControlledTextField, ControlledAutocomplete } from '@gsuite/shared/ui';
import { useForm, FieldValues } from 'react-hook-form';
import {
  clavesPedimentos, formFields, ADUANAS, PATENTES,
} from '../utils/constans';
import { filterSchema } from '../typings';

interface Props {
  open: boolean;
  onClose: () => void;
  handleSubmitForm: (data: FieldValues) => void;
}

export function Filters({ open, onClose, handleSubmitForm }: Props) {
  const { debouncedCompany, data: companyResult } = useFindCompany();
  const {
    register,
    control,
    getValues,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(filterSchema),
  });
  const [showAvanzedSearch, setShowAvanzedSearch] = useState(false);

  const handleClose = () => {
    reset();
    onClose();
    setShowAvanzedSearch(false);
  };

  const handleSearch = () => {
    filterSchema.validate(getValues()).then(() => {
      handleSubmitForm(getValues());
      handleClose();
    }).catch((err) => {
      console.log('err', err);
      setError(
        err.path,
        {
          type: 'manual',
          message: err.message,
        },
      );
    });
  };

  return (
    <Dialogeazy
      open={open}
      onClose={handleClose}
    >
      <Stack
        direction="column"
        justifyContent="start"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        <Typography variant="h3" sx={{ margin: 3 }}>Búsqueda</Typography>
        <form style={{ width: '100%', height: '100%' }}>
          <Stack spacing={2} sx={{ margin: 3, height: '90%' }}>
            <Typography variant="button" sx={{ margin: 3 }}>Búsqueda general</Typography>
            <ControlledAutocomplete
              errors={errors}
              name={formFields.client}
              label="Clave del cliente"
              placeholder="Ingresa nombre o numero del cliente"
              control={control}
              options={companyResult?.companiesFind ?? []}
              key="cliente-autocomplete"
              optionLabel={(clientValue: { name: string, number: string }) => {
                if (clientValue) {
                  return `${clientValue?.number} - ${clientValue?.name}`;
                }
                return null;
              }}
              valueSerializer={(clientValue: { name: string, number: string }) => {
                if (clientValue) {
                  setValue('client', clientValue?.number);
                  return clientValue?.number;
                }
                return null;
              }}
              customOnChange={(value) => {
                debouncedCompany(value);
              }}
            />
            <ControlledTextField
              fieldName={formFields.startDate}
              label="Fecha inicial"
              errors={errors}
              defaultValue={undefined}
              register={register}
              inputType="date"
            />
            <ControlledTextField
              fieldName={formFields.endDate}
              label="Fecha final"
              defaultValue={undefined}
              errors={errors}
              register={register}
              inputType="date"
            />
            <Button
              variant="text"
              onClick={() => setShowAvanzedSearch(!showAvanzedSearch)}
              sx={{ justifyContent: 'flex-start', color: 'black' }}
              endIcon={showAvanzedSearch ? <ArrowDropDown /> : <ArrowDropUp />}
            >
              <Typography variant="body1" sx={{ textDecoration: 'underline' }}>Busqueda avanzada</Typography>
            </Button>
            <Collapse in={showAvanzedSearch} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <ControlledAutocomplete
                  multiple
                  errors={errors}
                  name={formFields.pedimento}
                  options={[]}
                  label="Pedimento"
                  control={control}
                  freeSolo
                  // customErrorHelperText={errors[formFields.pedimento]}
                  key="actions-autocomplete"
                  optionLabel={(actionValue: any) => {
                    if (actionValue) {
                      return (
                        typeof actionValue === 'string'
                          ? actionValue
                          : actionValue?.name
                      );
                    }
                    return null;
                  }}
                  valueSerializer={(actionValue: string[]) => actionValue.map((value) => value)}
                />
                <ControlledAutocomplete
                  multiple
                  errors={errors}
                  name={formFields.cove}
                  options={[]}
                  label="Cove"
                  control={control}
                  freeSolo
                  key="actions-autocomplete"
                  optionLabel={(actionValue: any) => {
                    if (actionValue) {
                      return (
                        typeof actionValue === 'string'
                          ? actionValue
                          : actionValue?.name
                      );
                    }
                    return null;
                  }}
                  valueSerializer={(actionValue: string[]) => actionValue.map((value) => value)}
                />
                <ControlledAutocomplete
                  multiple
                  errors={errors}
                  name={formFields.factura}
                  options={[]}
                  label="Factura"
                  control={control}
                  freeSolo
                  key="actions-autocomplete"
                  optionLabel={(actionValue: any) => {
                    if (actionValue) {
                      return (
                        typeof actionValue === 'string'
                          ? actionValue
                          : actionValue?.name
                      );
                    }
                    return null;
                  }}
                  valueSerializer={(actionValue: string[]) => actionValue.map((value) => value)}
                />
                <ControlledAutocomplete
                  multiple
                  errors={errors}
                  name={formFields.clave}
                  options={clavesPedimentos}
                  label="Clave de pedimento"
                  control={control}
                  // customErrorHelperText={errors[formFields.clave]}
                  freeSolo
                  key="actions-autocomplete"
                  optionLabel={(actionValue: any) => {
                    if (actionValue) {
                      return (
                        typeof actionValue === 'string'
                          ? actionValue
                          : actionValue?.name
                      );
                    }
                    return null;
                  }}
                  valueSerializer={(actionValue: string[]) => actionValue.map((value) => value)}
                />
                <ControlledAutocomplete
                  multiple
                  errors={errors}
                  name={formFields.aduana}
                  options={ADUANAS}
                  label="Aduana"
                  control={control}
                  // customErrorHelperText={errors[formFields.aduana]}
                  freeSolo
                  key="actions-autocomplete"
                  optionLabel={(actionValue: any) => {
                    if (actionValue) {
                      return (
                        typeof actionValue === 'string'
                          ? actionValue
                          : actionValue?.name
                      );
                    }
                    return null;
                  }}
                  valueSerializer={(actionValue: string[]) => actionValue.map((value) => value)}
                />
                <ControlledAutocomplete
                  multiple
                  errors={errors}
                  name={formFields.patente}
                  options={PATENTES}
                  label="Patente"
                  control={control}
                  // customErrorHelperText={errors[formFields.patente]}
                  freeSolo
                  key="actions-autocomplete"
                  optionLabel={(actionValue: any) => {
                    if (actionValue) {
                      return (
                        typeof actionValue === 'string'
                          ? actionValue
                          : actionValue?.name
                      );
                    }
                    return null;
                  }}
                  valueSerializer={(actionValue: string[]) => actionValue.map((value) => value)}
                />
              </Stack>
            </Collapse>
          </Stack>
        </form>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: 3,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{ width: '70%' }}
            onClick={handleSearch}
          >
            Aplicar Filtros
          </Button>
        </Box>
      </Stack>
    </Dialogeazy>
  );
}
