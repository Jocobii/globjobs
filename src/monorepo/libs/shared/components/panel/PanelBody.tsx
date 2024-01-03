import { useState, useEffect } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Avatar,
  List,
  Link,
  useTheme,
} from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import uniq from 'lodash/uniq';
import get from 'lodash/get';

import { History } from '@gsuite/shared/contexts';
import { NodeModels } from '@gsuite/typings/files';

import { CommentInput } from './CommentInput';
import useCruce from '../../hooks/useCruce';

export interface ContextProps {
  history: History[];
  nodes?: {
    tree?: NodeModels[];
    externalNode?: NodeModels[];
    dispatchFileNode?: NodeModels[];
  },
}

export default function PanelBody({ history, nodes = {} }: ContextProps) {
  const [filesWithUrl, setFilesWithUrl] = useState<Record<string, string>>({});
  const { t } = useTranslation();
  const { flatTreeNodes } = useCruce();
  const { palette } = useTheme();

  useEffect(() => {
    if ((history && history?.length > 0) && (nodes && Object.keys(nodes)?.length > 0)) {
      const flattenedNodes = flatTreeNodes(nodes);

      if (flattenedNodes?.length > 1) {
        const allHistoryFiles = history
          .filter((h) => h?.files?.length > 0)
          .map((h) => h?.files)
          .flat(1) || [];
        const uniqHistoryFiles = uniq(allHistoryFiles);

        uniqHistoryFiles.forEach((f) => {
          const targetNode = flattenedNodes.find((n) => {
            const fileKey = get(n, 'data.file.key', '');
            const fileName = get(n, 'data.file.name', '');
            return (fileKey === f || fileName === f);
          });

          if (targetNode && Object.keys(targetNode).length > 0) {
            setFilesWithUrl((prev) => ({
              ...prev,
              [f]: get(targetNode, 'data.file.url', ''),
            }));
          }
        });
      }
    }
  }, [history, nodes]);

  const fileUrlsSort = (a: string, b: string) => {
    if (filesWithUrl && Object.keys(filesWithUrl).length > 0) {
      const urlA = filesWithUrl[a];
      const urlB = filesWithUrl[b];

      if ((urlA && urlB) || (!urlA && !urlB)) return 0;
      if (urlA) return -1;
      if (urlB) return 1;
    }
    return 0;
  };

  const historyFiles = (action: string, files: string[]) => {
    const sortedFileNames = [...files].sort(fileUrlsSort);
    return sortedFileNames.map((file: string) => {
      const fileUrl = filesWithUrl[file];
      const color = action === 'deleted_file' ? '#FF0000' : palette.primary.light;
      if (fileUrl) {
        return (
          <Link
            href={fileUrl}
            underline="hover"
            target="_blank"
            color={color}
            key={file}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <AttachmentIcon sx={{ fontSize: '18px' }} />
              <Typography variant="caption">{file}</Typography>
            </Stack>
          </Link>
        );
      }

      return (
        <Typography
          alignContent="center"
          sx={{
            fontSize: '12px',
            color,
          }}
        >
          <p key={file}>{file}</p>
        </Typography>
      );
    });
  };

  return (
    <Grid
      container
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      sx={{
        padding: '10px',
        margin: '5px',
        color: 'black',
        fontSize: '11px',
        height: '100%',
      }}
    >
      <Grid container item xs={12}>
        <Grid container rowSpacing={2}>
          <List
            sx={{
              width: '100%',
              maxWidth: '100%',
              position: 'relative',
              overflow: 'auto',
              maxHeight: '45vh',
              '& ul': { padding: 0 },
            }}
            subheader={<li />}
          >
            {history?.map((i: History, index: number) => (
              <Grid
                key={`history-item-${String(index)}`}
                container
                spacing={1}
                rowSpacing={2}
                ml={1}
              >
                <Grid item xs={12} md={12} lg={12}>
                  <Typography
                    alignContent="center"
                    sx={{ fontSize: '11px', color: '#858585' }}
                  >
                    {dayjs(i.operationDate).format('MMMM D, YYYY h:mm A')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Stack spacing={2} direction="row" alignContent="center">
                    <Avatar sx={{ width: 36, height: 36 }}>
                      {i.user.name.substring(0, 1)}
                    </Avatar>
                    <Typography
                      alignContent="center"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '12px',
                        color: palette.primary.light,
                      }}
                    >
                      {`${i.user.name} ${i.user.lastName || ''}`}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={1} md={1} lg={1} />
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    alignContent="center"
                    sx={{ fontSize: '12px', color: '#858585' }}
                  >
                    {t(`cruces.history.${i.action}`)}
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1} />
                <Grid item xs={11} md={11} lg={11}>
                  {historyFiles(i.action, i.files)}
                </Grid>
                <Grid item xs={1} md={1} lg={1} />
                {
                  i.comments && (
                    <>
                      <Grid item xs={11} md={11} lg={11}>
                        <Typography
                          alignContent="center"
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '12px',
                            color: palette.primary.light,
                          }}
                        >
                          {t('cruces.history.aditionalComments')}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} md={1} lg={1} />
                      <Grid item xs={11} md={11} lg={11}>
                        <Typography
                          alignContent="center"
                          sx={{ fontSize: '12px', color: '#858585' }}
                        >
                          {i.comments}
                        </Typography>
                      </Grid>
                    </>
                  )
                }
                <Grid item xs={12} md={12} lg={12}>
                  &nbsp;
                </Grid>
              </Grid>
            ))}
          </List>
          <CommentInput />
        </Grid>
      </Grid>
    </Grid>
  );
}
