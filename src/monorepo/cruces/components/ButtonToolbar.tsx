import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type Pops = {
  action: string;
  icon?: React.ReactNode;
  actionFunction: (action: string) => void;
  variant?: 'text' | 'outlined' | 'contained';
  isTable?: boolean;
};

export function ButtonToolbar({
  action,
  icon = <AddIcon />,
  actionFunction,
  variant = 'contained',
  isTable = false,
}: Pops) {
  return (
    <Button
      variant={variant}
      startIcon={icon}
      color={variant === 'contained' ? 'primary' : 'inherit'}
      onClick={() => actionFunction(action)}
      sx={{
        height: isTable ? 20 : 60,
        width: isTable ? 100 : 200,
        margin: 0,
        fontWeight: isTable ? 400 : 700,
      }}
    >
      {action}
    </Button>
  );
}

export default ButtonToolbar;
