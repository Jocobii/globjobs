import { Dispatch, SetStateAction } from 'react';
import {
  Stack, Paper, Drawer,
} from '@mui/material';
import { History } from '@gsuite/shared/contexts';
import { NodeModels } from '@gsuite/typings/files';

import PanelHeader from './PanelHeader';
import PanelBody from './PanelBody';

export interface ContextProps {
  history: History[];
  isCostumer?: boolean;
  isTrafficFlow?: boolean;
  requiredActionsMenuIsOpen?: boolean;
  setRequiredActionsMenuIsOpen?: Dispatch<SetStateAction<boolean>>;
  openHistory?: boolean;
  setOpenHistory?: Dispatch<SetStateAction<boolean>>;
  nodes?: {
    tree?: NodeModels[];
    externalNode?: NodeModels[];
    dispatchFileNode?: NodeModels[];
  },
}

function Panel({
  history,
  isCostumer = false,
  isTrafficFlow = false,
  requiredActionsMenuIsOpen = false,
  setRequiredActionsMenuIsOpen = undefined,
  openHistory = false,
  setOpenHistory = () => 1,
  nodes = {},
}: ContextProps) {
  return (
    <Drawer
      open={openHistory}
      onClose={() => setOpenHistory(false)}
      PaperProps={{ sx: { pb: 5, width: 500 } }}
      anchor="right"
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Paper
        elevation={12}
        sx={{ height: '100vh' }}
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
        <PanelBody history={history} nodes={nodes} />
      </Paper>
    </Drawer>
  );
}

export default Panel;
