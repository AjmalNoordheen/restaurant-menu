import { AnimatePresence, motion } from "framer-motion";
import MenuCard from "@/components/menu/MenuCard";
import type { Category, MenuItem } from "@/types/menu";
import CategoryTabs from "@/components/menu/CategoryTabs";

type MenuResultsProps = {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  categoriesExpanded: boolean;
  onCategoriesExpandedChange: (expanded: boolean) => void;
  items: MenuItem[];
  search: string;
  refreshing: boolean;
};

export default function MenuResults({
  categories,
  selectedCategory,
  onCategoryChange,
  categoriesExpanded,
  onCategoriesExpandedChange,
  items,
  search,
  refreshing,
}: MenuResultsProps) {
  return (
    <section className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-10 md:py-14">
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={onCategoryChange}
        expanded={categoriesExpanded}
        onExpandedChange={onCategoriesExpandedChange}
        loading={refreshing}
      />
      <motion.div
        key={`${selectedCategory}-${search}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-4 sm:mt-8 md:mt-10"
      >
        <h2 className="text-xl font-black text-[#183c32] sm:text-3xl">Our Menu</h2>
        <p className="mt-0.5 text-xs text-neutral-600 sm:text-sm">{items.length} items</p>
      </motion.div>

      {items.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
                priority={index === 0}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold text-neutral-800">No items found</p>
          <p className="mt-2 text-sm text-neutral-500">Try another search or category.</p>
        </div>
      )}
    </section>
  );
}
