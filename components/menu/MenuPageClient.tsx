"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";

import GameModal from "@/components/menu/GameModal";
import MenuHero from "@/components/menu/MenuHero";
import MenuResults from "@/components/menu/MenuResults";
import { fetchMenu } from "@/lib/menu";
import { EMPTY_MENU, type MenuData } from "@/types/menu";

export default function MenuPageClient({
  initialMenu,
}: {
  initialMenu: MenuData | null;
}) {
  const [menu, setMenu] = useState<MenuData>(initialMenu ?? EMPTY_MENU);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(!initialMenu);
  const [refreshSource, setRefreshSource] = useState<
    "search" | "category" | null
  >(null);
  const [error, setError] = useState("");
  const [showGames, setShowGames] = useState(false);
  const gamesRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);
  const activeSearch = search.trim().length >= 3
    ? search.trim()
    : "";

  useEffect(() => {
    if (!hasMounted.current && initialMenu) {
      hasMounted.current = true;
      return;
    }

    hasMounted.current = true;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setError("");
        setMenu(await fetchMenu({
          category: selectedCategory,
          search: activeSearch,
          signal: controller.signal,
        }));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setError("Unable to load menu.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshSource(null);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [initialMenu, selectedCategory, activeSearch]);

  const categories = useMemo(() => [
    { id: "all", name: "Chef's Picks", icon: "🔥", sort_order: 0, active: true },
    ...menu.categories
      .filter((category) => category.active)
      .sort((a, b) => a.sort_order - b.sort_order),
  ], [menu.categories]);

  const filteredItems = menu.items;

  function handleCategoryChange(categoryId: string) {
    if (categoryId === selectedCategory && !search.trim()) {
      return;
    }

    setRefreshSource("category");
    setSelectedCategory(categoryId);
    setSearch("");
    setCategoriesExpanded(
      categories.some((category, index) =>
        category.id === categoryId && index >= 3
      )
    );
  }

  function handleSearchChange(value: string) {
    setRefreshSource(
      value.trim().length >= 3 ? "search" : null
    );
    setSearch(value);

    if (value.trim()) {
      setSelectedCategory("all");
      setCategoriesExpanded(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
          <p className="mt-4 text-sm text-neutral-500">Loading menu...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-5">
        <div className="text-center">
          <h1 className="text-xl font-black">Something went wrong</h1>
          <p className="mt-2 text-sm text-neutral-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f1e9] text-neutral-950">
      <MenuHero
        search={search}
        onSearchChange={handleSearchChange}
        loading={refreshSource === "search"}
      />

      <MenuResults
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categoriesExpanded={categoriesExpanded}
        onCategoriesExpandedChange={setCategoriesExpanded}
        items={filteredItems}
        search={search}
        refreshing={refreshSource === "category"}
      />

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6" ref={gamesRef}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-4xl bg-[#183c32] p-5 text-white shadow-[0_18px_45px_rgb(24_60_50/0.18)] sm:p-8"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border-24 border-[#e4b85f]/15" />
          <div className="relative flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="min-w-0 max-w-lg">
              <div className="flex items-center gap-2 text-[#e4b85f]">
                <Gamepad2 size={19} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Quick break</span>
              </div>
              <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl">A little fun with your flavours</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#d7e2dc]">Explore the menu, then take a quick game break before your next visit.</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowGames(true)}
                className="mt-6 rounded-2xl bg-[#e4b85f] px-5 py-3 text-sm font-black text-[#183c32] shadow-lg shadow-black/10"
              >
                <Gamepad2 className="mr-2 inline-block" size={17} />
                Play now
              </motion.button>
            </div>
            <motion.div
              initial={{ rotate: 4, scale: 0.9 }}
              whileInView={{ rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="grid w-full max-w-60 shrink-0 grid-cols-3 gap-2 self-center rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm sm:self-auto"
            >
              {["🍚", "🌶️", "🥤", "🍦", "🍋", "✨"].map((icon, index) => (
                <motion.div
                  key={`${icon}-${index}`}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.2, delay: index * 0.12, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fffdf9] text-2xl shadow-sm sm:h-16 sm:w-16"
                >
                  {icon}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {showGames && <GameModal onClose={() => setShowGames(false)} />}

      {/* Floating Game Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 100 }}
        whileHover={{ scale: 1.15, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          gamesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 justify-center rounded-full bg-linear-to-br from-[#183c32] to-[#285f4e] shadow-2xl transition-all hover:shadow-[0_0_30px_rgba(228,184,95,0.5)] sm:h-14 sm:w-14"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex items-center justify-center"
        >
          <Gamepad2 size={28} className="text-[#e4b85f] sm:size-8 sm:mt-2.5" strokeWidth={2} />
        </motion.div>
      </motion.button>

      {/* Glow animation background */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-30 h-14 w-14 rounded-full bg-[#e4b85f] blur-xl sm:h-16 sm:w-16"
      >
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-full rounded-full"
        />
      </motion.div>
    </main>
  );
}
