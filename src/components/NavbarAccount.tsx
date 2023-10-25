import { styled } from '@mui/material/styles';
import {
  Theme, Box, Link, Typography, Avatar,
} from '@mui/material';

import useAuth from '../hooks/useAuth';

type Props = {
  isCollapse?: boolean;
};

type RootStyleProps = {
  theme?: Theme & { palette: { grey: { [key: string]: string } } };
};

const RootStyle = styled('div')(({ theme }: RootStyleProps) => {
  if (!theme) throw new Error('Theme is required');

  return {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: theme.palette.grey[500_12],
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  };
});

export default function NavbarAccount({ isCollapse = false }: Props) {
  const { user } = useAuth();

  const fullName = user ? user.fullName : 'loading...';

  return (
    <Link underline="none" color="inherit" href="/">
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        <Avatar src="" alt={fullName} />
        <Box
          sx={{
            ml: 2,
            transition: (theme) => theme.transitions.create('width', {
              duration: theme.transitions.duration.shorter,
            }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {fullName}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            G-Global
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}
