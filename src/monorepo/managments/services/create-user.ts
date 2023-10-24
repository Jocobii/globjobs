import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation (
    $name: String!,
    $lastName: String!,
    $emailAddress: String!,
    $headquarter: HeadquarterDtoInput!,
    $employeeNumber: String!,
    $birthDate: String!,
    $phoneNumber: String!,
    $department: DepartmentDtoInput!,
    $area: AreaDtoInput,
    $coach: String!,
    $charge: String!,
    $employeeType: String!,
    $costCenter: String!,
    $darwinUser: String!,
    $rbSystemsUser: String!,
    $isClient: Boolean!
  ) {
    createUser(
      createUserInput: {
        name: $name 
        lastName: $lastName
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
        isClient: $isClient
      }
    ) {
      name
      lastName
    }
  }
`;
