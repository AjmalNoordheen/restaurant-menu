"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Gamepad2 } from "lucide-react";

import CategoryTabs from "@/components/menu/CategoryTabs";
import GameModal from "@/components/menu/GameModal";
import MenuCard from "@/components/menu/MenuCard";
import { fetchMenu } from "@/lib/menu";
import { EMPTY_MENU, type MenuData } from "@/types/menu";

export default function MenuPageClient({
  initialMenu,
}: {
  initialMenu: MenuData | null;
}) {
  const [menu, setMenu] = useState<MenuData>(initialMenu ?? EMPTY_MENU);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGames, setShowGames] = useState(false);
  const gamesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMenu) {
      setLoading(false);
      return;
    }

    async function loadMenu() {
      try {
        setMenu(await fetchMenu());
      } catch (error) {
        console.error(error);
        setError("Unable to load menu.");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  const categories = useMemo(() => [
    { id: "all", name: "All", icon: "🍽️", sort_order: 0, active: true },
    ...menu.categories
      .filter((category) => category.active)
      .sort((a, b) => a.sort_order - b.sort_order),
  ], [menu.categories]);

  const filteredItems = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return menu.items.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory;
      const matchesSearch = !searchTerm ||
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [menu.items, selectedCategory, search]);

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
      <section className="relative isolate overflow-hidden bg-[#183c32] px-5 pb-12 pt-12 text-white sm:pb-16 sm:pt-16">
        <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full border-32 border-[#d8784b]/30" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-80 w-80 rounded-full border-18 border-[#e4b85f]/20" />
        <div className="mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-[#e4b85f]"
          >
            Kerala kitchen · Dubai
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="max-w-2xl text-4xl font-black tracking-tight sm:text-6xl"
          >
            Taste of Kerala
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-3 max-w-xl text-sm leading-6 text-[#d7e2dc] sm:text-base"
          >
            Authentic flavours, freshly prepared for your table.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="relative mt-8 max-w-xl"
          >
            <Search size={20} className="absolute left-4 top-1/2 z-50 -translate-y-1/2 text-[#e4b85f]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for food or drinks..."
              className="w-full rounded-2xl border border-white/15 bg-white/10 py-4 pl-12 pr-4 text-sm text-white outline-none backdrop-blur-sm placeholder:text-[#b8c9c0] focus:border-[#e4b85f]"
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-10 md:py-14">
        <CategoryTabs categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
        <motion.div
          key={`${selectedCategory}-${search}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-4 sm:mt-8 md:mt-10"
        >
          <h2 className="text-xl font-black text-[#183c32] sm:text-3xl">Our Menu</h2>
          <p className="mt-0.5 text-xs text-neutral-600 sm:text-sm">{filteredItems.length} items</p>
        </motion.div>

        {filteredItems.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
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
