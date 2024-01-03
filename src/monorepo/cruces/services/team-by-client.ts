import { gql, useQuery } from '@apollo/client';

type HookProps = {
  areaId?: string;
  number?: string;
};

type Responses = {
  teamByArea: {
    id: string;
    name: string;
  }[];
  loading: boolean;
  error: any;
};

export const TEAM_BY_CLIENT = gql`
  query TeamByArea($areaId: String!, $number: String!, $getOnlyUserTeam: Boolean) {
    teamByArea(areaId: $areaId, number: $number, getOnlyUserTeam: $getOnlyUserTeam) {
      id
      name
    }
  }
`;

export default function useTeamByClient({ areaId, number }: HookProps) {
  const { data, loading, error } = useQuery<Responses>(TEAM_BY_CLIENT, {
    variables: { areaId, number, getOnlyUserTeam: true },
    skip: !areaId || !number,
  });

  return {
    teamByClient: data?.teamByArea ?? [],
    loading,
    error,
  };
}
