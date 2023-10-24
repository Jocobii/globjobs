import { Backdrop, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useGetSAPCompany } from '../api/getSAPCompany';
import Card from './Card';
import { parseCompany } from '../utils';

type Params = {
  id: string;
};

type Props = {
  edit?: boolean;
};

export default function DetailContent({ edit = false }: Props) {
  const { id } = useParams<keyof Params>() as Params;
  const { isLoading, data } = useGetSAPCompany({ number: id });

  return (
    <>
      {
            !isLoading && data?.Numero && (
              <Card
                company={parseCompany(data)}
                edit={edit}
              />
            )
          }
      <Backdrop open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
}
