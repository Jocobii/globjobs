import { gql, useQuery } from '@apollo/client';

export const PAGINATE_CRUCES = gql`
query($link: String!){
  getTXTData(link:$link) {
    error
    content
  }
}
`;

export const useTxtData = (link: string) => {
  const {
    data, error,
  } = useQuery(PAGINATE_CRUCES, {
    variables: {
      link,
    },
    context: { clientName: 'globalization' },
  });

  return {
    data,
    error,
  };
};
