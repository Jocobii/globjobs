import { MouseEvent, useState } from 'react';

import { alpha, styled } from '@mui/material/styles';
import {
  Grid,
  Paper,
  Typography,
  IconButton,
  Button,
  Link,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

import Scrollbar from './Scrollbar';
import MenuPopover from './MenuPopover';

const ITEM_HEIGHT = 64;
const subTitleStyle = { color: '#696974', fontWeight: 'bold' };

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: 16,
  fontWeight: 'bold',
  height: ITEM_HEIGHT / 2,
}));

export default function ShortcutPopover() {
  const [open, setOpen] = useState<Element | null>(null);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: (theme) => alpha(
              theme.palette.primary.main,
              theme.palette.action.focusOpacity,
            ),
          }),
        }}
      >
        <SettingsSuggestIcon width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 320,
          '& .MuiMenuItem-root': {
            px: 1.5,
            height: ITEM_HEIGHT,
            borderRadius: 0.75,
          },
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        >
          <Typography variant="h6" sx={{ p: 1.5 }}>
            Configuración
          </Typography>
        </div>

        <Scrollbar sx={{ height: ITEM_HEIGHT * 4 }}>
          <Grid
            container
            rowSpacing={2}
            spacing={2}
          >
            <Grid item xs={12}>
              <p style={subTitleStyle}>Mi Cuenta</p>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Button startIcon={<BadgeIcon />} disabled>
                  Mis datos
                </Button>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Button startIcon={<NotificationsIcon />} disabled>
                  Notificaciones
                </Button>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <p style={subTitleStyle}>Adminitración de Usuarios</p>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Button startIcon={<PersonIcon />} disabled>
                  Usuarios
                </Button>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Link underline="none" color="inherit" href="/m/teams">
                  <Button startIcon={<SupervisedUserCircleIcon />}>
                    Equipos
                  </Button>
                </Link>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <p style={subTitleStyle}>Adminitración de Clientes</p>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Link underline="none" color="inherit" href="/m/company">
                  <Button startIcon={<BusinessIcon />}>
                    Clientes
                  </Button>
                </Link>
              </Item>
            </Grid>
          </Grid>
        </Scrollbar>
      </MenuPopover>
    </>
  );
}
