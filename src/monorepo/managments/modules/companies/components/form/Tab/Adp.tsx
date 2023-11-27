import { Stack, Grid, Typography } from '@mui/material';
import { ControlledCheckbox } from '@gsuite/shared/ui';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Companies } from '../../../types';

type Props = {
  register: UseFormRegister<Companies>;
  control: Control<Companies>;
  errors: FieldErrors<Companies>;
};

export default function Adp({
  register,
  control,
  errors,
}: Props) {
  console.log(errors, control, register);
  return (
    <Grid item xs={12} md={12} my={2}>
      <Stack
        direction="column"
        sx={{ minWidth: '100%', padding: 0, margin: 0 }}
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Typography
          variant="h6"
          sx={{ minWidth: '100%' }}
        >
          Documentos Obligatorios
        </Typography>
        <Grid
          container
          sx={{ minWidth: '100%', padding: 0, margin: 0 }}
        >
          <Grid item xs={12} md={6}>
            <Stack
              direction="column"
              sx={{ minWidth: '100%', padding: 0, margin: 0 }}
              justifyContent="center"
              alignItems="flex-start"
            >
              <ControlledCheckbox
                label="Pedimento pagado."
                control={control}
                name="mandatoryADPDocuments.paidPetition"
                disabled
              />
              <ControlledCheckbox
                label="Facturas."
                control={control}
                name="mandatoryADPDocuments.invoices"
                disabled
              />
              <ControlledCheckbox
                label="Doda/Pita."
                control={control}
                name="mandatoryADPDocuments.dodaPita"
                disabled
              />
              <ControlledCheckbox
                label="Acuse de detalle de COVE"
                control={control}
                name="mandatoryADPDocuments.coveDetailAcknowledgment"
                disabled
              />
              <ControlledCheckbox
                label="ED"
                control={control}
                name="mandatoryADPDocuments.ed"
                disabled
              />
              <ControlledCheckbox
                label="XML ED."
                control={control}
                name="mandatoryADPDocuments.edXml"
                disabled
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack
              direction="column"
              sx={{ minWidth: '100%', padding: 0, margin: 0 }}
              justifyContent="center"
              alignItems="flex-start"
            >
              <ControlledCheckbox
                label="Acuse ED."
                control={control}
                name="mandatoryADPDocuments.edAcknowledgment"
                disabled
              />
              <ControlledCheckbox
                label="Archivos de validación."
                control={control}
                name="mandatoryADPDocuments.validationFiles"
                disabled
              />
              <ControlledCheckbox
                label="Archivos de pago."
                control={control}
                name="mandatoryADPDocuments.paymentFiles"
                disabled
              />
              <ControlledCheckbox
                label="XML Doda/Pita."
                control={control}
                name="mandatoryADPDocuments.dodaPitaXml"
                disabled
              />
              <ControlledCheckbox
                label="XML Cove."
                control={control}
                name="mandatoryADPDocuments.coveXml"
                disabled
              />
            </Stack>
          </Grid>
        </Grid>
        <Typography
          variant="h6"
          sx={{ minWidth: '100%' }}
        >
          Variables / Complementarios
        </Typography>
        <Grid
          container
          sx={{ minWidth: '100%', padding: 0, margin: 0 }}
        >
          <Grid item xs={12} md={6}>
            <Stack
              direction="column"
              sx={{ minWidth: '100%', padding: 0, margin: 0 }}
              justifyContent="center"
              alignItems="flex-start"
            >
              <ControlledCheckbox
                label="Copia simplificada de pedimento."
                control={control}
                name="complementaryADPDocuments.petitionSimplifiedCopy"
              />
              <ControlledCheckbox
                label="Copia null de pedimento."
                control={control}
                name="complementaryADPDocuments.petitionNullCopy"
              />
              <ControlledCheckbox
                label="Manifestación de valor."
                control={control}
                name="complementaryADPDocuments.manifestationOfValue"
              />
              <ControlledCheckbox
                label="Hoja de cálculo."
                control={control}
                name="complementaryADPDocuments.spreadsheet"
              />
              <ControlledCheckbox
                label="Documentos anexos sin digitalización."
                control={control}
                name="complementaryADPDocuments.attachedDocumentWithoutDigitization"
              />
              <ControlledCheckbox
                label="Shipper."
                control={control}
                name="complementaryADPDocuments.shipper"
              />
              <ControlledCheckbox
                label="Manfiesto/Entry."
                control={control}
                name="complementaryADPDocuments.manifestationEntry"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack
              direction="column"
              sx={{ minWidth: '100%', padding: 0, margin: 0 }}
              justifyContent="center"
              alignItems="flex-start"
            >
              <ControlledCheckbox
                label="Carta Porte."
                control={control}
                name="complementaryADPDocuments.waybill"
              />
              <ControlledCheckbox
                label="Conocimiento de embarque."
                control={control}
                name="complementaryADPDocuments.billOfLading"
              />
              <ControlledCheckbox
                label="Guía o documentos de transporte."
                control={control}
                name="complementaryADPDocuments.guideOrTransportDocuments"
              />
              <ControlledCheckbox
                label="Certificado de molino."
                control={control}
                name="complementaryADPDocuments.millCertificate"
              />
              <ControlledCheckbox
                label="PROSEC."
                control={control}
                name="complementaryADPDocuments.prosec"
              />
              <ControlledCheckbox
                label="IMMEX."
                control={control}
                name="complementaryADPDocuments.immex"
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Grid>
  );
}
