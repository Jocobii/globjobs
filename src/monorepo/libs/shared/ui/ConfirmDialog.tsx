import { useTranslation } from 'react-i18next';
import DialogComponent from './DialogComponent';

interface Props {
  open: boolean;
  titleText: string,
  titleBody: string,
  okText: string,
  handleOpen: () => void;
  confirmAction: () => void;
}

function ConfirmDialog({
  open, handleOpen, confirmAction,
  titleText = 'areYouSure',
  titleBody = 'thisActionCannotBeUndone',
  okText = 'confirm',
}: Props) {
  const { t } = useTranslation();
  return (
    <DialogComponent
      title={t(titleText)}
      body={t(titleBody)}
      open={open}
      handleClose={handleOpen}
      handleConfirm={confirmAction}
      okText={t(okText)}
      cancelText={t('cancel')}
    />
  );
}

export default ConfirmDialog;
