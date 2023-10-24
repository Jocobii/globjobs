import { useState, forwardRef } from 'react';
import { useSnackbar, SnackbarContent, CustomContentProps } from 'notistack';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandLess from '@mui/icons-material/ExpandLess';

interface ReportCompleteProps extends CustomContentProps {
  customTexts: string[];
  title: string;
}

const fontSize14 = { fontSize: '14px' };
const colorWhite = { color: '#ffff' };

const SnackList = forwardRef<HTMLDivElement, ReportCompleteProps>(
  ({ id, customTexts, title }, ref) => {
    const { closeSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const handleClick = () => {
      setOpen(!open);
    };

    const handleClose = () => closeSnackbar(id);

    return (
      <SnackbarContent ref={ref}>
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: '#d32f2f',
            borderRadius: '4px',
          }}
          component="nav"
        >
          <ListItemButton onClick={handleClick}>
            <ListItemIcon onClick={handleClose} sx={{ ...colorWhite }}>
              <CancelIcon />
            </ListItemIcon>
            <ListItemText
              sx={{ ...colorWhite }}
              primary={title}
              primaryTypographyProps={fontSize14}
            />
            {open ? <ExpandLess sx={{ ...colorWhite }} /> : <ExpandMore sx={{ ...colorWhite }} />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {
              customTexts?.map((text, index) => (
                <List key={`${text}`} component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText
                      sx={{ ...colorWhite }}
                      primary={`${index + 1} - ${text}`}
                      primaryTypographyProps={fontSize14}
                    />
                  </ListItemButton>
                </List>
              ))
            }
          </Collapse>
        </List>
      </SnackbarContent>
    );
  },
);

SnackList.displayName = 'SnackList';

export default SnackList;
