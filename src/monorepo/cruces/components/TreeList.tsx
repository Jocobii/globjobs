import { Grid } from '@mui/material';
import { NodeModels } from '@gsuite/typings/files';
import {
  getBackendOptions,
  DropOptions,
  MultiBackend,
  Tree,
} from '@minoru/react-dnd-treeview';
import { NativeTypes } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useCrossing } from '@gsuite/shared/contexts';
import { ListDocuments } from './ListDocuments';

type Props = {
  crossingId?: string;
  externalNode: NodeModels[];
  tree: NodeModels[];
  dispatchFileNode?: NodeModels[];
  handleDropTree?: (newTree: NodeModels[], options: DropOptions) => void;
  refetch?: () => void;
};

const castRootNode = (nodes: NodeModels[]) => nodes.map((node) => ({
  ...node,
  parent: [0, '0'].includes(node.parent) ? Number(node.parent) : String(node.parent),
}));

const handleDrag = (node: any) => {
  let canDrag = true;
  if (node?.data?.ext === 'txt') {
    canDrag = false;
  }
  if (node?.droppable) {
    canDrag = false;
  }
  return canDrag;
};

const handleSort = (a: any, b: any) => {
  if (a.data && b.data) {
    if (a.data.ext === 'txt' && b.data.ext !== 'txt') {
      return -1;
    }
    if (a.data.ext !== 'txt' && b.data.ext === 'txt') {
      return 1;
    }
  }
  return 0;
};

function TreeList({
  crossingId = '',
  externalNode,
  tree,
  dispatchFileNode = [],
  handleDropTree = () => {},
  refetch = () => {},
}: Props) {
  const { crossing } = useCrossing();
  const treeNodes = castRootNode(tree);
  const externalNodes = castRootNode(externalNode);
  const dispatchFileNodes = castRootNode(dispatchFileNode);
  const mediaQueriesSize = dispatchFileNode.length > 0 ? {
    lg: 4,
    md: 4,
    sm: 4,
    xs: 4,
  }
    : {
      lg: 6,
      md: 6,
      sm: 6,
      xs: 6,
    };

  return (
    <Grid container spacing={2}>
      <Grid
        item
        lg={mediaQueriesSize.lg}
        md={mediaQueriesSize.md}
        sm={mediaQueriesSize.sm}
        xs={mediaQueriesSize.xs}
        sx={{ maxHeight: '68vh', overflow: 'auto' }}
      >
        <DndProvider
          backend={MultiBackend}
          options={getBackendOptions()}
          debugMode
        >
          <Tree
            rootId={0}
            tree={externalNodes}
            extraAcceptTypes={[NativeTypes.TEXT]}
            classes={{
              container: '',
              listItem: '',
            }}
            enableAnimateExpand
            render={
              (node, options) => (
                <ListDocuments
                  crossingId={crossingId}
                  node={node}
                  isOpen={options.isOpen}
                  onToggle={options.onToggle}
                  depth={options.depth}
                  refetch={refetch}
                />
              )
            }
            sort={handleSort}
            onDrop={handleDropTree}
            canDrag={handleDrag}
            listComponent="div"
            listItemComponent="div"
          />
        </DndProvider>
      </Grid>
      {
        crossing?.isWithoutTxtFlow ? null : (
          <Grid
            item
            lg={mediaQueriesSize.lg}
            md={mediaQueriesSize.md}
            sm={mediaQueriesSize.sm}
            xs={mediaQueriesSize.xs}
            sx={{ maxHeight: '68vh', overflow: 'auto' }}
          >
            <DndProvider
              backend={MultiBackend}
              options={getBackendOptions()}
              debugMode
            >
              <Tree
                rootId={0}
                tree={treeNodes}
                extraAcceptTypes={[NativeTypes.TEXT]}
                classes={{
                  container: '',
                  listItem: '',
                }}
                enableAnimateExpand
                render={
              (node, options) => (
                <ListDocuments
                  crossingId={crossingId}
                  node={node}
                  isOpen={options.isOpen}
                  onToggle={options.onToggle}
                  depth={options.depth}
                  refetch={refetch}
                />
              )
            }
                sort={handleSort}
                onDrop={handleDropTree}
                canDrag={handleDrag}
                listComponent="div"
                listItemComponent="div"
              />
            </DndProvider>
          </Grid>
        )
      }
      {
        dispatchFileNode.length > 0 ? (
          <Grid
            item
            lg={mediaQueriesSize.lg}
            md={mediaQueriesSize.md}
            sm={mediaQueriesSize.sm}
            xs={mediaQueriesSize.xs}
            sx={{ maxHeight: '68vh', overflow: 'auto' }}
          >
            <DndProvider
              backend={MultiBackend}
              options={getBackendOptions()}
              debugMode
            >
              <Tree
                rootId={0}
                tree={dispatchFileNodes}
                extraAcceptTypes={[NativeTypes.TEXT]}
                classes={{
                  container: '',
                  listItem: '',
                }}
                enableAnimateExpand
                render={
              (node, options) => (
                <ListDocuments
                  crossingId={crossingId}
                  node={node}
                  isOpen={options.isOpen}
                  onToggle={options.onToggle}
                  depth={options.depth}
                  refetch={refetch}
                />
              )
            }
                sort={handleSort}
                onDrop={handleDropTree}
                canDrag={handleDrag}
                listComponent="div"
                listItemComponent="div"
              />
            </DndProvider>
          </Grid>
        ) : null
      }
    </Grid>
  );
}

export default TreeList;
