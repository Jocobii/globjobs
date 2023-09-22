import { NavLink as RouterLink } from 'react-router-dom';
import { Box, Link, ListItemText } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import * as Icons from '@mui/icons-material';

import { ReactComponent as HomeIcon } from '../assets/ic_home.svg';
import { ReactComponent as GopsIcon } from '../assets/ic_gops.svg';
import { ReactComponent as AdpIcon } from '../assets/ic_adp.svg';

import { isExternalLink } from '../utils/func';
import { alpha, styled } from '@mui/material/styles';
import { ListItemButton, ListItemIcon } from '@mui/material';

import { ICON, NAVBAR } from '../utils/config';

type NavItemSubProps = {
  item: {
    children?: React.ReactNode[];
    info: React.ReactNode;
    path: string;
    title: string;
    icon: string;
  };
  active?: boolean;
  open?: boolean;
  onOpen?: () => void;
};

type IconNames = keyof typeof Icons;
type IconProps = {
  iconName: IconNames
};

type NavItemRootProps = {
  isCollapse: boolean;
} & NavItemSubProps;

function IconComponent({ iconName }: IconProps) {
  let Icon = Icons.AbcOutlined;
  const suiteIconName: string = JSON.parse(JSON.stringify(iconName));
  const suiteIcons = [
    {
      name: 'Adp',
      icon: <AdpIcon />,
    },
    {
      name: 'Gops',
      icon: <GopsIcon />,
    },
    {
      name: 'Home',
      icon: <HomeIcon />,
    },
  ];

  if (iconName in Icons) Icon = Icons[iconName];

  if (!(iconName in Icons)) {
    return suiteIcons
      .find((row) => row.name === suiteIconName)?.icon || null;
  }

  return <Icon />;
}

export function ArrowIcon({ open = false }: { open?: boolean }) {
  return open ? <ChevronRightRoundedIcon /> : <ExpandMoreRoundedIcon />;
}

export function NavItemRoot({
  item,
  isCollapse,
  open = false,
  active = false,
  onOpen = () => null,
}: NavItemRootProps) {
  const {
    title, path, icon, info, children,
  } = item;

  const iconName: IconNames = JSON.parse(JSON.stringify(icon));

  const renderContent = (
    <>
      {icon && (
        <ListItemIconStyle>
          <IconComponent iconName={iconName} />
        </ListItemIconStyle>
      )}
      <ListItemTextStyle disableTypography primary={title} isCollapse={isCollapse} />
      {!isCollapse && (
        <>
          {info || null}
          {children && <ArrowIcon open={open} />}
        </>
      )}
    </>
  );

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeRoot={active}>
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener">
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeRoot={active}>
      {renderContent}
    </ListItemStyle>
  );
}

export function DotIcon({ active = false }: { active?: boolean }) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
          transition: (theme) => theme.transitions.create('transform', {
            duration: theme.transitions.duration.shorter,
          }),
          ...(active && {
            transform: 'scale(2)',
            bgcolor: 'primary.main',
          }),
        }}
      />
    </ListItemIconStyle>
  );
}

export function NavItemSub({
  item,
  open = false,
  active = false,
  onOpen = () => null,
}: NavItemSubProps) {
  const {
    title, path, info, children, icon,
  } = item;

  const iconName: IconNames = JSON.parse(JSON.stringify(icon));

  const renderContent = (
    <>
      {icon && (
      <ListItemIconStyle>
        <IconComponent iconName={iconName} />
      </ListItemIconStyle>
      )}
      <ListItemText
        disableTypography
        primary={title}
        sx={{
          ...active && {
            color: 'primary.main',
          },
        }}
      />
      {info || null}
      {children && <ArrowIcon open={open} />}
    </>
  );

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeSub={active} subItem>
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener" subItem>
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeSub={active} subItem>
      {renderContent}
    </ListItemStyle>
  );
}

type ListItemStyleProps = {
  activeRoot?: boolean;
  activeSub?: boolean;
  subItem?: boolean;
  onClick?: () => void;
  component?: React.ElementType;
  href?: string;
  to?: string;
  target?: string;
  rel?: string;
};

type ListItemTextStyleProps = {
  isCollapse: boolean;
};

export const ListItemStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'activeRoot' && prop !== 'activeSub' && prop !== 'subItem',
})<ListItemStyleProps>(({
  activeRoot, activeSub, subItem, theme,
}) => ({
  ...theme.typography.body2,
  position: 'relative',
  height: NAVBAR.DASHBOARD_ITEM_ROOT_HEIGHT,
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  // activeRoot
  ...(activeRoot && {
    ...theme.typography.subtitle2,
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
  }),
  // activeSub
  ...(activeSub && {
    ...theme.typography.subtitle2,
    color: theme.palette.text.primary,
  }),
  // subItem
  ...(subItem && {
    height: NAVBAR.DASHBOARD_ITEM_SUB_HEIGHT,
  }),
}));

export const ListItemTextStyle = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'isCollapse',
})<ListItemTextStyleProps>(({ isCollapse, theme }) => ({
  whiteSpace: 'nowrap',
  transition: theme.transitions.create(['width', 'opacity'], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(isCollapse && {
    width: 0,
    opacity: 0,
  }),
}));

export const ListItemIconStyle = styled(ListItemIcon)({
  width: ICON.NAVBAR_ITEM,
  height: ICON.NAVBAR_ITEM,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '100%', height: '100%' },
});
