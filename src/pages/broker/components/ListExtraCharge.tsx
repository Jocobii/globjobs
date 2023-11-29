import {
  List, ListItem, ListItemText, ListItemIcon, Stack,
} from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

type Props = {
  resume: [
    {
      title: string;
      info: string[];
    },
  ];
};
export default function ListExtraCharge({ resume }: Readonly<Props>) {
  return (
    <List
      dense
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {resume?.map(({ title, info }) => (
        <ListItem key={title} divider autoFocus>
          <ListItemIcon>
            <RadioButtonCheckedIcon color="primary" />
          </ListItemIcon>
          <Stack direction="column" spacing={1}>
            <ListItemText primary={title} disableTypography />
            {info?.map((item) => (
              <ListItemText
                key={item}
                primary={item}
                disableTypography
              />
            ))}
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}
