import { Cached as CachedIcon, Error as ErrorIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  loadingEntryType: boolean;
  entryType: string;
  hasError: boolean;
}

export default function InboundValidationIcon({
  loadingEntryType, entryType, hasError,
}: Readonly<Props>) {
  const theme = useTheme();
  if (entryType && loadingEntryType) {
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
    (!loadingEntryType && entryType && hasError) ? (
      <Tooltip title="Please, enter a valid invoice" placement="right">
        <ErrorIcon sx={{ color: theme.palette.error.main }} />
      </Tooltip>
    ) : <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
  );
}
