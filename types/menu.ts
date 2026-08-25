export type Category = {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
  active: boolean;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  popular?: boolean;
};

export type MenuData = {
  categories: Category[];
  items: MenuItem[];
};

export const EMPTY_MENU: MenuData = {
  categories: [],
  items: [],
};
