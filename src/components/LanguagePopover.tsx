import { useRef, useState } from 'react';
import { find } from 'lodash';

import { alpha } from '@mui/material/styles';
import {
  Box, MenuItem, ListItemIcon, ListItemText, Tooltip, IconButton,
} from '@mui/material';

import MenuPopover from './MenuPopover';
import { mexicanFlag, usaFlag } from '../assets';
import i18n from '../i18n';

const allLang = [
  {
    value: 'en',
    label: 'English',
    icon: usaFlag,
  },
  {
    value: 'es',
    label: 'Español',
    icon: mexicanFlag,
  },
];

export default function LanguagePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const selectedLng = find(allLang, { value: i18n.language });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeLang = (value: string) => {
    i18n.changeLanguage(value);

    handleClose();
  };

  return (
    <>
      <Tooltip title="Change language">
        <IconButton
          ref={anchorRef}
          onClick={handleOpen}
          sx={{
            padding: 0,
            width: 44,
            height: 44,
            ...(open && {
              bgcolor: (theme) => alpha(
                theme.palette.primary.main,
                theme.palette.action.focusOpacity,
              ),
            }),
          }}
        >
          <img src={selectedLng?.icon} alt={selectedLng?.label} loading="lazy" width={24} height={24} />
        </IconButton>
      </Tooltip>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ py: 1, width: 140 }}
      >
        {allLang.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === selectedLng?.value}
            onClick={() => handleChangeLang(option.value)}
            sx={{ py: 1, px: 1.5, borderRadius: 1 }}
          >
            <ListItemIcon sx={{ mr: 1 }}>
              <Box component="img" alt={option.label} src={option.icon} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}
