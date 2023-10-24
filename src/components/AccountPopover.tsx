import { MouseEvent, useState } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';

import MenuPopover from './MenuPopover';
import useAuthentication from '@/hooks/useAuthentication';

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Settings',
    linkTo: '/',
  },
];

export default function AccountPopover() {
  const { user, handleLogOut } = useAuthentication();
  const [open, setOpen] = useState<Element | null>(null);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => setOpen(event.currentTarget);
  const handleClose = () => setOpen(null);

  const fullName = `${user?.name} ${user?.lastName}` || 'loading...';

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
        <Avatar alt={`${user?.name} ${user?.lastName}`} src={user?.photoUrl} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.95,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.emailAddress}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} onClick={handleClose} component={Link}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ m: 1 }} onClick={handleLogOut}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
