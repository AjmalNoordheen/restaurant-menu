"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { Category } from "@/types/menu";

type CategoryTabsProps = {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  loading?: boolean;
};

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelect,
  expanded,
  onExpandedChange,
  loading = false,
}: CategoryTabsProps) {
  function renderCategory(category: Category, index: number) {
    const active = selectedCategory === category.id;

    return (
      <motion.button
        key={`${category.id || "category"}-${index}`}
        onClick={() => onSelect(category.id)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        aria-pressed={active}
        className={`relative isolate flex shrink-0 items-center gap-1.5 overflow-hidden rounded-2xl px-3 py-2 text-sm font-semibold transition-colors sm:gap-2 sm:rounded-3xl sm:px-5 sm:py-2.5 ${
          active
            ? "bg-[#183c32] text-white shadow-lg"
            : "text-neutral-600 hover:bg-[#f0e8db] hover:text-[#183c32]"
        }`}
      >
        {active && (
          <motion.span
            layoutId="active-category"
            className="absolute inset-0 z-0 rounded-full bg-[#183c32]"
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          />
        )}
        <motion.span
          animate={{ scale: active ? 1.15 : 1, rotate: active ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="relative z-10 text-base"
        >
          {active && loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            category.icon || "🍽️"
          )}
        </motion.span>
        <span className="relative z-10">{category.name}</span>
      </motion.button>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-2 rounded-3xl border border-[#e8ddce] bg-[#fffdf9]/80 p-2 shadow-[0_8px_25px_rgb(24_60_50/0.06)] backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-0 flex-1 gap-2 sm:hidden">
            {categories.slice(0, 2).map(renderCategory)}
          </div>
          <div className="hidden min-w-0 flex-1 flex-wrap gap-2 sm:flex">
            {categories.slice(0, 3).map(renderCategory)}
          </div>
          {categories.length > 2 && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onExpandedChange(!expanded)}
              aria-label={expanded ? "Show fewer categories" : "Show more categories"}
              className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0e8db] text-[#183c32] transition-colors hover:bg-[#e4b85f] sm:hidden"
            >
              {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </motion.button>
          )}
          {categories.length > 3 && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onExpandedChange(!expanded)}
              aria-label={expanded ? "Show fewer categories" : "Show more categories"}
              className="ml-auto hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0e8db] text-[#183c32] transition-colors hover:bg-[#e4b85f] sm:flex"
            >
              {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </motion.button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {expanded && categories.length > 2 && (
            <motion.div
              key="mobile-categories"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="no-scrollbar flex max-h-48 flex-wrap gap-2 overflow-y-auto overscroll-contain border-t border-[#eee7dc] pt-2 pr-1 sm:hidden"
            >
              {categories.slice(2).map(renderCategory)}
            </motion.div>
          )}
          {expanded && categories.length > 3 && (
            <motion.div
              key="desktop-categories"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="no-scrollbar hidden max-h-48 flex-wrap gap-2 overflow-y-auto overscroll-contain border-t border-[#eee7dc] pt-2 pr-1 sm:flex"
            >
              {categories.slice(3).map(renderCategory)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}