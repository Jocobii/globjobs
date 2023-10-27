import {
  object,
  string,
  InferType,
//   boolean,
  array,
} from 'yup';

export type BaseEntity = {
  id: string;
  createdAt: number;
};

export const menuSchema = object().shape({
  name: string().required(),
  icon: string().required(),
  order: string().required(),
  modules: array().of(object().shape({
    id: string().required(),
  })).required(),
  environment: string().required(),
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
