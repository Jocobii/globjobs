import { lazy, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, FilterListOff as FilterListOffIcon } from '@mui/icons-material';
import { Stack, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SelectOperation = lazy(() => import('./SelectOperation'));

type Props = {
  statusFilter: string | undefined;
  handleCreateOperation: () => void;
};

function OperationButtons({ statusFilter, handleCreateOperation }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openSelectOperation, setOpenSelectOperation] = useState<boolean>(false);
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent="flex-start" alignItems="center">
      <Button
        sx={{ py: 1, my: 1, width: 200 }}
        onClick={() => setOpenSelectOperation(true)}
        variant="contained"
        startIcon={<AddIcon />}
      >
        {t<string>('broker.requestOperation')}
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate('/g/ops')}
        sx={{ py: 1, my: 1, width: 'auto' }}
        startIcon={<FilterListOffIcon />}
        disabled={!statusFilter}
      >
        {t<string>('broker.cleanStatusFilter')}
      </Button>
      <SelectOperation
        open={openSelectOperation}
        handleClose={() => setOpenSelectOperation(false)}
        handleCreateOperation={handleCreateOperation}
      />
    </Stack>
  );
}

export default OperationButtons;
