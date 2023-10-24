import { MouseEvent, useState } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Box, Divider, Typography, Stack, MenuItem, IconButton,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import loadable from '@loadable/component';

import { MenuPopover } from '@gsuite/ui/MenuPopover';

const DrawerForm = loadable(() => import('./AlertRedTeam/DrawerAlertRedTeam'), { fallback: <h3>Loading...</h3> });

type AlertProps = {
  id: string;
  number: string;
};

export default function AlertPopover({ id, number }: AlertProps) {
  const [open, setOpen] = useState<Element | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [title, setTitle] = useState('');
  const [teamId, setTeamId] = useState('');

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => setOpen(event.currentTarget);
  const handleClose = () => setOpen(null);

  const handleDrawerOpen = () => {
    setOpenForm(true);
    handleClose();
  };
  const handleDrawerClose = () => setOpenForm(false);

  const MENU_OPTIONS: string[] = ['Equipo Rojos', 'Finanzas'];

  const addMap = (option: string) => {
    if (option === 'Equipo Rojos') {
      setTitle(option);
      setTeamId('63ed129fa6575a98cf8bbd3b');
      handleDrawerOpen();
    }
    handleClose();
  };

  const [optionMenu] = useState(MENU_OPTIONS);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '100%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <ErrorIcon />

      </IconButton>
      <DrawerForm
        open={Boolean(openForm)}
        onClose={handleDrawerClose}
        title={title}
        id={id}
        number={number}
        teamId={teamId}
      />

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 1.5,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.95,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>Alertar a:</Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {optionMenu.map((option) => (
            <MenuItem key={option} onClick={() => addMap(option)} disableRipple>
              {option}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
