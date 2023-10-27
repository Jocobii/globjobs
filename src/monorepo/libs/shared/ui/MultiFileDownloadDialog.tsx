import { useState, useEffect, ChangeEvent } from 'react';
import {
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Checkbox,
  Button,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FolderIcon from '@mui/icons-material/Folder';
import _ from 'lodash';

import { getIconImgeByExt } from '@gsuite/shared/utils/funcs';
import { downloadFilesZipByKeys } from '@gsuite/shared/services/downloadfilesZipByKeys';
import { NodeModels } from '@gsuite/typings/files';
import { TFunctionType } from '@gsuite/typings/common';

type Props = {
  title: string;
  onClose: () => void;
  nodes?: NodeModels[];
  t: TFunctionType;
  successMessage: (message: string) => void;
};

type File = {
  name?: string;
  key?: string;
  ext?: string;
  checked: boolean;
};

export default function MultiFileDownloadDialog({
  t,
  title,
  onClose,
  nodes = [],
  successMessage,
}: Props) {
  const theme = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [fileKeysBag, setFileKeysBag] = useState<string[]>([]);
  const [parentIsChecked, setParentIsChecked] = useState(true);

  useEffect(() => {
    const defaultFiles = nodes.filter((n) => !_.isNil(n?.data) && !_.isNil(n?.data?.file))
      ?.map(({ data }) => ({
        name: _.get(data, 'file.name', t('cruces.dispatch_file')),
        key: _.get(data, 'file.key', ''),
        ext: _.get(data, 'data.ext', 'pdf'),
        checked: true,
      }));
    setFiles(defaultFiles);
    setParentIsChecked(true);
  }, [nodes, t]);

  useEffect(() => {
    setFileKeysBag(files.filter((f) => !!f.checked).map((f) => f.key) as string[] || []);
  }, [files]);

  const handleFileCheck = (e: ChangeEvent<HTMLInputElement>, fileKey: string) => {
    const { checked } = e.target;
    const targetFileIndex = files.findIndex((n) => n.key === fileKey);
    setFiles((prev) => {
      const prevFiles = [...prev];
      prevFiles[targetFileIndex].checked = checked;
      setParentIsChecked(prevFiles.every((n) => n?.checked));
      return prevFiles;
    });
  };

  const handleDownloadZip = async () => {
    const filesResponse = await downloadFilesZipByKeys(fileKeysBag);
    if (filesResponse && filesResponse.size > 0) {
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(filesResponse);
      link.href = url;
      link.setAttribute('download', `${title}-files.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      successMessage(t('cruces.download_success'));
      onClose();
    }
  };

  const handleParentCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setParentIsChecked(checked);
    setFiles((prev) => prev.map((n) => ({ ...n, checked })));
  };

  return (
    <Stack sx={{ minWidth: 600 }} direction="column">
      <Stack
        p={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ minWidth: '100%' }}
      >
        <Typography sx={{ fontWeight: 600 }}>{t('cruces.files_to_download')}</Typography>
        <IconButton onClick={onClose}><ClearIcon /></IconButton>
      </Stack>
      <Divider />
      <Stack direction="column" p={2}>
        <Typography>{t('cruces.files_select')}</Typography>
        <Stack direction="row" spacing={1} mt={2} alignItems="center">
          <Checkbox checked={parentIsChecked} onChange={handleParentCheck} />
          <FolderIcon sx={{ color: theme.palette.primary.main }} />
          <Typography sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {title}
          </Typography>
        </Stack>
        <Stack
          direction="column"
          sx={{ minWidth: '100%', pl: 5 }}
          spacing={1}
        >
          {files?.map(({ key, ext, checked }) => (
            <Stack direction="row" sx={{ minWidth: '100%' }} alignItems="center" key={key}>
              <Checkbox checked={checked} onChange={(e) => handleFileCheck(e, key as string)} />
              <IconButton
                sx={{ pointerEvents: 'none' }}
              >
                <img
                  src={getIconImgeByExt(ext)}
                  alt="file"
                  height={30}
                  width={30}
                  draggable={false}
                />
              </IconButton>
              {key}
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Divider />
      <Stack
        p={2}
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button onClick={onClose}>{t('cruces.cancel')}</Button>
        <Button
          variant="contained"
          disabled={fileKeysBag?.length < 2}
          onClick={handleDownloadZip}
        >
          {t('cruces.download_files')}
        </Button>
      </Stack>
    </Stack>
  );
}
