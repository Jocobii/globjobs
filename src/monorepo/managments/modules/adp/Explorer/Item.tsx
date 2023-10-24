import {
  Box,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

export function ListItemAction({ extra }: { extra: any }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Stack direction="row" spacing={1}>
        {(extra && extra.fileType) && (
        <Chip
          size="small"
          label={extra.fileType}
          color="success"
          variant="outlined"
        />
        )}
        {
            (extra && extra.total_files) && (
              <Chip
                label={`${extra.total_files} files`}
                variant="outlined"
                color="info"
                size="small"

              />
            )
          }
      </Stack>
    </Box>
  );
}

export function ListItemPrimary({ name, children }: { name: any, children: any }) {
  return (
    <Typography variant={`${children ? 'h6' : 'body1'}`}>
      {
        children ? (
          <b>{name}</b>
        ) : (
          name
        )
      }
    </Typography>
  );
}

export function ListItemSecondary({ extra }: { extra: any }) {
  return (
    <Box>
      {
        (extra && extra.size_human) ? (
          <Typography
            component="span"
            variant="caption"
            color={extra.size > 1000000 ? 'error' : 'primary'}
            sx={{ display: 'inline' }}
          >
            {extra.size_human}
          </Typography>
        ) : null
      }
      {
        (extra && extra.fileType) ? (
          <Typography
            component="span"
            variant="caption"
            color={extra.size > 1000000 ? 'error' : 'primary'}
            sx={{ display: 'inline' }}
          >
            {` - ${extra.fileType}`}
          </Typography>
        ) : null
      }
    </Box>
  );
}
