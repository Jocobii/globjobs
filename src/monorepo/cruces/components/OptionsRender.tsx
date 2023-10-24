import {
  Avatar, Chip, Stack, Typography,
} from '@mui/material';

export type Option = {
  id: string;
  name: string;
  lastName: string;
  abbreviation: string;
  count: string;
  photoUrl: string;
};

export const renderOptions = (props: object, option: Option) => (
  <Stack
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    direction="row"
    alignItems="center"
    spacing={5}
    justifyContent="space-between"
  >
    <Stack direction="row" alignItems="center" spacing={5}>
      <Avatar
        src={option?.photoUrl}
      >
        {option?.abbreviation}
      </Avatar>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {`${option.name} ${option.lastName}`}
      </Typography>
    </Stack>
    <Chip
      label={`${option.count} Operaciones`}
      color="primary"
    />
  </Stack>
);
