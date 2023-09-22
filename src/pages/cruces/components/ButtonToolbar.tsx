import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type Pops = {
  action: string;
  icon?: React.ReactNode;
  actionFunction: (action: string) => void;
  variant?: 'text' | 'outlined' | 'contained';
};

export function ButtonToolbar({
  action,
  icon = <AddIcon />,
  actionFunction,
  variant = 'contained',
}: Pops) {
  return (
    <Button
      variant={variant}
      color="primary"
      startIcon={icon}
      onClick={() => actionFunction(action)}
      sx={{ height: 60, width: 200, margin: 0 }}
    >
      {action}
    </Button>
  );
}

export default ButtonToolbar;
