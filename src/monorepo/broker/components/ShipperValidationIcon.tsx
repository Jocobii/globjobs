import { Cached as CachedIcon, Error as ErrorIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  loadingShipper: boolean;
  shipper?: string;
  shipperError: boolean;
}
export default function ShipperValidationIcon({ loadingShipper, shipper = '', shipperError }: Props) {
  const theme = useTheme();
  if (shipper && loadingShipper) {
    return (
      <CachedIcon
        sx={{
          animation: 'spin 2s linear infinite',
          '@keyframes spin': {
            '0%': {
              transform: 'rotate(360deg)',
            },
            '100%': {
              transform: 'rotate(0deg)',
            },
          },
        }}
      />
    );
  }
  return (
    (!loadingShipper && shipper && shipperError) ? (
      <Tooltip title="Please, enter a valid shipper" placement="right">
        <ErrorIcon sx={{ color: theme.palette.error.main }} />
      </Tooltip>
    ) : <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
  );
}
