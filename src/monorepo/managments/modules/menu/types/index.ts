import {
  object,
  string,
  InferType,
  array,
} from 'yup';

export type BaseEntity = {
  id: string;
  createdAt: number;
};

export const menuSchema = object().shape({
  name: string().required(),
  icon: string().required(),
  order: string().optional(),
  modules: array().of(object().shape({
    id: string().required(),
  })).required(),
  environment: object().shape({
    id: string().required(),
    name: string().required(),
  }).required(),
});

type Environment = {
  id: string;
};

export type Module = {
  name: string;
  environment: Environment;
};

export type Menu = InferType<typeof menuSchema>;

export type IMenu = Menu & BaseEntity;

export type Options = {
  id: string;
  name: string;
};
