import { useRef, useState } from 'react';

import {
  Menu,
  Divider,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';

import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  DeleteOutlineRounded as DeleteOutlineRoundedIcon,
} from '@mui/icons-material';

type Action = 'edit' | 'delete' | 'view' | undefined;

type Props = {
  row: any;
  onClick: (type: string, rowId: string) => void;
  disabledActions?: Action[],
};

function MoreMenu({ row, onClick, disabledActions = [] }: Props) {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (type: 'edit' | 'delete' | 'view') => {
    handleClose();

    onClick(type, row.id);
  };

  const options = [];

  if (!disabledActions.includes('view')) {
    options.push(
      <MenuItem key="view">
        <VisibilityIcon width={20} height={20} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          View
        </Typography>
      </MenuItem>,
    );
  }

  if (!disabledActions.includes('edit')) {
    options.push(
      <MenuItem key="edit" onClick={() => handleClick('edit')}>
        <EditIcon width={20} height={20} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Edit
        </Typography>
      </MenuItem>,
    );
  }

  if (!disabledActions.includes('delete')) {
    options.push(
      <Divider key="divider" />,
      <MenuItem key="delete" sx={{ color: 'error.main' }} onClick={() => handleClick('delete')}>
        <DeleteOutlineRoundedIcon width={20} height={20} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Delete
        </Typography>
      </MenuItem>,
    );
  }

  return (
    <>
      <IconButton ref={menuRef} size="large" onClick={handleOpen}>
        <MoreVertIcon width={20} height={20} />
      </IconButton>

      <Menu
        open={open}
        anchorEl={menuRef.current}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {options}
      </Menu>
    </>
  );
}

export default MoreMenu;
