import {
  object,
  string,
  InferType,
  boolean,
  mixed,
} from 'yup';

import { TFunctionType } from '@gsuite/typings/common';

export type BaseEntity = {
  id: string;
  createdAt: number;
};

export const teamSchema = object().shape({
  name: string().required(),
  groupEmail: string().required(),
  headquarter: object().shape({
    id: mixed().required(),
  }),
  active: boolean(),
});

export const changeTeamSchema = object().shape({
  team: object({
    id: mixed().required(),
  }).required(),
});

export const addToTeamSchema = object().shape({
  add: object({
    user: mixed().required('el usuario es requerido'),
  }).required(),
});

export type FormBaseProps = {
  onClose: () => void;
  t: TFunctionType;
};

export type Team = InferType<typeof teamSchema>;
export type ChangeTeam = InferType<typeof changeTeamSchema>;
export type AddToTeam = InferType<typeof addToTeamSchema>;

export type ITeam = Team & BaseEntity;
export type ParamChangeTeam = {
  id?: string,
  _id?: string,
  name?: string,
}[];

type Address = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export type Company = {
  id: string;
  number: string;
  name: string;
  rfc: string;
  email: string;
  type: string;
  address: Address
  active: boolean;
};

type SchemaProps = {
  t: TFunctionType;
};

export function assignToTeamSchema({ t }: SchemaProps) {
  return object().shape({
    target: mixed().required(t('generic.requiredField')),
  });
}

export type AssignTeam = InferType<ReturnType<typeof assignToTeamSchema>>;
