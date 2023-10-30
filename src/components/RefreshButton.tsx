import { IconButton } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';

interface Props {
  disabled?: boolean;
  handleRefresh: () => void;
}

export function RefreshButton({ handleRefresh, disabled = false }: Props) {
  return (
    <IconButton key="more-id" size="large" onClick={handleRefresh} disabled={disabled}>
      <CachedIcon width={20} height={20} />
    </IconButton>
  )
}

