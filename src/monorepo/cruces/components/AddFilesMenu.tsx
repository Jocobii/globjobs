import { SetStateAction, useState } from 'react';
import {
  Menu,
  MenuItem,
  MenuList,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { useCrossing } from '@gsuite/shared/contexts';
import { Theme } from '@mui/material/styles';
import loadable from '@loadable/component';
import { ARCHIVOS_GENERALES_FOLDER, DESPACHO_FOLDER, PEDIMENTOS_FOLDER } from '@gsuite/shared/seeders';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useTranslation } from 'react-i18next';

const UploadFileToFolder = loadable(() => import('./UploadFileToFolder'), { fallback: <div style={{ display: 'none' }} /> });

type Props = {
  open: boolean;
  setAnchorEl: (value: SetStateAction<HTMLElement | null>) => void;
  anchorEl: null | HTMLElement;
  theme: Theme;
  refetch?: () => void;
};

export default function AddFilesMenu({
  open, anchorEl, setAnchorEl, theme, refetch = () => {},
}: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { crossing } = useCrossing();
  const [folderSelected, setFolderSelected] = useState('');

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setAnchorEl(null);
    refetch();
  };

  return (
    <>
      <UploadFileToFolder
        isOpen={isOpen}
        setIsOpen={handleOpen}
        targetFolder={folderSelected}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: '100%',
              right: '50%',
              width: 12,
              height: 12,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{ mb: -10 }}
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
      >
        <MenuList>
          <MenuItem
            sx={{ mb: 1 }}
            disabled={!crossing?.sentDarwin && crossing?.nodes?.dispatchFileNode?.length === 0}
          >
            <ListItemIcon>
              <InsertDriveFileIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              sx={{
                color: theme.palette.primary.main,
              }}
              onClick={() => {
                handleOpen();
                setFolderSelected(DESPACHO_FOLDER);
              }}
            >
              Archivos a despacho
            </ListItemText>
          </MenuItem>
          <MenuItem sx={{ mb: 1 }} disabled={crossing?.nodes?.tree?.length === 0 || false}>
            <ListItemIcon>
              <InsertDriveFileIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              sx={{
                color: theme.palette.primary.main,
              }}
              onClick={() => {
                handleOpen();
                setFolderSelected(PEDIMENTOS_FOLDER);
              }}
            >
              Archivos a pedimento
            </ListItemText>
          </MenuItem>
          <MenuItem sx={{ mb: 1 }}>
            <ListItemIcon>
              <InsertDriveFileIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              sx={{
                color: theme.palette.primary.main,
              }}
              onClick={() => {
                handleOpen();
                setFolderSelected(ARCHIVOS_GENERALES_FOLDER);
              }}
            >
              {t('ui.generalFiles')}
            </ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
