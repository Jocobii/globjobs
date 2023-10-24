import {
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Collapse,
  Button,
  Card,
  List,
  Grid,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import LabelIcon from '@mui/icons-material/Label';
import CloseIcon from '@mui/icons-material/Close';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useState } from 'react';
import { NodeModels } from '@gsuite/typings/files';
import TypeIcon from './TypeIcon';
import { urlIntegration, openNewTab } from '../utils/func';

type Props = {
  nodes: NodeModels[];
  titleDefault?: string;
  handleDelete?: (id: string | number) => void;
  handleDigitalizeExternalNode?: (nodeId: string | number) => void;
};

const tagColors = {
  errors: '#FF0000',
  warnings: '#FFA500',
  informations: '#007FFF',
  validate: '#65E340',
};

const getColor = (isValid: boolean): string => (isValid ? '#65E340' : '#FF0800');

export default function ListDocuments2({
  nodes,
  titleDefault = undefined,
  handleDelete = undefined,
  handleDigitalizeExternalNode = () => {},
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const handleDragStart = (e: React.DragEvent, node: NodeModels) => e.dataTransfer.setData('text', JSON.stringify(node.id));

  const openIntegration = (tag?: string, integrationNumber?: string) => {
    if (tag === 'DODA / PITA' && integrationNumber) {
      openNewTab(urlIntegration(integrationNumber));
    }
  };

  return (
    <List draggable>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemIcon>
          <FolderIcon color="primary" fontSize="large" />
        </ListItemIcon>
        <ListItemText primary={titleDefault} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List>
          {nodes.map((node: NodeModels) => {
            const color = node.id === 'dispatchFileNode' ? tagColors.errors : tagColors.informations;
            const canDigitalize = node.data?.ext === 'pdf';
            const isDigitized = node.data?.digitized ? true : node?.data?.firstDigitized;

            return (
              <Card
                onDragStart={(e) => handleDragStart(e, node)}
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                  marginBottom: 2,
                  justifyContent: 'center',
                }}
                key={node.id}
                draggable
              >
                <Grid
                  container
                  direction="row"
                  spacing={1}
                  sx={{
                    padding: 2,
                  }}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item xs={1}>
                    <DragIndicatorIcon sx={{ width: 30, height: 30 }} />
                  </Grid>
                  <Grid item xs={2}>
                    <TypeIcon icon={node.data?.ext} url={node.data?.file?.url} />
                  </Grid>
                  <Grid container item xs={12} md={9} spacing={1}>
                    <Grid item xs={12}>
                      <ListItemText secondary={node.data?.name} />
                    </Grid>
                    <Grid container item xs={12} md={12} direction="row">
                      <Grid item xs={12} md={11}>
                        {node.data?.tags && (
                          <Button
                            startIcon={<LabelIcon />}
                            variant="outlined"
                            size="small"
                            sx={{
                              p: 0.2,
                              fontSize: 6,
                              color,
                              borderColor: color,
                              ...!node.data.integrationNumber && {
                                pointerEvents: 'none',
                              },
                            }}
                            onClick={
                              () => openIntegration(node.data?.tags, node.data?.integrationNumber)
                            }
                          >
                            {node.data.tags}
                          </Button>
                        )}
                        {canDigitalize ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleDigitalizeExternalNode(node.id)}
                            sx={{
                              color: getColor(!!isDigitized),
                              borderColor: getColor(!!isDigitized),
                              pr: 0.3,
                              pl: 0.3,
                              fontSize: 8,
                            }}
                          >
                            {isDigitized ? 'Digitalizado' : ' Sin digitalizar'}
                          </Button>
                        ) : null}
                      </Grid>
                      <Grid item xs={12} md={1}>
                        {handleDelete && (
                          <Button
                            startIcon={<CloseIcon />}
                            size="small"
                            sx={{
                              p: 0.2,
                              fontSize: 6,
                            }}
                            onClick={() => handleDelete(node.id)}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
}
