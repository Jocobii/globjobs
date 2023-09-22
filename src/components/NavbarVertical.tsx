import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Drawer } from '@mui/material';

import Logo from './Logo';
import { DataContext } from '../contexts/AppContext';
import useResponsive from '../hooks/useResponsive';
import Scrollbar from './Scrollbar';

import { NAVBAR } from '../utils/config';

import cssStyles from '../utils/cssStyles';
import NavSectionVertical from './NavSectionVertical';

import CollapseButton from './CollapseButton';

type Props = {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
};

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar}: Props) {

  const theme = useTheme();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const {
    isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave,
  } = useContext(DataContext);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' }),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Logo />

          {isDesktop && !isCollapse && (
            <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
          )}
        </Stack>
      </Stack>

      <NavSectionVertical
        navConfig={[]}
        isCollapse={isCollapse}
      />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.paper',
              transition: (t) => t.transitions.create('width', {
                duration: t.transitions.duration.standard,
              }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                boxShadow: (t: any) => t.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
