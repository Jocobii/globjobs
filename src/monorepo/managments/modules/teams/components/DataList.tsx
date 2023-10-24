import {
  Paper,
  ListSubheader,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';

type Props = {
  title: string;
  dataList: any[];
  isCustomer: boolean;
};

const StripedListItem = styled(ListItem)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

export default function DataList({ title, dataList, isCustomer }: Props) {
  return (
    <Paper sx={{ width: '100%' }}>
      <ListSubheader sx={{ fontSize: 17 }}>{title}</ListSubheader>
      {
        isCustomer
          ? (
            <List sx={{ width: '100%' }}>
              {
                dataList.map((item) => (
                  <StripedListItem
                    key={item?.id}
                  >
                    <ListItemText
                      primary={item?.name}
                      secondary={`SAP Code: ${item?.number}`}
                    />
                  </StripedListItem>
                ))
              }
            </List>
          ) : (
            <List sx={{ width: '100%' }}>
              {
                dataList.map((item) => (
                  <StripedListItem
                    key={item?.id}
                  >
                    <ListItemText
                      primary={`${item?.name} ${item?.lastName}`}
                      secondary={`${item?.couch ? 'Couch' : 'Specialist'} - ${item?.teams?.map((team: { name: string }) => team?.name || '').join(', ')}`}
                    />
                  </StripedListItem>
                ))
              }
            </List>
          )
      }
    </Paper>
  );
}
