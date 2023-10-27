import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  Typography, IconButton, Stack, Avatar, Card, Button,
} from '@mui/material';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import StepLogs from './StepLogs';

type DataFiles = {
  name: string;
  url: string;
};

type Logs = {
  user: string;
  date: string;
  newValue: string;
};

type Props = {
  history: [
    {
      userName: string;
      step: number;
      logs: Logs[] | [];
      status: {
        name: string;
      };
      date: Date;
      company: string;
      quantity: number;
      origin: string;
      arrivalPlace: string;
      packingListFiles: DataFiles[];
    },
  ];
};

export default function History({ history }: Props) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const parseDate = (date: Date) => new Date(date).toUTCString().replace('GMT', '');
  const [currentLog, setLog] = useState<Logs[]>([]);
  const handleChange = (step: number) => {
    const currentStep = history.find((e) => step === e.step);
    setLog(currentStep?.logs || []);
  };
  const handleClick = () => setOpen(!isOpen);
  return (
    <Card
      sx={{
        mt: 5,
        width: 'fit-content',
        overflow: 'auto',
        marginX: 'auto',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <Timeline position="alternate">
        {history?.map(({
          date, status, userName, origin, arrivalPlace, quantity, packingListFiles, logs = [], step,
        }) => (
          <TimelineItem key={status?.name}>
            <TimelineOppositeContent key={`${status?.name}-content `}>
              <Typography variant="subtitle2">{status?.name}</Typography>
              <Typography variant="subtitle2">{`${t('broker.registrationDate')}: ${parseDate(date)}`}</Typography>
              {arrivalPlace && (
              <Typography variant="subtitle2">{`${t('broker.arrivalPlaceLabel')}: ${arrivalPlace}`}</Typography>
              )}
              {origin && <Typography variant="subtitle2">{`Origen: ${origin}`}</Typography>}
              {quantity ? (
                <Typography variant="subtitle2">{`${t('broker.totalPieces')}: ${quantity}`}</Typography>
              ) : null}
              {packingListFiles && (
              <IconButton
                size="large"
                onClick={() => {
                  const link = document.createElement('a');
                  link.setAttribute('download', packingListFiles[0].name);
                  link.target = '_blank';
                  link.href = packingListFiles[0].url;
                  link.click();
                }}
              >
                <AssignmentReturnedIcon sx={{ width: 30, height: 30 }} />
              </IconButton>
              )}
            </TimelineOppositeContent>
            <TimelineSeparator key={`${status?.name}-separator `}>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Stack spacing={1} justifyContent="center" alignItems="center">
                <Avatar alt="{{userName}}" src="" sx={{ width: 40, height: 40 }} />
                <Typography variant="subtitle2">{userName}</Typography>
                <Typography variant="subtitle2">{}</Typography>
                <Typography variant="subtitle2">{parseDate(date)}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    handleChange(step);
                    handleClick();
                  }}
                  disabled={logs.length === 0}
                >
                  { logs.length > 0 ? t('broker.viewLogs') : t('broker.withoutLogs')}
                </Button>
              </Stack>
              <StepLogs
                open={isOpen}
                logs={currentLog}
                handleClose={() => handleClick()}
              />
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  );
}
