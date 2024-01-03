/* eslint-disable react/jsx-props-no-spreading */
import {
  lazy, useState, useEffect, Suspense,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Box, Container, Grid, Button,
} from '@mui/material';
import LoadingBackdrop from '@gsuite/shared/ui/CircularLoader';
import { useTheme, styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

import { NotificationsProvider } from '@gsuite/shared/contexts/NotificationsContext';
import ReactQuery from '@gsuite/shared/providers/ReactQuery';
import { PageContent, Board, DialogComponent } from '@gsuite/shared/ui';
import { DataProvider } from '@gsuite/shared/contexts/AppContext';
import { getUserSession } from '@gsuite/shared/contexts/AuthContext';
import { useOperation } from '../../services/operation-detail';
import ExtraCharge from '../../components/forms/ExtraCharge';
import ReferencesTabsComponent from '../../components/Tabs';

const OperationStep = lazy(() => import('../../components/OperationStep'));
const History = lazy(() => import('../../components/history'));
const HeaderDetail = lazy(() => import('../../components/HeaderDetail'));
const Documents = lazy(() => import('../../components/Documents'));
const ListExtraCharge = lazy(() => import('../../components/ListExtraCharge'));

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#f5d142',
  color: '#000',
  '&:hover': {
    backgroundColor: '#f5d142',
  },
}));

type Params = {
  id: string;
};

export default function GOPSDetail() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isAdmin, setAdmin] = useState(false);
  const [openExtraCharge, setOpenExtraCharge] = useState(false);
  const { id } = useParams<keyof Params>() as Params;
  const { data, loading } = useOperation(id);

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await getUserSession();
        return setAdmin(session.user.isAdmin);
      } catch (err) {
        return setAdmin(false);
      }
    };

    initialize();
  }, []);

  if (!data || loading) return <LoadingBackdrop />;

  return (
    <Suspense fallback={<LoadingBackdrop />}>
      <DataProvider>
          <NotificationsProvider>
            <ReactQuery>
              <PageContent>
                <Container maxWidth={false}>
                  <HeaderDetail
                    isInvoiced={!!data.operation.isInvoiced}
                    isAdmin={isAdmin}
                    OperationNumber={data.operation.number}
                    OperationStep={data.operation.step}
                  />
                  <Container sx={{ minWidth: '100%' }}>
                    <OperationStep
                      key="OperationStep"
                      step={data.operation.step}
                      timeElapsed={data.operation.timeElapsed}
                      steps={data.operation.steps}
                      operationId={id}
                      number={data.operation.number}
                      skipStepUsa={data.operation.skipStepUsa}
                      clientNumber={data.operation.clientNumber}
                      isInvoiced={data.operation.isInvoiced}
                      isAdmin={isAdmin}
                    />
                  </Container>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      mt: theme.spacing(4),
                      padding: 0,
                      marginX: 'auto',
                      width: '100%',
                      minWidth: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gap: 4,
                        margin: 0,
                        gridTemplateColumns: {
                          xs: 'repeat(1, 1fr)',
                          sm: 'repeat(2, 1fr)',
                          md: 'repeat(3, 1fr)',
                          lg: 'repeat(3, 1fr)',
                        },
                      }}
                    >
                      <Board
                        key="references"
                        title={t('broker.references')}
                      >
                        <Box
                          sx={{
                            flexGrow: 1, bgcolor: 'background.paper', display: 'flex',
                          }}
                        >
                          <ReferencesTabsComponent
                            referencesHistory={data.operation.referencesHistory || []}
                          />
                        </Box>
                      </Board>
                      <Board title={t('broker.history')} key="history">
                        <History history={data.operation.history} />
                      </Board>
                      <Board title={t('broker.documents')} key="documents">
                        <Documents documents={data.operation.documents} />
                      </Board>
                      <Board
                        key="abstract"
                        title={t('broker.chargesLabel')}
                        actions={(
                          <StyledButton
                            startIcon={<AddIcon />}
                            onClick={() => setOpenExtraCharge(true)}
                          >
                            {t('broker.addExtraCharge')}
                          </StyledButton>
                      )}
                      >
                        <ListExtraCharge resume={data.operation.resume} />
                      </Board>
                    </Box>
                  </Grid>
                  <DialogComponent
                    open={openExtraCharge}
                    title={t('broker.addExtraCharge')}
                    okButtonVisibility={false}
                    cancelButtonVisibility={false}
                    maxWidth="xl"
                  >
                    <ExtraCharge onClose={() => setOpenExtraCharge(false)} id={id} />
                  </DialogComponent>
                </Container>
              </PageContent>
            </ReactQuery>
          </NotificationsProvider>
        </DataProvider>
    </Suspense>
  );
}
