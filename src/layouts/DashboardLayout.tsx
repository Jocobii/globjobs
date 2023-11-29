import { useContext, useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import { Box, Theme } from '@mui/material';
import { ErrorBoundary, LoadingScreen } from '../components';
import { DataContext } from '../contexts/AppContext';

import { HEADER, NAVBAR } from '../utils/config';

import DashboardHeader from '../components/DashboardHeader';
import NavbarVertical from '../components/NavbarVertical';

type Props = {
  collapseClick: boolean;
  theme?: Theme;
};

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})(({ collapseClick, theme }: Props) => {
  if (!theme) throw new Error('theme is required');

  return {
    flexGrow: 1,
    paddingTop: HEADER.MOBILE_HEIGHT + 24,
    paddingBottom: HEADER.MOBILE_HEIGHT + 24,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
      paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
      width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
      transition: theme.transitions.create('margin-left', {
        duration: theme.transitions.duration.shorter,
      }),
      ...(collapseClick && {
        marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
      }),
    },
  };
});

export default function DashboardLayout() {
  const { collapseClick, isCollapse } = useContext(DataContext);

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />

      <NavbarVertical
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />

      <MainStyle collapseClick={collapseClick}>
        <ErrorBoundary>
          <Suspense
            fallback={<LoadingScreen />}
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </MainStyle>
    </Box>
  );
}
