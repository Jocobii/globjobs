import { Stack, Link, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useLocation } from 'react-router-dom';
import { useCustomNavigate } from '../hooks';

function RouteBreadCrums() {
  const { pathname } = useLocation();
  const allRoutes = pathname.split('/').filter((x) => x !== '');
  const { goTo } = useCustomNavigate();

  return (
    <Stack direction="row" alignItems="normal">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Suite
        </Link>
        {allRoutes.map((route, index) => {
          if (index === allRoutes.length - 1) {
            return (
              <Typography key={route} color="text.primary">
                {route}
              </Typography>
            );
          }
          return (
            <Button
              key={route}
              href={`/${route}`}
              color="inherit"
              type="button"
              onClick={() => goTo(`/${route}`)}
            >
              {route}
            </Button>
          );
        })}
      </Breadcrumbs>
    </Stack>
  );
}

export default RouteBreadCrums;
