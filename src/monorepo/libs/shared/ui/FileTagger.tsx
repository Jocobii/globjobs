import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import capitalize from 'lodash/capitalize';
import CircularLoader from '@gsuite/shared/ui/CircularLoader';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SdCardIcon from '@mui/icons-material/SdCard';
import LabelIcon from '@mui/icons-material/Label';
import Checkbox from '@mui/material/Checkbox';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import { ControlledAutocomplete, Conditional } from '@gsuite/shared/ui';
import { FileDropZone, SimpleNode } from '@gsuite/typings/files';
import { getTagsFiles } from '../services/cruces/crossingTags';
import { useGetCatalog } from '../services/catalogs';

interface Props {
  files: FileDropZone[];
  getTaggerFiles: (filesData: SimpleNode[]) => void;
  defaultTags?: string;
  firstDigitized?: boolean;
  setHasProforma?: (prop: boolean) => void;
  setDisabled?: (prop: boolean) => void;
}

function FileTagger({
  files,
  getTaggerFiles,
  defaultTags = '',
  firstDigitized = false,
  setHasProforma = () => null,
  setDisabled = () => null,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { data: catalogTags } = useGetCatalog('tagsORC');
  const filesToSimpleNode = (myFiles: FileDropZone[]) => myFiles.map((file) => ({
    id: file?.id ?? '',
    name: file?.name ?? '',
    tags: defaultTags,
    type: file.type ?? '',
    key: file.name.split('.')[0],
    firstDigitized,
  }));

  const [filesData] = useState<SimpleNode[]>(filesToSimpleNode(files));
  const [filesDataTagged, setFilesDataTagged] = useState<SimpleNode[]>([]);
  const schema = yup.object().shape({
    etiqueta: yup.string().required('La etiqueta es requerida'),
  });

  useEffect(() => {
    if (getTaggerFiles) getTaggerFiles(filesDataTagged);
  }, [files, filesDataTagged, getTaggerFiles]);

  const updateNode = (name: string, digitalized?: boolean, tags?: string) => {
    const updatedFiles = filesDataTagged.map((file) => {
      if (file.name === name) {
        return {
          ...file,
          ...(tags && { tags }),
          ...(typeof digitalized === 'boolean' && { firstDigitized: digitalized }),
        };
      }
      return file;
    });
    setHasProforma(
      updatedFiles.some((file) => capitalize(file.tags) === 'Proforma'),
    );
    setDisabled(
      !updatedFiles.every((file) => file.tags),
    );
    setFilesDataTagged(updatedFiles);
  };

  const handleChangeLabel = (name: string, selectedTag: string) => updateNode(
    name,
    undefined,
    selectedTag,
  );

  const handleChangeDigitized = (
    event:
    React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => updateNode(
    name,
    event.target.checked,
  );

  const {
    setValue,
    control,
    formState: {
      errors,
    },
  } = useForm({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    async function getTags() {
      return getTagsFiles(files);
    }
    getTags().then((res) => {
      if (typeof res === 'string') return;

      const updatedFiles = filesData.map((file) => {
        const fileTag = res.find((tag) => tag.file === file.name);
        if (fileTag) {
          return {
            ...file,
            tags: fileTag.tag,
          };
        }
        return file;
      });
      setFilesDataTagged(updatedFiles);
      setDisabled(
        !updatedFiles.every((file) => file.tags !== 'unknown'),
      );
    });
  }, []);

  return (
    <Conditional
      loadable={filesDataTagged?.length > 0}
      initialComponent={<CircularLoader />}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ textAlign: 'center' }}
        >
          <Grid item xs={6} sm={4} md={4}>
            {t('cruces.file_name')}
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <LabelIcon />
            {' '}
            {t('cruces.file_tag')}
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <SdCardIcon sx={{ transform: 'rotate(90deg)' }} />
            {' '}
            {t('cruces.file_digitize')}
          </Grid>
          {
              filesDataTagged?.length > 0 && filesDataTagged?.map((file) => (
                <>
                  <Grid container key={file.id} spacing={2} rowSpacing={1}>
                    <Grid item xs={6} sm={4} md={4}>
                      {file.name}
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <ControlledAutocomplete
                        errors={errors}
                        name="etiqueta"
                        label={t('cruces.file_type')}
                        control={control}
                        onSelect={(e) => handleChangeLabel(file.name, e)}
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
                    <Grid item xs={2} sm={4} md={4}>
                      <Checkbox
                        checked={file.firstDigitized}
                        onChange={(e) => handleChangeDigitized(e, file.name)}
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

export default FileTagger;
