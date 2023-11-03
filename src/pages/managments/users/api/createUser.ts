import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useTranslation } from 'react-i18next';

import { graphqlGatewayClient } from '@/clients';
import { useSnackNotification } from '@/hooks';
import { MutationConfig, queryClient } from '@/lib/react-query';

import { User } from '../types';

export type CreateUserDto = {
  data: User;
};

type CreateUserResponse = {
  createUser: User;
};

export const createUserMutationDocument = gql`
  mutation (
    $name: String!,
    $photoUrl: String,
    $companyDeparment: String,
    $companyRole: String,
    $companies: [String!],
    $lastName: String!,
    $emailAddress: String!,
    $headquarter: HeadquarterDtoInput,
    $employeeNumber: String,
    $birthDate: String,
    $phoneNumber: String!,
    $department: DepartmentDtoInput,
    $area: AreaDtoInput,
    $coach: String,
    $charge: String,
    $employeeType: String,
    $costCenter: String,
    $darwinUser: String,
    $rbSystemsUser: String,
    $emailNotifications: Boolean,
    $wpNotifications: Boolean,
    $roleId: String,
    $overridedModules: [OverridedPermissionsDtoInput!],
    $overridedNotifications: [OverridedPermissionsDtoInput!],
    $environments: [EnvironmentsInput!],
  ) {
    createUser(
      createUserInput: {
        name: $name
        lastName: $lastName
        photoUrl: $photoUrl
        companyDeparment: $companyDeparment
        companyRole: $companyRole
        companies: $companies
        emailAddress: $emailAddress
        headquarter: $headquarter
        employeeNumber: $employeeNumber
        birthDate: $birthDate
        phoneNumber: $phoneNumber
        department: $department
        area: $area
        coach: $coach
        charge: $charge
        employeeType: $employeeType
        costCenter: $costCenter
        darwinUser: $darwinUser
        rbSystemsUser: $rbSystemsUser
        emailNotifications: $emailNotifications
        wpNotifications: $wpNotifications
        roleId: $roleId
        overridedNotifications: $overridedNotifications
        overridedModules: $overridedModules
        environments: $environments
      }
    ) {
      id: _id
      name
    }
  }
`;

export const createUser = ({ data }: any): Promise<User> => graphqlGatewayClient.request<CreateUserResponse>(
  createUserMutationDocument,
  {
    name: data.name,
    lastName: data.lastName,
    photoUrl: data.photoUrl,
    companyDeparment: data.companyDeparment,
    companyRole: data.companyRole,
    companies: data.companies,
    emailAddress: data.emailAddress,
    headquarter: data.headquarter,
    employeeNumber: data.employeeNumber,
    birthDate: data.birthDate,
    phoneNumber: data.phoneNumber,
    department: data.department,
    area: data.area,
    coach: data.coach,
    charge: data.charge,
    employeeType: data.employeeType,
    costCenter: data.costCenter,
    darwinUser: data.darwinUser,
    rbSystemsUser: data.rbSystemsUser,
    isClient: data.isClient,
    emailNotifications: data.emailNotifications,
    wpNotifications: data.wpNotifications,
    roleId: data.roleId,
    overridedNotifications: data.overridedNotifications,
    overridedModules: data.overridedModules,
    environments: data.environments,
  },
)
  .then((res) => res.createUser);

type UseCreateUserOptions = {
  config?: MutationConfig<typeof createUser>;
};

const queryKey = ['users'];

export function useCreateUser({ config }: UseCreateUserOptions = {}) {
  const { t } = useTranslation();
  const {
    errorMessage: displayErrorMessage,
    successMessage: displaySuccessMessage,
  } = useSnackNotification();

  return useMutation({
    onError: (error: any, __: any, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKey, context.previousUsers);
      }
      const errorMessage = error.response.errors[0].message ?? 'Error';
      displayErrorMessage(errorMessage);
    },
    onSuccess: (resp: User) => {
      queryClient.invalidateQueries(queryKey).catch(() => {});
      const { name } = resp;
      displaySuccessMessage(t('managements.usersModule.userCreated', { name }));
      queryClient.refetchQueries(queryKey).catch(() => {});
    },
    ...config,
    mutationFn: createUser,
  });
}
