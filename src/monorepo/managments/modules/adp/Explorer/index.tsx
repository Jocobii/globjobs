import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';

import List from '@mui/material/List';
import FolderIcon from '@mui/icons-material/Folder';

import {
  Box,
} from '@mui/material';

import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import type { Pediment, TreeNode } from '../utils/type';

import { transformData } from '../utils';

import TreeLabel from './Label';

export default function RichObjectTreeView({ data } : { data: Pediment[] }) {
  const transformedData = transformData(data);

  const renderTree = (nodes: TreeNode) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={<TreeLabel nodes={nodes} />}
      endIcon={nodes.children ? <FolderOpenIcon /> : null}
      expandIcon={nodes.children ? <FolderIcon /> : null}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <Box>
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<FolderOpenIcon />}
        defaultExpanded={['root']}
        defaultExpandIcon={<FolderIcon />}
        style={{ width: '100%', minWidth: '100%', maxHeight: '600px' }}

      >
        <List>
          {renderTree(transformedData)}
        </List>
      </TreeView>
    </Box>
  );
}
