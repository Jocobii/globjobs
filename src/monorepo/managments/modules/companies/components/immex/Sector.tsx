import { useState } from 'react';
import {
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import _ from 'lodash';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { sectors } from '../../utils/constants';
import { SectorVisibility as Visibility, SectorProps } from '../../types';

export default function Sector({ handleChange, initial = {} }: SectorProps) {
  const [visible, setVisible] = useState({ import: true, export: true });
  const { import: imp, export: exp } = initial;
  const getChecked = (type: string, key: string) => {
    if (type === 'import') {
      return _.get(imp, key);
    }
    if (type === 'export') {
      return _.get(exp, key);
    }
    return false;
  };

  return (
    <>
      {
        sectors.map((sector) => {
          const sectionVisibility = visible[sector.key as keyof Visibility];
          return (
            <Grid
              container
              spacing={2}
              style={{ marginTop: 20 }}
              key={sector.key}
            >
              <Grid
                container
                item
                xs={12}
                direction="row"
                style={{ backgroundColor: '#246CF6', color: '#fff', padding: 10 }}
              >
                <Grid
                  item
                  xs={11}
                >
                  <Typography>{sector.title}</Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  style={{ textAlign: 'right' }}
                >
                  <IconButton
                    key={sector.key}
                    onClick={() => {
                      setVisible({
                        ...visible,
                        [sector.key]: !sectionVisibility,
                      });
                    }}
                  >
                    <ArrowForwardIosIcon
                      style={{
                        transform: `rotate(${sectionVisibility ? '270deg' : '90deg'})`,
                        color: '#fff',
                      }}
                    />
                  </IconButton>
                </Grid>
              </Grid>
              {
                sectionVisibility && (
                  <Grid container item xs={12} key={sector.key}>
                    {
                      sector.items.map((item) => (
                        <Grid
                          item
                          xs={12}
                          md={6}
                          key={item.key}
                        >
                          <FormControlLabel
                            control={(
                              <Checkbox
                                checked={getChecked(sector.key, item.key)}
                                key={item.key}
                                onChange={
                                  ({ target }) => handleChange(
                                    sector.key,
                                    { [item.key]: target.checked },
                                  )
                                }
                              />
                            )}
                            label={item.label}
                          />
                        </Grid>
                      ))
                    }
                  </Grid>
                )
              }
            </Grid>
          );
        })
      }
    </>
  );
}
