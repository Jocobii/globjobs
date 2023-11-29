import { useTranslation } from 'react-i18next';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import EditIcon from '@mui/icons-material/Edit';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { normalizeKeyName } from '@/utils/format';
import { Logs } from '../typings';

interface Props {
  logs: Logs[];
}

export default function AlternateTimeline({ logs = [] }: Props) {
  const { t } = useTranslation();

  const parseDate = (date: Date) => new Date(date).toUTCString().replace('GMT', '');
  const printValuesChanged = (stringNewValues: string) => {
    const objectValues = JSON.parse(stringNewValues);
    const values = Object.keys(objectValues);
    return values.map((value) => (
      <>
        <Typography variant="body2" key={value}>
          {normalizeKeyName(value)}
          :
          {' '}
        </Typography>
        <Typography variant="caption" key={value}>
          {typeof objectValues[value] === 'object' ? t('wasUpdated') : objectValues[value]}
        </Typography>
      </>
    ));
  };

  return (
    <Timeline position="alternate">
      {
        logs.length > 0 ? logs.map((log) => (
          <TimelineItem key={log.date}>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              {parseDate(new Date(log.date))}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                <EditIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="body1" component="span">
                {log.user}
              </Typography>
              <Typography>{printValuesChanged(log.newValue)}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))
          : <Typography variant="h6" component="span">{t('broker.withoutLogs')}</Typography>
      }
    </Timeline>
  );
}
