"use client";

import type { Category } from "@/data/menu";

type CategoryTabsProps = {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
};

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
      <div className="flex min-w-max gap-3">
        {categories.map((category) => {
          const active = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                active
                  ? "bg-neutral-900 text-white shadow-lg"
                  : "bg-white text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-100"
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}