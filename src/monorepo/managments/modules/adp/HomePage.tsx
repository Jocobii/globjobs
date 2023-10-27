/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useSnackNotification } from '@gsuite/shared/hooks';
import {
  Grid,
  Box,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { useCompaniesSap, ADP_FILES_QUERY } from './utils';

import Explorer from './Explorer/index';
import Form from './Form';

import {
  Company, Pediment,
} from './utils/type';

const dateFormat = 'YYYY-MM-DD';

function Component() {
  const { t } = useTranslation();
  const { successMessage, errorMessage } = useSnackNotification();
  const [selectedCompany, setSelectedCompany] = useState<Company>({});

  const [pedimentTree, setPedimentTree] = useState<Pediment[]>([]);
  const { data: companies, loading: loadingCompanies } = useCompaniesSap();
  const [getFiles, { data: filesFetched, loading: isLoading }] = useMutation(ADP_FILES_QUERY);

  const handleClear = () => {
    setPedimentTree([]);
    setSelectedCompany({});
  };

  const handleSearch = async (vals:any) => {
    const { query: { startDate, endDate, ids } } = vals;
    try {
      await getFiles({
        variables: {
          company: String(Number(selectedCompany.Numero)),
          start: dayjs(startDate).format(dateFormat),
          end: dayjs(endDate).format(dateFormat),
          pedimento: ids?.length ? ids.join(',') : '',
        },
        context: { clientName: 'globalization' },
      });
    } catch (error) {
      errorMessage(t('managements.adp.filesError'));
    }
  };

  useEffect(() => {
    if (filesFetched) {
      const { getADPFiles } = filesFetched;

      if (getADPFiles) {
        if (getADPFiles.statusCode === 200) {
          successMessage(t('managements.adp.filesFetched'));
          const { data: fileData } = getADPFiles.body;
          setPedimentTree(fileData
            .map((p: Pediment) => ({
              ...p,
              visible: true,
            })));
        } else {
          errorMessage(t('managements.adp.filesError'));
        }
      }
    }
  }, [filesFetched]);

  return (
    <Box>
      <Grid container>
        <Grid xs={12} item>
          <h1>ADP</h1>
          { selectedCompany.Numero && (
          <h6>
            {selectedCompany.Nombre}
          </h6>
          )}
        </Grid>
        <Grid xs={12} item>
          <Form
            setSelectedCompany={setSelectedCompany}
            loadingCompanies={loadingCompanies}
            companies={companies?.getSAPCompanies || []}
            selectedCompany={selectedCompany}
            onSubmit={handleSearch}
            onSubmitLoading={isLoading}
            handleClear={handleClear}
          />
        </Grid>
        {
        ((pedimentTree?.length) && (
          <Grid item xs={12}><Explorer data={pedimentTree} /></Grid>
        )) || null
      }
        <Backdrop
          open={isLoading}
          sx={{ color: '#fff', zIndex: (th) => th.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>
    </Box>
  );
}

export default Component;
