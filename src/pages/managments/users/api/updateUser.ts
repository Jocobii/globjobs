import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { useTranslation } from 'react-i18next';

import { graphqlGatewayClient } from '@/clients';
import { useSnackNotification } from '@/hooks';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { getCustomPropsFromError } from '@/utils/format';

import { User } from '../types';

export type UpdateUserDto = {
  data: Partial<User>;
  userId: string;
};

type Response = {
  updateUser: User;
};

export const updateUserMutationDocument = gql`
  mutation (
    $id: String!,
    $name: String,
    $photoUrl: String,
    $emailAddress: String,
    $companyDeparment: String,
    $companyRole: String,
    $companies: [String!],
    $lastName: String,
    $employeeNumber: String,
    $headquarter: HeadquarterDtoInput,
    $department: DepartmentDtoInput,
    $area: AreaDtoInput,
    $birthDate: String,
    $phoneNumber: String,
    $coach: String,
    $charge: String,
    $employeeType: String,
    $costCenter: String,
    $darwinUser: String,
    $rbSystemsUser: String,
    $active: Boolean,
    $emailNotifications: Boolean,
    $wpNotifications: Boolean,
    $roleId: String,
    $overridedModules: [OverridedPermissionsDtoInput!],
    $overridedNotifications: [OverridedPermissionsDtoInput!],
    $environments: [EnvironmentsInput!],
  ) {
    updateUser(
      id: $id
      updateUserInput: {
        name: $name
        lastName: $lastName
        photoUrl: $photoUrl
        emailAddress: $emailAddress
        companyDeparment: $companyDeparment
        companyRole: $companyRole
        companies: $companies
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
        active: $active
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

export const updateUser = ({ data, userId }: any): Promise<User> => graphqlGatewayClient.request<Response>(
  updateUserMutationDocument,
  {
    id: userId,
    name: data.name,
    lastName: data.lastName,
    emailAddress: data.emailAddress,
    photoUrl: data.photoUrl,
    companyDeparment: data.companyDeparment,
    companyRole: data.companyRole,
    companies: data.companies,
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
    active: data.active,
    emailNotifications: data.emailNotifications,
    wpNotifications: data.wpNotifications,
    roleId: data.roleId,
    overridedNotifications: data.overridedNotifications,
    overridedModules: data.overridedModules,
    environments: data.environments,
  },
).then((res) => res.updateUser);

type UseUpdateUserOptions = {
  config?: MutationConfig<typeof updateUser>;
  userId?: string;
};

const queryKey = ['users'];
const companiesQueryKey = ['paginated-companies'];

export function UseUpdateUser({ config, userId }: UseUpdateUserOptions = {}) {
  const { errorMessage, successMessage } = useSnackNotification();
  const { t } = useTranslation();

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['user', userId]);
      await queryClient.cancelQueries(companiesQueryKey);
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKey, context.previousUsers);
      }
      const { i18Key } = getCustomPropsFromError(error);
      errorMessage(t(i18Key));
    },
    onSuccess: () => {
      queryClient.refetchQueries(['user', userId]).catch(() => {});
      queryClient.invalidateQueries(queryKey).catch(() => {});
      queryClient.invalidateQueries(companiesQueryKey).catch(() => {});
      successMessage('User updated');
      queryClient.refetchQueries(queryKey).catch(() => {});
      queryClient.refetchQueries(companiesQueryKey).catch(() => {});
    },
    ...config,
    mutationFn: updateUser,
  });
}
