import { Stack, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useCustomNavigate } from '@/hooks';
import { useLocation } from 'react-router-dom';

const RouteBreadCrums = () => {
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
						console.log('route', route);
						return (
							<Typography key={route} color="text.primary">
								{route}
							</Typography>
						);
					}
					return (
						<Link
							key="route"
							component="button"
							underline="hover"
							color="inherit"
							onClick={() => { console.log(`/${route}`); goTo(`/${route}`)}}
						>
							{route}
						</Link>
					);
				})}
			</Breadcrumbs>
		</Stack>
	);
};

export default RouteBreadCrums;
