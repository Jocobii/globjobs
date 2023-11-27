import { useContext } from 'react';
import { t } from 'i18next';
import {
  TabContext, TabList, TabPanel, LoadingButton,
} from '@mui/lab';
import {
  Box,
  Tab,
  Backdrop,
  CircularProgress,
  Container,
  Stack,
  Divider,
} from '@mui/material';

import General from './Tab/General';
import Registration from './Tab/Registration';
import Configuration from './Tab/Adp';
import StrategicBusinessUnit from './Tab/StrategicBusinessUnit/StrategicBusinessUnit';
import useFormHook from '../../hooks/useForm';
import { FormContext } from '../../context/FormContext';
import DialogConfirm from './DialogConfirm';

type Props = {
  edit?: boolean;
};

export function Tabs({
  edit,
}: Readonly<Props> = { edit: false }) {
  const { tab, handleChangeTab, typeSelect } = useContext(FormContext);
  const {
    register,
    control,
    errors,
    isLoading,
    onSubmit,
    handleSubmit,
    sectors,
    paymentDefault,
    loadingSubmit,
    merchandiseOption,
    companyName,
    uenSelected,
    openConfirm,
    handleCancelConfirm,
    handleCancel,
  } = useFormHook({ edit });

  if (isLoading) {
    return (
      <Backdrop open={isLoading}>
        <CircularProgress />
      </Backdrop>
    );
  }

  return (
    <Container>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Datos Generales" value="1" />
            <Tab label="Inscripciones y certificaciones" value="2" disabled={typeSelect !== 'immex'} />
            <Tab label="Unidad Estrategica de Negocio" value="3" />
            <Tab label="ADP" value="4" />
          </TabList>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TabPanel value="1">
            <General
              register={register}
              control={control}
              errors={errors}
              paymentDefault={paymentDefault}
            />
          </TabPanel>
          <TabPanel value="2">
            <Registration
              register={register}
              control={control}
              errors={errors}
              sectors={sectors}
              merchandiseOption={merchandiseOption}
            />
          </TabPanel>
          <TabPanel value="3">
            <StrategicBusinessUnit
              control={control}
              uenSelected={uenSelected}
            />
          </TabPanel>
          <TabPanel value="4">
            <Configuration
              register={register}
              control={control}
              errors={errors}
            />
          </TabPanel>
          <Divider />
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
            sx={{ mt: 2, width: '100%' }}
          >
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              sx={{ mt: 2, width: '40%' }}
            >
              <LoadingButton fullWidth size="large" variant="outlined" color="primary" onClick={handleCancel}>
                {t('broker.cancel')}
              </LoadingButton>
              <LoadingButton loading={loadingSubmit} fullWidth type="submit" size="large" variant="contained" color="primary">
                {!edit ? t('managements.teams.addClient') : t('managements.teams.saveClient')}
              </LoadingButton>
            </Stack>
          </Stack>
          <DialogConfirm
            open={openConfirm}
            handleClose={handleCancelConfirm}
            name={companyName}
            handleSuccess={handleSubmit(onSubmit)}
          />
        </form>
      </TabContext>
    </Container>
  );
}
