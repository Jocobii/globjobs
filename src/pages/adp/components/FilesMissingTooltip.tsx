import { styled } from '@mui/material/styles';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Container } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface Props {
  filesNames: string[];
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export function FilesMissingTooltip({ filesNames }: Props) {
  return (
    <div>
      <BootstrapTooltip
        placement="left"
        title={(
          <Container sx={{ padding: 1 }}>
            <Typography
              key={filesNames.length}
              sx={{
                color: 'white',
                fontSize: '1rem',
              }}
            >
              Archivos faltantes:
            </Typography>
            {
            filesNames.map((name) => (
              <Typography
                key={filesNames.length}
                sx={{
                  color: 'white',
                  fontSize: '0.8rem',
                }}
              >
                {' '}
                {name}
              </Typography>
            ))
            }
          </Container>
        )}
      >
        {
          filesNames.length > 0
            ? (
              <WarningAmberOutlinedIcon
                sx={{
                  color: 'warning.main',
                  fontSize: '1.5rem',
                }}
              />
            )
            : (
              <CheckCircleOutlineOutlinedIcon
                sx={{
                  color: 'success.main',
                  fontSize: '1.5rem',
                }}
              />
            )
        }
      </BootstrapTooltip>
    </div>
  );
}
