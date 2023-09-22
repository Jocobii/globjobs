export type BaseEntity = {
  id: string;
  createdAt: number;
};

type Environment = {
  id: string;
  name: string;
};

export type Module = {
  name: string;
  environment?: Environment;
  id: string;
  route: string;
  component: string;
  icon: string;
  description: string;
};

export type Menu = {
  name: string
};

export type IMenu = Menu & BaseEntity;

export type MenuElement = {
  name?: string;
  modules?: Module[];
  order?: string;
  icon?: string;
  environment?: Environment;
};
