"use client";

import { useMemo, useState } from "react";
import { Search, Gamepad2 } from "lucide-react";

import { categories, menuItems } from "@/data/menu";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuCard from "@/components/menu/MenuCard";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.categoryId === selectedCategory;

      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* Hero */}
      <section className="bg-neutral-950 px-5 pb-10 pt-12 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-medium tracking-[0.25em] text-neutral-400 uppercase">
            Welcome
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Taste of Kerala
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400 sm:text-base">
            Authentic flavours, freshly prepared for you.
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-xl">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for food or drinks..."
              className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-white/30"
            />
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-neutral-900">
              Our Menu
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {filteredItems.length} items
            </p>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-neutral-800">
              No items found
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Try another search or category.
            </p>
          </div>
        )}
      </section>

      {/* Game */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-neutral-900 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Gamepad2 size={20} />
                <span className="text-sm font-semibold">
                  Waiting for your order?
                </span>
              </div>

              <h3 className="mt-2 text-2xl font-black">
                Play a quick game 🎮
              </h3>

              <p className="mt-2 text-sm text-neutral-400">
                Have some fun while we prepare your food.
              </p>
            </div>

            <button className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition-transform hover:scale-105">
              Play Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}