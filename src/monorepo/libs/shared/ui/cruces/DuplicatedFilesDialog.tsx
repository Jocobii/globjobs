import { useState } from 'react';
import _ from 'lodash';
import {
  Stack,
  IconButton,
  Divider,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ClearIcon from '@mui/icons-material/Clear';

import { TFunctionType } from '@gsuite/typings/common';
import { FileDropZone, PreTaggedFile } from '@gsuite/typings/files';
import { addNewFilesToCrossing } from '@gsuite/shared/services/cruces';

type Props = {
  onClose: () => void;
  targetFolder: string;
  crossingId: string;
  showMessage: (message: string, type: string) => void;
  openTab: (integrationNumber: string) => void;
  updateHistory: (files: string[], action: string, comments?: string) => Promise<void>,
  t: TFunctionType,
  files?: FileDropZone[];
  preTaggedFiles?: PreTaggedFile[];
  pedimento?: string;
  comments?: string;
  refetch?: () => void;
  hasRelatedFiles?: boolean,
};

export default function DuplicatedFilesDialog({
  onClose,
  targetFolder,
  crossingId,
  showMessage,
  openTab,
  updateHistory,
  t,
  files = [],
  preTaggedFiles = [],
  pedimento = '',
  comments = '',
  refetch = undefined,
  hasRelatedFiles = false,
}: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadFiles = async () => {
    setIsLoading(true);

    try {
      const response = await addNewFilesToCrossing({
        crossingId,
        files,
        comments,
        pedimento,
        preTaggedFiles,
        targetFolder,
      });

      if (refetch) refetch();

      const replacements = _.get(response, 'data.replacements', []) || [];
      const newFiles = _.get(response, 'data.newFiles', []) || [];
      const errors = _.get(response, 'data.errors', []) || [];

      if (replacements && showMessage) showMessage(`Se reemplazaron ${replacements?.length} archivos`, 'success');

      if (errors?.length > 0 && showMessage) {
        errors.forEach((x: { message: string, type: string }) => showMessage(x.message, x.type));
      }

      const newDodaFile = [...replacements, ...newFiles].find(
        (x) => x?.tags?.toLowerCase()?.includes('doda / pita') && x?.integrationNumber,
      );
      openTab(newDodaFile?.integrationNumber);

      updateHistory([...replacements, ...newFiles].map((x) => x?.name), 'update_file', comments);
    } catch (error) {
      const message = _.get(error, 'message', '');
      if (showMessage) showMessage(message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Stack sx={{ minWidth: 600 }} direction="column">
      <Stack
        p={2}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ minWidth: '100%' }}
      >
        <IconButton
          onClick={() => {
            if (!isLoading) onClose();
          }}
          disabled={isLoading}
        >
          <ClearIcon />
        </IconButton>
      </Stack>
      <Divider />
      <Stack direction="column" p={2} alignItems="center">
        <Typography
          color="primary"
          variant="h5"
        >
          {hasRelatedFiles ? t('cruces.repeatedRelatedFilesAlert') : t('cruces.repeatedFilesAlert')}
        </Typography>
        <Typography
          color="primary"
          variant="h5"
        >
          {t('cruces.repeatedFilesDisclaimer')}
        </Typography>
        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={confirmed}
                onChange={({ target }) => setConfirmed(target.checked)}
              />
              )}
            label={t('cruces.fileReplacementConfirmation')}
          />
        </FormGroup>
      </Stack>
      <Divider />
      <Stack
        py={2}
        sx={{ minWidth: '100%' }}
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Button
          disableElevation
          variant="outlined"
          disabled={isLoading}
          onClick={() => {
            if (!isLoading) onClose();
          }}
        >
          {t('cruces.cancel')}
        </Button>
        <LoadingButton
          disabled={!confirmed}
          disableElevation
          loading={isLoading}
          variant="contained"
          onClick={handleUploadFiles}
        >
          {t('cruces.sendFiles')}
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
