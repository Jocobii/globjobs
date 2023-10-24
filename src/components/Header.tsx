import { lazy, useState } from 'react';

import {
  Box, Grid, Stack, Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
  FlightLand as FlightLandIcon,
  VerifiedUser as VerifiedUserIcon,
  DonutSmall as DonutSmallIcon,
  CircleNotifications as CircleNotificationsIcon,
  DocumentScanner as DocumentScannerIcon,
  LocalShipping as LocalShippingIcon,
  Warehouse as WarehouseIcon,
  FlagCircle as FlagCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useDashboardAbstract } from '../services/operation-dashboard';

const Abstract = lazy(() => import('./Abstract'));
const Detail = lazy(() => import('./Detail'));

export default function Header() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [statusActual, setStatusActual] = useState<string>();
  const navigate = useNavigate();

  const { data } = useDashboardAbstract();
  const filterByStatus = (status: string) => {
    if (status !== statusActual) {
      setStatusActual(status);
      navigate(`/g/ops/status/${status}`);
    }
    return status;
  };

  const {
    requestedOperations,
    operationProcess,
    operationFinished,
    arrivalUsa,
    usImport,
    collectionByTransport,
    usWarehouseReceipt,
    mxImport,
    borderCrossingUsaMex,
    arrivalMxWarehouse,
  } = data?.dashboardData ?? {};

  const cards = [
    {
      quantity: requestedOperations ?? 0,
      name: t('broker.requestedOperations'),
      color: theme.palette.primary.main,
      icon: <FlightLandIcon fontSize="large" sx={{ color: '#fff' }} />,
      onClick: () => filterByStatus('operation'),
    },
    {
      quantity: operationProcess ?? 0,
      name: t('broker.inProcessOperations'),
      color: theme.palette.warning.main,
      icon: <DonutSmallIcon fontSize="large" sx={{ color: '#fff' }} />,
      onClick: () => filterByStatus('inProcess'),
    },
    {
      quantity: operationFinished ?? 0,
      name: t('broker.finishedOperations'),
      color: theme.palette.success.main,
      icon: <VerifiedUserIcon fontSize="large" sx={{ color: '#fff' }} />,
      onClick: () => filterByStatus('finished'),
    },
  ];

  const cards2 = [
    {
      quantity: requestedOperations ?? 0,
      name: t('broker.notifications'),
      color: theme.palette.primary.main,
      icon: <CircleNotificationsIcon fontSize="medium" color="primary" sx={{ position: 'relative', top: '-1px' }} />,
      onClick: () => filterByStatus('operation'),
    },
    {
      quantity: arrivalUsa ?? 0,
      name: t('broker.usaArrivals'),
      color: theme.palette.warning.main,
      icon: <FlightLandIcon fontSize="medium" color="warning" sx={{ position: 'relative', top: '-1px' }} />,
      onClick: () => filterByStatus('usArrival'),
    },
    {
      quantity: usImport ?? 0,
      name: t('broker.importUsa'),
      color: theme.palette.warning.main,
      icon: <DocumentScannerIcon fontSize="medium" color="warning" sx={{ position: 'relative', top: '-1px' }} />,
      onClick: () => filterByStatus('inbondUsa'),
    },
    {
      quantity: collectionByTransport ?? 0,
      name: t('broker.pickUpTransport'),
      color: theme.palette.warning.main,
      icon: <LocalShippingIcon fontSize="medium" color="warning" sx={{ position: 'relative', top: '-1px' }} />,
      onClick: () => filterByStatus('pickUpTransport'),
    },
    {
      quantity: usWarehouseReceipt ?? 0,
      name: t('broker.receiveUsaWarehouse'),
      color: theme.palette.warning.main,
      icon: <WarehouseIcon fontSize="medium" color="warning" sx={{ position: 'relative', top: '-1px' }} />,
      onClick: () => filterByStatus('receiveUsaWarehouse'),
    },
    {
      quantity: mxImport ?? 0,
      name: t('broker.importMx'),
      color: theme.palette.warning.main,
      icon: <DocumentScannerIcon fontSize="medium" color="warning" sx={{ position: 'relative', top: '-1px' }} />,
      status: '62fd5dcca6f01e42628b2c37',
      onClick: () => filterByStatus('importMx'),
    },
    {
      quantity: borderCrossingUsaMex ?? 0,
      name: t('broker.borderCrossingUsaMx'),
      color: theme.palette.warning.main,
      icon: <FlagCircleIcon fontSize="medium" color="warning" sx={{ position: 'relative', top: '-1px' }} />,
      status: '62fd5e25a6f01e42628b2c39',
      onClick: () => filterByStatus('borderCrossingUsaMx'),
    },
    {
      quantity: arrivalMxWarehouse ?? 0,
      name: t('broker.warehouseArrivalMx'),
      color: theme.palette.warning.main,
      icon: <WarehouseIcon fontSize="medium" color="warning" sx={{ position: 'relative', top: '-1px' }} />,
      status: '62fd5e46a6f01e42628b2c3b',
      onClick: () => filterByStatus('warehouseArrivalMx'),
    },
    {
      quantity: operationFinished ?? 0,
      name: t('broker.finished'),
      color: theme.palette.success.main,
      icon: <VerifiedUserIcon fontSize="medium" color="success" sx={{ position: 'relative', top: '-1px' }} />,
      status: '62fd5e6ca6f01e42628b2c3d',
      onClick: () => filterByStatus('finished'),
    },
  ];
  return (
    <Grid container sx={{ display: 'block !important' }}>
      <Stack direction="column">
        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
          {t('broker.summary')}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              sx: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
          }}
        >
          {cards.map(({
            quantity, name, color, icon, onClick,
          }) => (
            <Abstract
              key={name}
              quantity={quantity}
              name={name}
              color={color}
              icon={icon}
              onClick={onClick}
            />
          ))}
        </Box>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          {t('broker.detail')}
        </Typography>

        <Box
          sx={{
            p: 1,
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
          }}
        >
          {cards2.map(({
            quantity, name, color, icon, onClick,
          }) => (
            <Detail
              key={name}
              quantity={quantity}
              name={name}
              color={color}
              icon={icon}
              onClick={onClick}
            />
          ))}
        </Box>
      </Stack>
    </Grid>
  );
}
