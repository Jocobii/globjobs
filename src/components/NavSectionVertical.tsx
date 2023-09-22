import { styled } from '@mui/material/styles';
import {
  SxProps, List, Box, ListSubheader,
} from '@mui/material';

import { NavListRoot } from './NavList';

type NavSectionVerticalProps = {
  isCollapse: boolean;
  navConfig: any[];
};

type ListRowProps = {
  children?: React.ReactNode[];
  info: React.ReactNode;
  path: string;
  title: string;
  icon: string;
};

export const ListSubheaderStyle = styled(
  ({ sx = {} }: { sx: SxProps }) => <ListSubheader disableSticky disableGutters sx={sx} />,
)<{
  sx: SxProps;
  children: React.ReactNode;
}>(({ theme }) => ({
  ...theme.typography.overline,
  paddingTop: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
  overflow: 'hidden',
}));

export default function NavSectionVertical({
  navConfig, isCollapse = false,
}: NavSectionVerticalProps) {
  return (
    <Box>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          <ListSubheaderStyle
            sx={{
              ...(isCollapse && {
                opacity: 0,
              }),
            }}
          >
            {group.subheader}
          </ListSubheaderStyle>

          {group.items.map((list: ListRowProps) => (
            <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
          ))}
        </List>
      ))}
    </Box>
  );
}
