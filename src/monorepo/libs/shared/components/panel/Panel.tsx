import { Dispatch, SetStateAction } from 'react';
import {
  Grid, Stack, Paper,
} from '@mui/material';
import { History } from '@gsuite/shared/contexts';
import PanelHeader from './PanelHeader';
import PanelBody from './PanelBody';

export interface ContextProps {
  history: History[];
  isCostumer?: boolean;
  isTrafficFlow?: boolean;
  requiredActionsMenuIsOpen?: boolean
  setRequiredActionsMenuIsOpen?: Dispatch<SetStateAction<boolean>>;
}

function Panel({
  history,
  isCostumer = false,
  isTrafficFlow = false,
  requiredActionsMenuIsOpen = false,
  setRequiredActionsMenuIsOpen = undefined,
}: ContextProps) {
  return (
    <Grid item lg={3} md={3} sm={3} xs={3}>
      <Paper
        elevation={12}
        sx={{ height: '70vh', borderRadius: 2 }}
        style={{ backgroundColor: '#00000009' }}
      >
        <Stack
          sx={{
            background: 'white',
            borderRadius: 2,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            padding: '3%',
          }}
          style={{ backgroundColor: '#00000009' }}
          direction="column"
        >
          <PanelHeader
            isCostumer={isCostumer}
            isTrafficFlow={isTrafficFlow}
            requiredActionsMenuIsOpen={requiredActionsMenuIsOpen}
            setRequiredActionsMenuIsOpen={setRequiredActionsMenuIsOpen}
          />
        </Stack>
        <PanelBody history={history} />
      </Paper>
    </Grid>
  );
}

export default Panel;
