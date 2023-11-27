import { gql, useQuery } from '@apollo/client';
import { Area } from '../types';

type Response = {
  area: Area;
};

const getAreaDocument = gql`
  query GetAreaQuery($areaId: String!) {
    area(id: $areaId) {
      _id
      name
      abbreviation
      department {
        id: _id
        name
      }  
    }
  }
`;

export type GetAreaDTO = {
  areaId?: string;
};

export const useGetArea = ({ areaId }: GetAreaDTO) => useQuery<Response>(getAreaDocument, {
  variables: {
    areaId,
  },
  skip: !areaId,
});
