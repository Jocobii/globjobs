import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Typography, Stack, Card,
} from '@mui/material';

export default function History() {
  const mockHistory = [
    {
      date: new Date(),
      status: {
        name: 'Documentos en Proceso',
      },
    },
    {
      date: new Date(),
      status: {
        name: 'Documentos Pagados',
      },
    },
    {
      date: new Date(),
      status: {
        name: 'Documentos Listos',
      },
    },
    {
      date: new Date(),
      status: {
        name: 'Documentos Entregados',
      },
    },
    {
      date: new Date(),
      status: {
        name: 'Desaduanamiento',
      },
    },
  ];

  const parseDate = (date: Date) => {
    const dateParse = new Date(date);
    const minutes = dateParse.getMinutes();
    const hours = dateParse.getHours();
    return `${hours}:${minutes}`;
  };
  return (
    <Card
      sx={{
        overflow: 'auto',
        marginX: 'auto',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <Timeline position="alternate">
        {mockHistory?.map(({
          date, status,
        }) => (
          <TimelineItem key={status?.name}>
            <TimelineOppositeContent key={`${status?.name}-content `}>
              <Stack direction="column" alignItems="center">
                <Typography variant="caption">{parseDate(date)}</Typography>
              </Stack>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Stack direction="row" alignItems="center">
                <Typography variant="subtitle2">{status?.name}</Typography>
              </Stack>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  );
}
