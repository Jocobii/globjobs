import { useContext } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';
import { styled } from '@mui/material/styles';

import { NotificationsContext } from '../contexts/NotificationsContext';

const StyledContainer = styled('div')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(8),
  zIndex: theme.zIndex.snackbar,
  position: 'absolute',
  marginLeft: 'auto',
  marginRight: 'auto',
  right: 0,
  length: 0,
}));

export default function Alert() {
  const {
    snackBarOpen, snackBarType, snackBarMessage, duration, removeSnackBar,
  } = useContext(NotificationsContext);

  return (
    <StyledContainer>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={duration || 6000}
        onClose={removeSnackBar}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={removeSnackBar} severity={snackBarType}>
          {snackBarMessage}
        </MuiAlert>
      </Snackbar>
    </StyledContainer>
  );
}
