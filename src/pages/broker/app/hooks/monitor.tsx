import {
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Warehouse as WarehouseIcon,
  LocalShipping as LocalShippingIcon,
  Traffic as TrafficIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material/styles';

export const useMonitors = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const cards = [
    {
      quantity: 0,
      name: t('broker.cardsMonitor.dailyEstimation'),
      color: theme.palette.primary.main,
      icon: (<WarehouseIcon fontSize="large" color="primary" />),
    },
    {
      quantity: 0,
      name: t('broker.cardsMonitor.assignedTransits'),
      color: theme.palette.primary.main,
      icon: <LocalShippingIcon fontSize="large" color="primary" />,
    },
    {
      quantity: 0,
      name: t('broker.cardsMonitor.documentation'),
      color: theme.palette.primary.main,
      icon: <DescriptionIcon fontSize="large" color="primary" />,
    },
    {
      quantity: 0,
      name: t('broker.cardsMonitor.borderHeals'),
      color: theme.palette.primary.main,
      icon: <TrafficIcon fontSize="large" color="primary" />,
    },
    {
      quantity: 0,
      name: t('broker.cardsMonitor.sdWarehousr'),
      color: theme.palette.primary.main,
      icon: <WarehouseIcon fontSize="large" color="primary" />,
    },
    {
      quantity: 0,
      name: t('broker.cardsMonitor.finished'),
      color: theme.palette.primary.main,
      icon: <CheckCircleIcon fontSize="large" color="primary" />,
    },
  ];
  return {
    cards,
  };
};

export default useMonitors;
