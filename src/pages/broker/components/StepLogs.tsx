import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DialogComponent } from '@/components';
import LogTimeLine from './LogTimeLine';

type Logs = {
  user: string;
  date: string;
  newValue: string;
};

interface Props {
  open: boolean;
  handleClose: () => void;
  logs: Logs[] | [];
}

export default function CustomizedTimeline({
  open = false, handleClose, logs,
}: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <DialogComponent
        open={open}
        handleClose={handleClose}
        okButtonVisibility={false}
        cancelButtonVisibility={false}
      >
        <DialogContent>
          <LogTimeLine logs={logs} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            {t('accept')}
          </Button>
        </DialogActions>
      </DialogComponent>
    </div>
  );
}
