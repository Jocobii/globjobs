import { gql, useQuery } from '@apollo/client';

export type CoachTeam = {
  id: string;
  abbreviation: string;
  count: string;
  lastName: string;
  name: string;
  photoUrl: string;
};

export type Data = {
  getCoachTeams: CoachTeam[];
};

const COACH_TEAM = gql`
query GetCoachTeams($userId: String!) {
  getCoachTeams(userId: $userId) {
    id: _id
    abbreviation
    count
    lastName
    name
    photoUrl
  }
}
`;

export const useCoachTeam = (userId: string) => useQuery<Data>(COACH_TEAM, {
  variables: {
    userId,
  },
  context: { clientName: 'globalization' },
});
