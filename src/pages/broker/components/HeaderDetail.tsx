import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Stack } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import CancelForm from './CancelForm';

type Props = {
  OperationNumber: string;
  isInvoiced: boolean;
  isAdmin: boolean;
  OperationStep: number;
};

export default function HeaderDetail({
  OperationNumber, isInvoiced, isAdmin, OperationStep,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(!open);
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
      <Button startIcon={<ArrowBackIosIcon />} variant="contained" color="primary" onClick={() => navigate(-1)}>
        {t('broker.toReturn')}
      </Button>
      <Typography variant="h4" color="primary">
        {OperationNumber}
      </Typography>
      <Button color="error" disabled={isInvoiced || !isAdmin || OperationStep === 9} onClick={handleClick}>{t('broker.cancel')}</Button>
      <CancelForm handleClick={handleClick} isOpen={open} />
    </Stack>
  );
}
