import CircularLoader from '@gsuite/shared/ui/CircularLoader';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import LabelIcon from '@mui/icons-material/Label';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import { ControlledAutocomplete, Conditional } from '@gsuite/shared/ui';
import { FileDropZone } from '@gsuite/typings/files';
import { useGetCatalog } from '@gsuite/shared/services/catalogs';

interface Props {
  files: any;
  setFiles: (files: FileDropZone[]) => void;
}

function Tagger({
  files,
  setFiles,
}: Props) {
  const { data: catalogTags, loading } = useGetCatalog('tagsORC');
  console.log(loading);
  const schema = yup.object().shape({
    etiqueta: yup.string().required('La etiqueta es requerida'),
  });
  const {
    setValue,
    control,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
  });

  const changeTagFile = (name: string, tag: string) => {
    const updatedFiles = files.map((file: any) => {
      if (file.name === name) {
        return Object.assign(file, { tags: tag });
      }
      return file;
    });
    setFiles(updatedFiles);
  };
  return (
    <Conditional
      loadable={!loading}
      initialComponent={<CircularLoader />}
    >
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ textAlign: 'center', width: '100%', alignContent: 'center' }}
        >
          <Grid item xs={6} sm={4} md={4}>
            Nombre del archivo
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <LabelIcon />
            {' '}
            Etiqueta
          </Grid>
          {
              !loading && files?.map((file: any) => (
                <>
                  <Grid container key={file.id} spacing={2} rowSpacing={1}>
                    <Grid item xs={6}>
                      {file.name}
                    </Grid>
                    <Grid item xs={6}>
                      <ControlledAutocomplete
                        errors={errors}
                        name="etiqueta"
                        label="Tipo"
                        control={control}
                        onSelect={(e) => changeTagFile(file.name, e)}
                        options={catalogTags?.getCatalogs || []}
                        defaultValue={() => {
                          if (!file.tags) return null;
                          setValue('etiqueta', file.tags || '');
                          return catalogTags?.getCatalogs?.find(
                            (tag) => tag.name === file.tags,
                          );
                        }}
                        key="folder-autocomplete"
                        optionLabel={(optionLabel: { name?: string; }) => optionLabel?.name || ''}
                        valueSerializer={(valueSerializer: { id?: string; }) => valueSerializer?.id || ''}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  <br />
                </>
              ))
            }
        </Grid>
      </Box>
    </Conditional>
  );
}

export default Tagger;
