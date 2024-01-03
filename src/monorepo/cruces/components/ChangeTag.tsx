import { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import { DialogComponent, FileTagger } from '@gsuite/shared/ui';
import { SimpleNode, NodeModels } from '@gsuite/typings/files';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';
import { useCrossing } from '@gsuite/shared/contexts';
import { get } from 'lodash';
import { useUpdateCruce } from '../services/cruce-update';

type Props = {
  open: boolean;
  onClose: () => void;
  node: NodeModels;
  loading?: boolean;
};

export default function ChangeTag({
  open, onClose, node, loading = false,
}: Props) {
  const { t } = useTranslation();
  const { setSnackBar } = useContext(NotificationsContext);
  const { crossing, setCrossing } = useCrossing();
  const { updateCrossing } = useUpdateCruce();
  const [filesData, setFilesData] = useState<SimpleNode[]>([{
    id: node.id.toString(),
    name: get(node, 'text', ''),
    tags: get(node, 'data.tags', ''),
    type: get(node, 'data.file.type', ''),
    key: get(node, 'data.file.key', ''),
    firstDigitized: get(node, 'data.firstDigitized', false),
  }]);

  const findAndReplaceNode = (
    nodes: NodeModels[],
    nodeToReplace: NodeModels,
  ): NodeModels[] => nodes.map((item) => {
    if (item.id === nodeToReplace.id) {
      return nodeToReplace;
    }
    return item;
  });

  const findParent = (
    parent: string | number,
    nodes?: NodeModels[],
  ) => !!nodes?.find((item) => item.id === parent);

  const onSubmit = () => {
    const newFile = {
      ...node,
      data: {
        ...node.data,
        tags: filesData[0].tags,
        firstDigitized: filesData[0].firstDigitized,
      },
    };

    if (!crossing?.nodes) return;
    const { externalNode, dispatchFileNode, tree } = crossing.nodes;
    let newCrossing = null;

    if (findParent(newFile.parent, externalNode)) {
      newCrossing = {
        ...crossing,
        nodes: {
          ...crossing.nodes,
          externalNode: findAndReplaceNode(externalNode ?? [], newFile),
        },
      };
      setCrossing(newCrossing);
    }

    if (findParent(newFile.parent, dispatchFileNode)) {
      newCrossing = {
        ...crossing,
        nodes: {
          ...crossing.nodes,
          dispatchFileNode: findAndReplaceNode(dispatchFileNode ?? [], newFile),
        },
      };
      setCrossing(newCrossing);
    }

    if (findParent(newFile.parent, tree)) {
      newCrossing = {
        ...crossing,
        nodes: {
          ...crossing.nodes,
          tree: findAndReplaceNode(tree ?? [], newFile),
        },
      };
      setCrossing(newCrossing);
    }

    if (crossing?.id) {
      updateCrossing({
        variables: {
          crossing: newCrossing,
        },
        context: { clientName: 'globalization' },
        onCompleted: () => setSnackBar('success', t('cruces.onSave.updated')),
      }).catch(() => setSnackBar('success', t('cruces.onSave.error')));
    }
    onClose();
  };

  return (
    <DialogComponent
      open={open}
      title={t('cruces.changeTag')}
      okButtonVisibility={false}
      cancelButtonVisibility={false}
      maxWidth="md"
    >
      <FileTagger
        files={filesData}
        getTaggerFiles={setFilesData}
        defaultTags={get(node, 'data.tags', '')}
        firstDigitized={get(node, 'data.firstDigitized')}
      />
      <DialogActions>
        <Button
          sx={{ borderRadius: 5 }}
          variant="outlined"
          onClick={onClose}
        >
          {t('cancel')}
        </Button>
        <LoadingButton
          onClick={onSubmit}
          loading={loading}
          sx={{ borderRadius: 5 }}
          variant="contained"
          type="submit"
        >
          {t('save')}
        </LoadingButton>
      </DialogActions>
    </DialogComponent>
  );
}
