import { SetStateAction, Dispatch } from 'react';
import {
  Menu,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import loadable from '@loadable/component';
import { NodeModels, RequiredActions } from '@gsuite/typings/files';
import { useCrossing } from '@gsuite/shared/contexts';
import { useDialog } from '@gsuite/shared/ui';
import LoadingBackdrop from '@gsuite/ui/LoadingBackdrop';

const AuthorizeProforma = loadable(() => import('@gsuite/shared/ui/cruces/AuthorizeProforma'), { fallback: <LoadingBackdrop /> });

type Props = {
  requiredActions: RequiredActions[],
  open: boolean;
  anchorEl: null | HTMLElement;
  setAnchorEl: (value: SetStateAction<HTMLElement | null>) => void;
  setRequiredActionsMenuIsOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function RequiredActionsMenu({
  open,
  anchorEl,
  setAnchorEl,
  requiredActions,
  setRequiredActionsMenuIsOpen = undefined,
}: Props) {
  const { crossing } = useCrossing();
  const [openDialog, closeDialog] = useDialog();

  const handleCloseMenu = () => {
    setAnchorEl(null);
    if (setRequiredActionsMenuIsOpen) setRequiredActionsMenuIsOpen(false);
  };

  const handleOpenAuthorizeForm = (fileNodeId: string, fileName: string) => {
    const targetNode = crossing?.nodes?.tree?.find(
      (n) => (
        (String(n.id) === String(fileNodeId))
        && (String(n.data?.file?.name) === String(fileName))
      ),
    );
    handleCloseMenu();
    openDialog({
      children: (
        (
          <AuthorizeProforma
            node={targetNode as NodeModels}
            crossingId={crossing?.id as string}
            fileId={targetNode?.id as string}
            fileName={targetNode?.data?.file?.name as string}
            fileUrl={targetNode?.data?.file?.url as string}
            onClose={closeDialog}
          />
        )
      ),
    });
  };

  return (
    <Menu
      sx={{ mt: 5 }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleCloseMenu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        },
      }}
    >
      <Stack sx={{ width: '100%' }} direction="column" spacing={2} p={3}>
        {requiredActions.map((ra) => (
          <Stack sx={{ width: '100%' }} direction="column" spacing={2} key={ra.fileNodeId ?? ra.nameFile}>
            <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
              {ra.nameFile}
              {' '}
              requiere de su autorización
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                handleOpenAuthorizeForm(String(ra.fileNodeId), ra.nameFile);
              }}
            >
              Autorizar
            </Button>
          </Stack>
        ))}
      </Stack>
    </Menu>
  );
}
