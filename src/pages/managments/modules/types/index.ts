import {
  object,
  string,
  InferType,
  boolean,
  array,
} from 'yup';

export type BaseEntity = {
  id: string;
  createdAt: number;
};

export type Environment = {
  id: string;
  name: string;
};

export const moduleSchema = object().shape({
  name: string().required(),
  description: string().required(),
  component: string().required(),
  icon: string().required(),
  endpoint: string().required(),
  route: string().required(),
  toolbox: boolean().required(),
  exact: boolean().required(),
  actions: array().of(
    object().shape({
      id: string().required(),
      name: string().required(),
    }).required(),
  ).required(),
  environment: object().shape({
    id: string().required(),
    name: string().required(),
  }).required(),
});

export type Module = InferType<typeof moduleSchema>;

export type IModule = Module & BaseEntity;
