import { Dispatch, SetStateAction, useEffect } from 'react';
import { Grid, Stack, MenuItem } from '@mui/material';
import {
  ControlledSelect, Dropzone, ControlledTextField,
  ControlledAutocomplete,
} from '@/components'
import { useForm } from 'react-hook-form';
import { useFindCompany } from '@/hooks';
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCrossing, CreateCrossingType } from '../../../types'
import { FileDropZone } from '@/typings/files';

const crossingType = ['Importacion', 'Exportacion'];

interface Props {
  files: FileDropZone[],
  setFiles:  Dispatch<SetStateAction<FileDropZone[]>>,
  setCrossingValues: Dispatch<SetStateAction<CreateCrossingType>>
}

export const Form = ({ files, setFiles, setCrossingValues }: Props) => {
  const { searchByNameOrNumber, data } = useFindCompany();
  const {
    register,
    setValue,
    getValues,
    formState: { errors, isValid },
    control,
  } = useForm<CreateCrossingType>({
    mode: 'onChange',
    resolver: zodResolver(CreateCrossing),
  });

  useEffect(() => {
    setCrossingValues(getValues())
  }, [isValid])

  return (
    <>
      <Grid item lg={3} md={3} sm={3} xs={3}>
        <Grid container spacing={2} sx={{ p: '5px' }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Stack
              direction="column"
              justifyContent="space-evenly"
              alignItems="center"
              spacing={2}
            >
              <form id='my-form'>
                <Stack spacing={2} direction="column">
                  <Stack direction="row" spacing={2}>
                    <ControlledSelect
                      name="type"
                      label="Tipo"
                      control={control}
                      defaultValue=""
                      key="importType-select"
                      errors={errors}
                    >
                      {crossingType.map((cruceType) => (
                        <MenuItem key={cruceType} value={cruceType}>
                          {cruceType}
                        </MenuItem>
                      ))}
                    </ControlledSelect>
                  </Stack>
                  <ControlledAutocomplete
                    errors={errors}
                    name="client"
                    label="Cliente"
                    control={control}
                    options={data}
                    key="cliente-autocomplete"
                    optionLabel={(clientValue: { name: string, number: string }) => {
                      if (clientValue) {
                        return `${clientValue?.number} - ${clientValue?.name}`;
                      }
                      return null;
                    }}
                    valueSerializer={(clientValue: { name: string, number: string }) => {
                      if (clientValue) {
                        setValue('clientNumber', clientValue?.number);
                        return clientValue?.name;
                      }
                      return null;
                    }}
                  customOnChange={(value) => searchByNameOrNumber(value)}
                  />
                  <Stack spacing={3} sx={{ pt: 1 }} direction="row">
                    <ControlledTextField
                      label="Patente"
                      register={register}
                      inputType="text"
                      errors={errors}
                      fieldName="patente"
                      key="patente-field"
                    />
                    <ControlledTextField
                      label="Aduana"
                      register={register}
                      inputType="text"
                      errors={errors}
                      fieldName="aduana"
                      key="aduana-field"
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Dropzone
                      label="Archivos"
                      files={files}
                      disabled={!isValid}
                      filesSetter={setFiles}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <ControlledTextField
                      label="Comentarios"
                      register={register}
                      inputType="text"
                      errors={errors}
                      fieldName="comments"
                      key="comments-field"
                    />
                  </Stack>
                </Stack>
              </form>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
