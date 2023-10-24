import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Link,
  Typography,
  Breadcrumbs as MUIBreadcrumbs,
} from '@mui/material';

export type LinkProps = {
  name: string;
  href?: null | string;
  icon?: null | string;
};

type Props = {
  activeLast?: boolean;
  links: LinkProps[];
};

function LinkItem({ href = null, name, icon = null }: LinkProps) {
  return (
    <Link
      key={name}
      variant="body2"
      component={RouterLink}
      to={href || '#'}
      sx={{
        lineHeight: 2,
        display: 'flex',
        alignItems: 'center',
        color: 'text.primary',
        '& > div': { display: 'inherit' },
      }}
    >
      {icon && <Box sx={{ mr: 1, '& svg': { width: 20, height: 20 } }}>{icon}</Box>}
      {name}
    </Link>
  );
}

export default function Breadcrumb({ links, activeLast = false }: Props) {
  const currentLink = links[links.length - 1].name;

  const listDefault = links.map((link) => (
    <LinkItem
      key={link.name}
      name={link.name}
      href={link.href}
    />
  ));

  const listActiveLast = links.map((link) => (
    <div key={link.name}>
      {link.name !== currentLink ? (
        <LinkItem
          key={link.name}
          name={link.name}
          href={link.href}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            maxWidth: 260,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: 'text.disabled',
            textOverflow: 'ellipsis',
          }}
        >
          {currentLink}
        </Typography>
      )}
    </div>
  ));

  return (
    <MUIBreadcrumbs
      separator={(
        <Box
          component="span"
          sx={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            bgcolor: 'text.disabled',
          }}
        />
      )}
    >
      {activeLast ? listDefault : listActiveLast}
    </MUIBreadcrumbs>
  );
}
