import { gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { graphqlGatewayClient } from '@/clients';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

export type Module = {
  name: string;
  key: string;
  checked?: boolean;
  permissions: { name: string; checked: boolean }[];
};

type Notification = {
  name: string;
  checked: boolean;
  permissions: { name: string, checked: boolean }[];
};

type UserDocument = {
  _id: string;
  name: string;
  photoUrl: string;
  lastName: string;
  active: boolean;
  emailAddress: string;
  area: {
    id: string;
    name: string;
  };
  department: {
    id: string;
    name: string;
  };
  headquarter: {
    id: string;
    name: string;
  };
  employeeNumber: string;
  birthDate: string;
  phoneNumber: string;
  coach: string;
  costCenter: string;
  charge: string;
  employeeType: string;
  darwinUser: boolean;
  rbSystemsUser: boolean;
  wpNotifications: boolean;
  emailNotifications: boolean;
  companyDeparment: string;
  companyRole: string;
  environments: {
    id: string,
    name: string,
  }[];
  companies: {
    _id: string;
    name: string;
    number: string;
    rfc: string;
  }[];
  role: {
    name: string;
    id: string;
    modules: {
      name: string;
      key: string;
      permissions: {
        name: string;
        checked: boolean;
      }[];
    }[];
    notifications: {
      email: boolean;
      whatsapp: boolean;
      notifications: {
        name: string;
        key: string;
        permissions: {
          name: string;
          checked: boolean;
        }[];
      }[];
    };
  };
  overridedModules: Module[];
  overridedNotifications: Notification[];
};

type Response = {
  user: UserDocument;
};

const getUserDocument = gql`
  query GetUserQuery($id: String!) {
    user(id: $id) {
      _id
      name
      photoUrl
      lastName
      active
      emailAddress
      area {
        id: _id
        name
      }
      department {
        id: _id
        name
      }
      headquarter {
        id
        name
      }
      employeeNumber
      birthDate
      phoneNumber
      coach
      costCenter
      charge
      employeeType
      darwinUser
      rbSystemsUser
      wpNotifications
      emailNotifications
      companyDeparment
      companyRole
      environments {
        id
        name
      }
      companies {
        _id
        name
        number
        rfc
      }
      role {
        name
        id
        modules {
          name
          key
          permissions {
            name
            checked
          }
        }
        notifications {
          email
          whatsapp
          notifications {
            name
            key
            permissions {
              name
              checked
            }
          }
        }
      }
      overridedModules {
        name
        permissions {
          name
          checked
        }
      }
      overridedNotifications {
      name
      permissions {
        name
        checked
      }
    }
    }
  }
`;

export const getUserQuery = async (id?: string) => graphqlGatewayClient
  .request<Response>(
    getUserDocument, 
    { id },
  )
    .then((res) => res.user);

type QueryFnType = typeof getUserQuery;
type UseUserOptions = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
};

export function useGetUser({ id, config }: UseUserOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['user', id],
    queryFn: () => getUserQuery(id),
    suspense: true,
    enabled: !id,
    ...config,
  });
}
