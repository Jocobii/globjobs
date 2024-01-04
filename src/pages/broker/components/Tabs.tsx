/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box, Typography, Tabs, Tab,
} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type Detail = {
  label: number;
  references: string[];
};

function TabPanel({
  children = null, value, index, ...other
}: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
      )}
    </div>
  );
}

function TabsComponent({ referencesHistory = [] }: { referencesHistory?: Detail[] }) {
  const [value, setValue] = useState(0);
  const { t } = useTranslation();

  return (
    <>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={(_e, newValue) => setValue(newValue)}
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {
            referencesHistory.map((form: Detail, index: number) => (
              <Tab
                label={t(`broker.steps.step${form.label}`)}
                id={`vertical-tab-${index}`}
              />
            ))
          }
      </Tabs>
      {
        referencesHistory.map((form: Detail, index: number) => (
          <TabPanel value={value} index={index}>
            {
                    form.references.map((ref: string) => (
                      <Typography
                        style={{ color: '#256CF6', fontSize: '12px', marginBottom: 15 }}
                      >
                        {ref}
                      </Typography>
                    ))
                }
          </TabPanel>
        ))
      }
    </>
  );
}

export default TabsComponent;
