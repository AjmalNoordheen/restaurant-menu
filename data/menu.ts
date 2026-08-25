export type Category = {
  id: string;
  name: string;
  icon: string;
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

export const categories: Category[] = [
  {
    id: "all",
    name: "All",
    icon: "🍽️",
  },
  {
    id: "biriyani",
    name: "Biriyani",
    icon: "🍚",
  },
  {
    id: "drinks",
    name: "Drinks",
    icon: "🥤",
  },
  {
    id: "bread",
    name: "Bread",
    icon: "🫓",
  },
];

export const menuItems: MenuItem[] = [
  {
    id: "1",
    categoryId: "biriyani",
    name: "Chicken Biriyani",
    description:
      "Aromatic basmati rice cooked with tender chicken and traditional spices.",
    price: 18,
    image: "/menu/chicken-biriyani.webp",
    available: true,
    popular: true,
  },
  {
    id: "2",
    categoryId: "biriyani",
    name: "Beef Biriyani",
    description:
      "Malabar-style biriyani with tender beef and fragrant basmati rice.",
    price: 20,
    image: "/menu/beef-biriyani.webp",
    available: true,
  },
  {
    id: "3",
    categoryId: "bread",
    name: "Porotta",
    description:
      "Flaky and layered traditional Malabar-style porotta.",
    price: 2,
    image: "/menu/porotta.webp",
    available: true,
    popular: true,
  },
  {
    id: "4",
    categoryId: "drinks",
    name: "Fresh Lime",
    description:
      "Refreshing fresh lime juice with a hint of mint.",
    price: 8,
    image: "/menu/fresh-lime.webp",
    available: true,
  },
  {
    id: "5",
    categoryId: "drinks",
    name: "Karak Tea",
    description:
      "Traditional UAE-style karak tea with rich milk and spices.",
    price: 5,
    image: "/menu/karak-tea.webp",
    available: true,
  },
];