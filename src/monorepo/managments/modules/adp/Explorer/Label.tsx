import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import {
  Box, ListItemAvatar,
} from '@mui/material';

import type { TreeNode } from '../utils/type';
import { getIconBasedOnFileExtension } from '../utils/fileExtensionIcon';

import {
  ListItemAction, ListItemSecondary, ListItemPrimary,
} from './Item';

export default function TreeLabel({ nodes: { name, children, extra } }: { nodes: TreeNode }) {
  return (
    <Box>
      <ListItem
        secondaryAction={<ListItemAction extra={extra} />}
      >
        <ListItemAvatar>
          {getIconBasedOnFileExtension(name)}
        </ListItemAvatar>
        <ListItemText
          primary={<ListItemPrimary name={name}>{children}</ListItemPrimary>}
          secondary={<ListItemSecondary extra={extra} />}
        />
      </ListItem>
    </Box>
  );
}
