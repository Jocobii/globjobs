import { gql, useMutation } from '@apollo/client';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { Menu } from '../types';

export type CreateMenuDto = {
  data: Menu;
};

export const createMenuMutationDocument = gql`
  mutation (
    $name: String!,
    $environment: EnvironmentsInput!
    $icon: String!,
    $modules: [String!]!
  ) {
    createMenu(
      createMenuInput: {
        name: $name,
        environment: $environment,
        icon: $icon,
        modules: $modules
      }
    ) {
      name
    }
  }
`;

export const useCreateMenu = () => {
  const { successMessage, errorMessage } = useSnackNotification();
  const [createMenu] = useMutation(createMenuMutationDocument, {
    onCompleted: () => {
      successMessage('Menu created successfully');
    },
    onError: () => {
      errorMessage('Error creating menu');
    },
  });
  return { createMenu };
};
