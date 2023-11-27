import {
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ControlledCheckbox, ControlledTextField, ControlledSelect } from '@gsuite/shared/ui';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { MERCHANDISE_OPTIONS } from '../../../utils/constants';
import { Companies } from '../../../types';

type Props = {
  register: UseFormRegister<Companies>;
  control: Control<Companies>;
  errors: FieldErrors<Companies>;
  sectors: boolean;
  merchandiseOption: string;
};

export default function Registration({
  register,
  control,
  errors,
  sectors,
  merchandiseOption,
}: Readonly<Props>) {
  const isLargeScreen = useMediaQuery('(min-width: 600px)');

  return (
    <Grid
      direction="row"
      container
      spacing={2}
      sx={{ p: 5 }}
    >
      <Grid item xs={12}>
        <Stack direction={isLargeScreen ? 'row' : 'column'} spacing={2}>
          <ControlledCheckbox
            label="IVA/IEPS"
            control={control}
            name="taxes"
          />
          <ControlledTextField
            errors={errors}
            fieldName="taxesOption"
            inputType="text"
            label=""
            register={register}
            key="name-field"
          />
          <ControlledCheckbox
            label="OEA"
            control={control}
            name="oea"
          />
          <ControlledTextField
            errors={errors}
            fieldName="oeaOption"
            inputType="text"
            label=""
            register={register}
            key="name-field"
          />
          <ControlledCheckbox
            label="PROXEC"
            control={control}
            name="prosec"
          />
          <ControlledTextField
            errors={errors}
            fieldName="prosecOption"
            inputType="text"
            label=""
            register={register}
            key="name-field"
          />
        </Stack>
      </Grid>
      <Stack
        direction="column"
        sx={{ minWidth: '100%', padding: 0, margin: 3 }}
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Typography
          variant="h6"
          sx={{ minWidth: '100%' }}
        >
          Autorizada por SAT
        </Typography>
        <Grid
          container
          sx={{ minWidth: '100%', padding: 0, margin: 0 }}
        >
          <Grid item xs={4}>
            <Stack
              direction="column"
              sx={{ minWidth: '100%', padding: 0, margin: 0 }}
              justifyContent="center"
              alignItems="flex-start"
            >
              <ControlledCheckbox
                label="Mercancia Sensible del Anexo II"
                control={control}
                name="merchandise"
              />
              <ControlledCheckbox
                label="Inscripción en sectores especificos"
                control={control}
                name="sectors"
              />
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Stack
              direction="row"
              sx={{ minWidth: '100%', padding: 0, margin: 0 }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <ControlledSelect
                  label="Apartado Autorizado"
                  control={control}
                  name="merchandiseOption"
                  key="type-select"
                  errors={errors}
                  defaultValue={merchandiseOption}
                >
                  {MERCHANDISE_OPTIONS.map(({ label, key }) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </ControlledSelect>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      {sectors && (
        <Grid container xs={12} spacing={2}>
          <Grid item xs={12} md={12}>
            <Accordion sx={{ boxShadow: 'none !important' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Grid item xs={12} md={12}>
                  <Typography color="primary" variant="body1">Sectores autorizados de importación</Typography>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row">
                  <Grid item xs={12} md={12}>
                    <Stack direction="column">
                      <ControlledCheckbox
                        label="1.- Productos químicos."
                        control={control}
                        name="import.chemicalProducts"
                      />
                      <ControlledCheckbox
                        label="3.- Precursores Químicos y químicos esenciales."
                        control={control}
                        name="import.chemicalPrecursors"
                      />
                      <ControlledCheckbox
                        label="5.- Explosivos y material relacionado con explosivos."
                        control={control}
                        name="import.explosives"
                      />
                      <ControlledCheckbox
                        label="7.- Las demás armas y accesorios. Armas blancas y accesorios. Explosores."
                        control={control}
                        name="import.knives"
                      />
                      <ControlledCheckbox
                        label="9.- Cigarros."
                        control={control}
                        name="import.cigars"
                      />
                      <ControlledCheckbox
                        label="11.- Textil y Confección."
                        control={control}
                        name="import.textile"
                      />
                      <ControlledCheckbox
                        label="13.- Hidrocarburos y combustibles."
                        control={control}
                        name="import.hydrocarbons"
                      />
                      <ControlledCheckbox
                        label="15.- Productos Siderúgicos."
                        control={control}
                        name="import.ironAndSteelProducts"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Stack direction="column">
                      <ControlledCheckbox
                        label="2.- Radiactivos y Nucleares."
                        control={control}
                        name="import.nuclearRadioactive"
                      />
                      <ControlledCheckbox
                        label="4.- Armas de fuego y sus partes, refacciones, accesorios y municiones."
                        control={control}
                        name="import.firearms"
                      />
                      <ControlledCheckbox
                        label="6.- Sustancias químicas, materiales para usos pirotécnicos y artificios relacionados con el empleo de explosivos."
                        control={control}
                        name="import.pyrotechnics"
                      />
                      <ControlledCheckbox
                        label="8.- Máquinas, aparatos, dispositivos y artefactos con armas y otros."
                        control={control}
                        name="import.machines"
                      />
                      <ControlledCheckbox
                        label="10.- Calzado."
                        control={control}
                        name="import.footwear"
                      />
                      <ControlledCheckbox
                        label="12.- Alcohol Etílico."
                        control={control}
                        name="import.alcohol"
                      />
                      <ControlledCheckbox
                        label="14.- Siderúrgico."
                        control={control}
                        name="import.ironAndSteel"
                      />
                      <ControlledCheckbox
                        label="16.- Automotriz."
                        control={control}
                        name="import.automotive"
                      />
                    </Stack>
                  </Grid>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} md={12}>
            <Accordion sx={{ boxShadow: 'none !important' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Grid item xs={12}>
                  <Typography color="primary" variant="body1">Sectores autorizados de Exportacion</Typography>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row">
                  <Grid item xs={12} md={12}>
                    <Stack direction="column">
                      <ControlledCheckbox
                        label="1.- Alcohol, alcohol desnaturalizado y mieles incristalizables."
                        control={control}
                        name="export.alcohol"
                      />
                      <ControlledCheckbox
                        label="3.- Tequila."
                        control={control}
                        name="export.tequila"
                      />
                      <ControlledCheckbox
                        label="5.- Bebidas alcohólicas destiladas (licores)."
                        control={control}
                        name="export.liqueurs"
                      />
                      <ControlledCheckbox
                        label="7.- Bebidas energetizantes, así como concentrados polvos y jarabes para preparar bebidas energetizantes."
                        control={control}
                        name="export.energizing"
                      />
                      <ControlledCheckbox
                        label="9.- Oro, plata y cobre."
                        control={control}
                        name="export.goldSilverAndCopper"
                      />
                      <ControlledCheckbox
                        label="11.- Caucho."
                        control={control}
                        name="export.rubber"
                      />
                      <ControlledCheckbox
                        label="13.- Vidrio.glass"
                        control={control}
                        name="export."
                      />
                      <ControlledCheckbox
                        label="15.- Aluminio."
                        control={control}
                        name="export.aluminum"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Stack direction="column">
                      <ControlledCheckbox
                        label="2.- Cerveza."
                        control={control}
                        name="export.beer"
                      />
                      <ControlledCheckbox
                        label="4.- Bebidas alcohólicas fermentadas (vinos)."
                        control={control}
                        name="export.wines"
                      />
                      <ControlledCheckbox
                        label="6.- Cigarros y tabacos labrados."
                        control={control}
                        name="export.cigars"
                      />
                      <ControlledCheckbox
                        label="8.- Minerales de hierro y sus concentrados."
                        control={control}
                        name="export.minerals"
                      />
                      <ControlledCheckbox
                        label="10.- Plásticos."
                        control={control}
                        name="export.plastics"
                      />
                      <ControlledCheckbox
                        label="12.- Madera y papel."
                        control={control}
                        name="export.wood"
                      />
                      <ControlledCheckbox
                        label="14.- Hierro y Acero."
                        control={control}
                        name="export.iron"
                      />
                    </Stack>
                  </Grid>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
