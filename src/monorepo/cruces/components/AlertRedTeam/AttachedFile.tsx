import React from 'react';
import {
  Card,
  List,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material';
import {
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import TypeIcon from '../TypeIcon';
import { DataAlert } from '../../types';

export default function AttachedFile({ fileAttached }: DataAlert) {
  return (
    <Paper sx={{ width: '100%', p: 3 }} style={{ maxHeight: 200, overflow: 'auto' }}>
      <List sx={{ width: '100%' }}>
        {
          fileAttached?.map(({
            id, ext, url, name,
          }) => (
            <Card
              sx={{
                width: '100%',
                height: 80,
                borderRadius: 1,
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                marginBottom: 2,
                justifyContent: 'center',
              }}
              key={id}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  padding: 2,
                }}
                justifyContent="flex-start"
                alignItems="center"
              >
                <DragIndicatorIcon sx={{ width: 30, height: 30 }} />
                <TypeIcon icon={ext} url={url} />
                <Stack direction="column">
                  <Stack direction="row" spacing={1}>
                    <ListItemText secondary={name} />
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          ))
        }
      </List>
    </Paper>
  );
}
