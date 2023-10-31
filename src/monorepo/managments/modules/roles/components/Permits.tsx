import { Accordion, AccordionSummary, FormControlLabel, Checkbox, AccordionDetails, FormGroup, Stack, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type permissions = {
  name: string;
  checked: boolean;
};

type Props = {
  keyName: string;
  i: number;
  checked?: boolean;
  name: string;
  onChange: (event: React.SyntheticEvent<Element, Event>, checked: boolean) => void;
  permissions?: permissions[];
};

export default function Permits({
  keyName,
  i,
  name,
  permissions = [],
  checked = false,
  onChange,
}: Props) {
  const hasPermissions = permissions.length > 0;

  if (!hasPermissions) return (
    <Stack direction="row" spacing={1}>
      <FormControlLabel
        key={`parent-${name}`}
        label={name}
        control={<Checkbox checked={checked} id={keyName} />}
        onChange={onChange}
      />
    </Stack>
  );

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={hasPermissions ? <ExpandMoreIcon /> : null}
        aria-controls={`panel${keyName}${String(i)}`}
        id={`panel${name}${String(i)}`}
      >
        <FormControlLabel
          key={`parent-${name}`}
          label={name}
          control={<Checkbox checked={checked} id={keyName} />}
          onChange={onChange}
        />
      </AccordionSummary>
      {hasPermissions && (
        <AccordionDetails>
          <FormGroup>
            <Box
              sx={{
                p: 1,
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
              }}
            >
              {permissions?.map(({ name: permission, checked }) => (
                <FormControlLabel
                  key={permission}
                  label={permission}
                  control={<Checkbox checked={checked} id={`${keyName}-${permission}`}/>}
                  onChange={onChange}
                />
              ))}
            </Box>
          </FormGroup>
        </AccordionDetails>
      )}
    </Accordion>
  );
}