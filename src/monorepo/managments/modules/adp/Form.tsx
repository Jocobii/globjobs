/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  Chip,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { createFilterOptions } from '@mui/material/Autocomplete';

import dayjs, { Dayjs } from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';

import {
  FormData,
  FormProps,
} from './utils/type';

import { validPediment, ADP_DOWNLOAD_FILES } from './utils';

export type Pediment = {
  number: string;
};

export type Email = {
  email: string;
};

const filter = createFilterOptions<Pediment>();
const emailFilter = createFilterOptions<Email>();

const daysButtonGritItemComponent = ({
  days,
  onClick,
}: { days: number, onClick: (days: number) => void }) => (
  <Grid item>
    <Button
      variant="contained"
      onClick={() => onClick(days)}
    >
      {`${days} Days`}
    </Button>
  </Grid>
);

export default function Form({
  onSubmit,
  selectedCompany,
  companies,
  loadingCompanies,
  setSelectedCompany,
  handleClear: handleMainClear,
}: FormProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<DateRange<Dayjs>>([null, null]);
  const { successMessage, errorMessage } = useSnackNotification();
  const [handleDownloadFiles, { data: downloadData }] = useMutation(ADP_DOWNLOAD_FILES);

  const initialValues = {
    type: '',
    query: {
      startDate: new Date(),
      endDate: new Date(),
      ids: [],
      email: [],
    },
  };

  const [formData, setFormData] = useState<FormData>(initialValues);

  const handleClear = () => {
    handleMainClear();
    setFormData(initialValues);
    setDate([null, null]);
  };

  const handleSubmit = () => onSubmit(formData);

  const handleFormTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, type: event.target.value });
  };

  const handleDateChange = (newDate: DateRange<Dayjs>) => {
    setDate(newDate);
    setFormData({
      ...formData,
      query: {
        ...formData.query,
        startDate: newDate[0]?.toDate() ?? new Date(),
        endDate: newDate[1]?.toDate() ?? new Date(),
      },
    });
  };

  const setDateToLastDays = (days: number) => {
    const startDate = dayjs().subtract(days, 'day').toDate();
    const endDate = dayjs().toDate();
    setDate([dayjs(startDate), dayjs(endDate)]);
    setFormData({
      ...formData,
      query: {
        ...formData.query,
        startDate,
        endDate,
      },
    });
  };

  const { type } = formData;

  const daysItems = [7, 30, 60, 90].map((days) => daysButtonGritItemComponent({
    days,
    onClick: setDateToLastDays,
  }));

  useEffect(() => {
    if (downloadData) {
      const { downloadADPFiles } = downloadData;
      if (downloadADPFiles?.message) {
        successMessage(t('managements.adp.downloadSuccess'));
      }
    }
  }, [downloadData]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <FormControl
          component="fieldset"
          sx={{ width: '100%' }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                value={(selectedCompany.Numero && selectedCompany) || null}
                key="companies-select"
                disablePortal
                style={{ marginBottom: 30, marginTop: 30 }}
                options={companies || []}
                loading={loadingCompanies}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    label={t('managements.adp.selectCompany')}
                    {...params}
                  />
                )}
                onChange={(_event, value) => setSelectedCompany(value ?? {})}
              />
            </Grid>
            {selectedCompany?.Numero && (
            <Grid item xs={12}>
              <RadioGroup row aria-label="form type" name="formType" value={type} onChange={handleFormTypeChange}>
                <FormControlLabel value="byDate" control={<Radio />} label={t('managements.adp.byDate')} />
                <FormControlLabel value="byID" control={<Radio />} label={t('managements.adp.byPedimento')} />
              </RadioGroup>
            </Grid>
            )}
            {selectedCompany?.Numero && (
            <Grid item xs={12}>
              {
                type === 'byDate' && (
                <div style={{ marginBottom: 25 }}>
                  <Grid
                    container
                    spacing={3}
                    flexDirection="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    {daysItems}
                  </Grid>
                </div>
                )
              }
              {
                type === 'byDate' && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={{ start: 'From', end: 'To' }}
                >
                  <DateRangePicker
                    value={date}
                    onChange={handleDateChange}
                    renderInput={(startProps, endProps) => (
                      <>
                        <TextField fullWidth {...startProps} />
                        <Box sx={{ mx: 2 }}> a </Box>
                        <TextField fullWidth {...endProps} />
                      </>
                    )}
                  />
                </LocalizationProvider>
                )
              }
              {
                type === 'byID' && (
                <Autocomplete
                  id="pedimento-tags-outlined"
                  freeSolo
                  multiple
                  options={[]}
                  filterOptions={(options:any, params:any) => {
                    const filtered = filter(options, params);
                    // Suggest the creation of a new value
                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option:any) => inputValue === option.number);
                    if (inputValue !== '' && !isExisting) {
                      filtered.push({ number: `${inputValue}` });
                    }

                    return filtered;
                  }}
                  // loading={loadingCompanies}
                  getOptionLabel={(option:any) => {
                    if (typeof option === 'string') {
                      // Option is already a string, return it as-is
                      return option;
                    }

                    if (option?.number) {
                      // Option is an object with a 'number' property, return the number as a string
                      return option.number.toString();
                    }
                    return '';
                  }}
                  renderTags={(value, getTagProps) => value.map((option: any, index) => {
                    const number = typeof option === 'string' ? option : option?.number;
                    const { key, ...restProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={key}
                        variant="outlined"
                        color={validPediment(number) ? 'primary' : 'error'}
                        label={number}
                        {...restProps}
                      />
                    )
                  })}
                  renderOption={(props, option) => <li {...props}>{option.number}</li>}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Pedimentos"
                      placeholder="XXXXXXX"
                    />
                  )}
                  onChange={(__: unknown, newValue: any) => {
                    setFormData({
                      ...formData,
                      query: {
                        ...formData.query,
                        ids: newValue.map((item: any) => {
                          if (item?.number) {
                            return item.number;
                          }
                          return item;
                        }),
                      },
                    });
                  }}
                />
                )
              }
              <Autocomplete
                id="email-tags-outlined"
                style={{ marginTop: 10 }}
                freeSolo
                multiple
                options={[]}
                filterOptions={(options: any, params:any) => {
                  const filtered = emailFilter(options, params);
                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option: any) => inputValue === option.email);
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({ email: `${inputValue}` });
                  }
                  return filtered;
                }}
                  // loading={loadingCompanies}
                getOptionLabel={(option: any) => {
                  if (typeof option === 'string') {
                    // Option is already a string, return it as-is
                    return option;
                  }

                  if (option?.email) {
                    return option.email;
                  }
                  return '';
                }}
                renderTags={(value, getTagProps) => value.map((option: any, index) => {
                  const email: string = typeof option === 'string' ? option : option?.email;
                  const { key, ...restProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      variant="outlined"
                      label={email}
                      {...restProps}
                    />
                  )
                })
                }
                renderOption={(props, option) => <li {...props}>{option.email}</li>}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Notification emails"
                    placeholder="me@email.com"
                  />
                )}
                onChange={(__: unknown, newValue: any) => {
                  return setFormData({
                    ...formData,
                    query: {
                      ...formData.query,
                      email: newValue.map((item: any) => {
                        if (item?.email) {
                          return item.email;
                        }
                        return item;
                      }),
                    },
                  });
                }}
              />
            </Grid>
            )}
            {
            selectedCompany?.Numero && (
            <Grid item container xs={12} spacing={3}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  style={{ marginTop: 20 }}
                  onClick={() => handleSubmit()}
                  disabled={!(selectedCompany.Numero)}
                >
                  {t('managements.adp.search')}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  style={{ marginTop: 20 }}
                  onClick={async () => {
                    const {
                      query: {
                        ids, email, startDate, endDate,
                      },
                    } = formData;
                    try {
                      await handleDownloadFiles({
                        variables: {
                          downloadData: {
                            client: String(Number(selectedCompany.Numero)),
                            startDate: dayjs(startDate).format('YYYY-MM-DD'),
                            endDate: dayjs(endDate).format('YYYY-MM-DD'),
                            pedimento: ids.join(','),
                            email: email.join(','),
                          },
                        },
                        context: { clientName: 'globalization' },
                      });
                    } catch (error) {
                      errorMessage(t('managements.adp.filesError'));
                    }
                  }}
                  disabled={!(selectedCompany.Numero)}
                >
                  {t('managements.adp.sendByEmail')}
                </Button>
              </Grid>
            </Grid>
            )
          }
            {
            // only if form is touched
            selectedCompany?.Numero && formData?.query && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                style={{ marginTop: 20 }}
                onClick={handleClear}
                disabled={!(selectedCompany.Numero)}
              >
                {t('managements.adp.clear')}
              </Button>
            </Grid>
            )
          }
          </Grid>
        </FormControl>
      </form>
    </Box>
  );
}
