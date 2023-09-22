import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import {
  Theme, Box, Stack, AppBar, Toolbar, IconButton, Grid,
} from '@mui/material';
import { Breadcrums } from '@/components'
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import Logo from './Logo';
import { DataContext } from '../contexts/AppContext';
import useResponsive from '../hooks/useResponsive';
import useOffSetTop from '../hooks/useOffSetTop';

import { HEADER, NAVBAR } from '../utils/config';
import cssStyles from '../utils/cssStyles';

import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import ShortcutPopover from './ShortcutPopover';

type Props = {
  onOpenSidebar: () => void;
  isCollapse?: boolean;
  verticalLayout?: boolean;
};

type RootStyleProps = {
  theme?: Theme & { palette: { grey: { [key: string]: string } } };
  isCollapse: boolean;
  isOffset: boolean;
  verticalLayout?: boolean;
};

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})(({
  isCollapse, isOffset, verticalLayout, theme,
}: RootStyleProps) => {
  if (!theme) throw new Error('Theme is required');

  return {
    ...cssStyles(theme).bgBlur(),
    boxShadow: 'none',
    height: HEADER.MOBILE_HEIGHT,
    zIndex: theme.zIndex.appBar + 1,
    transition: theme.transitions.create(['width', 'height'], {
      duration: theme.transitions.duration.shorter,
    }),
    [theme.breakpoints.up('lg')]: {
      height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
      width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
      ...(isCollapse && {
        width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
      }),
      ...(isOffset && {
        height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      }),
      ...(verticalLayout && {
        width: '100%',
        height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
        backgroundColor: theme.palette.background.default,
      }),
    },
  };
});

export default function DashboardHeader({
  onOpenSidebar,
  isCollapse = false,
  verticalLayout = false,
}: Props) {
  const { toggleColorMode, mode } = useContext(DataContext);
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;

  const isDesktop = useResponsive('up', 'lg');

  return (
    <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
      <Toolbar
        sx={{
          minHeight: '100% !important',
          px: { lg: 5 },
          paddingRight: '0 !important',
        }}
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={6}
            md={8}
            display={{ xs: 'flex' }}
            sx={{ padding: 2 }}
          >
            <Breadcrums />
          </Grid>
          <Grid
            item
            xs={6}
            display={{ xs: 'flex'}}
            md={4}
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid background.paper',
              borderRadius: '0 0 0 20px',
              padding: 1
            }}
          >
            {isDesktop && verticalLayout && <Logo sx={{ mr: 2.5 }} />}

            {!isDesktop && (
              <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
                <MenuOpenIcon />
              </IconButton>
            )}

            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" alignItems="normal">
              <IconButton onClick={toggleColorMode}>
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <LanguagePopover />
              <ShortcutPopover />
              <AccountPopover />
            </Stack>
          </Grid>
        </Grid>
      </Toolbar>
    </RootStyle>
  );
}
