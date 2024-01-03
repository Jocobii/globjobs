import React from 'react';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTranslation } from 'react-i18next';
import { STEPS_NAMES } from '@gsuite/shared/constants';

interface Props {
  isAdmin: boolean;
  isAdd: boolean;
  index: number;
  step: number;
  isInvoiced: boolean;
  openFromStep: (index: number) => void;
}
function SteperButtons({
  isAdmin, isAdd, openFromStep, index, step,
  isInvoiced,
}: Props) {
  const { t } = useTranslation();
  let buttons = null;

  if (isAdd && step === index) {
    buttons = (
      <Button
        startIcon={<AddIcon />}
        sx={{ position: 'absolute', mt: -5 }}
        onClick={() => openFromStep(index)}
      >
        {t('add')}
      </Button>
    );
  }
  if (isAdd && step !== index && isAdmin) {
    buttons = (
      <Button
        startIcon={<EditIcon />}
        sx={{ position: 'absolute', mt: -5 }}
        onClick={() => openFromStep(index)}
      >
        {t('edit')}
      </Button>
    );
  }
  if ((isAdd && step !== index && !isAdmin) || isInvoiced || step === STEPS_NAMES.COMPLETED) {
    buttons = (
      <Button
        startIcon={<RemoveRedEyeIcon />}
        sx={{ position: 'absolute', mt: -5 }}
        onClick={() => openFromStep(index)}
      >
        {t('view')}
      </Button>
    );
  }
  return buttons;
}

export default SteperButtons;
