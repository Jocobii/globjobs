import {
  Box,
  Typography,
  SxProps,
} from '@mui/material';

import Breadcrumb, { LinkProps } from './Breadcrumb';

type Props = {
  links: LinkProps[];
  action: React.ReactNode;
  heading: string;
  sx?: SxProps;
};

export default function HeaderBreadcrumbs({
  links, action, heading, sx = null,
}: Props) {
  return (
    <Box sx={{ mb: 5, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            {heading}
          </Typography>
          <Breadcrumb links={links} />
        </Box>

        {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
      </Box>
    </Box>
  );
}
