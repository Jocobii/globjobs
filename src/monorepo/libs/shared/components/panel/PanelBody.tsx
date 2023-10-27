import { History } from '@gsuite/shared/contexts';
import { Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import dayjs from 'dayjs';
import { CommentInput } from './CommentInput';

export interface ContextProps {
  history: History[];
}

export default function PanelBody({ history }: ContextProps) {
  const { t } = useTranslation();
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
                        color: '#528DE1',
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
                  <Typography
                    alignContent="center"
                    sx={{
                      fontSize: '12px',
                      color:
                        i.action === 'deleted_file' ? '#FF0000' : '#528DE1',
                    }}
                  >
                    {i.files?.map((file: string) => (
                      <p key={file}>{file}</p>
                    ))}
                  </Typography>
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
                            color: '#528DE1',
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
