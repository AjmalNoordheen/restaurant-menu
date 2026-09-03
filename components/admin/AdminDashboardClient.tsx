"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Utensils,
  Tags,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { fetchMenu, getMenuImageUrl } from "@/lib/menu";
import { EMPTY_MENU, type MenuData } from "@/types/menu";
import MenuImage from "@/components/menu/MenuImage";

export default function AdminDashboardClient({
  initialMenu,
}: {
  initialMenu: MenuData | null;
}) {
  const [menu, setMenu] = useState<MenuData>(initialMenu ?? EMPTY_MENU);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialMenu) {
      setLoading(false);
      return;
    }

    async function loadMenu() {
      try {
        setMenu(await fetchMenu({ includeAll: true }));
      } catch (error) {
        console.error(error);
        setError("Unable to load menu.");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  const availableItems = menu.items.filter(
    (item) => item.available
  ).length;

  const unavailableItems = menu.items.filter(
    (item) => !item.available
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef3ef]">
      {/* Header */}
      <header className="border-b border-[#e1d7c8] bg-[#fffdf8] px-5 py-6 sm:px-10 sm:py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e4b85f]">
              Overview
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#15382f] sm:text-4xl">
              Good morning, chef.
            </h1>
            <p className="mt-2 text-sm text-neutral-500">Here is what is happening across your menu.</p>
          </div>

          <div className="flex self-start gap-2 sm:self-auto">
            <Link
              href="/admin/categories"
              title="Add category"
              aria-label="Add category"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#b8c9c0] bg-[#fffdf8] text-[#15382f] transition hover:bg-[#e7efe9] sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3 sm:text-sm sm:font-bold"
            >
              <Tags size={18} />
              <span className="hidden sm:inline">
                Add Category
              </span>
            </Link>

            <Link
              href="/admin/items"
              title="Add item"
              aria-label="Add item"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#15382f] text-white transition hover:bg-[#285647] sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3 sm:text-sm sm:font-bold"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">
                Add Item
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-5 sm:p-10">
        {/* Statistics */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricItem
            title="Total Items"
            value={menu.items.length}
            icon={<Utensils size={20} />}
            detail="Across your menu"
          />

          <MetricItem
            title="Categories"
            value={menu.categories.length}
            icon={<Tags size={20} />}
            detail="Active sections"
          />

          <MetricItem
            title="Available"
            value={availableItems}
            icon={<CheckCircle2 size={20} />}
            detail="Ready to serve"
          />

          <MetricItem
            title="Needs attention"
            value={unavailableItems}
            icon={<XCircle size={20} />}
            detail="Review soon"
          />
        </div>

        <div className="mt-12 grid items-stretch gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-[#e3ded4] bg-[#fbfaf7] p-4 shadow-[0_8px_25px_rgb(24_60_50/0.04)] sm:p-5 xl:min-h-64">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e4b85f]">Shortcuts</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-[#15382f]">Quick actions</h2>

            <div className="mt-4 grid gap-2">
              <QuickAction
                title="Manage Menu"
                description="Add, edit or remove food items."
                href="/admin/items"
                icon={<Utensils size={21} />}
              />

              <QuickAction
                title="Manage Categories"
                description="Organize your restaurant menu."
                href="/admin/categories"
                icon={<Tags size={21} />}
              />

            </div>

            <div className="mt-4 rounded-2xl border border-[#cbdcd1] bg-[#e7efe9] px-3 py-3.5 text-[#15382f]">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#285647]">Menu readiness</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[#cbdcd1] bg-white/80 px-3 py-2">
                  <p className="text-lg font-black leading-none text-[#15382f]">{availableItems}</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#527064]">Available</p>
                </div>
                <div className="rounded-xl border border-[#f1cdbb] bg-[#fff5ed] px-3 py-2">
                  <p className="text-lg font-black leading-none text-[#9f4d31]">{unavailableItems}</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#9f6b58]">Needs attention</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e1d7c8] bg-[#fffdf8] p-5 shadow-[0_8px_25px_rgb(75_53_35/0.06)] sm:p-6 xl:min-h-64">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e4b85f]">Menu health</p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-[#15382f]">Category coverage</h2>
              </div>
              <Tags className="text-[#9a6b2f]" size={20} />
            </div>
            <div className="mt-5 space-y-4">
              {menu.categories.slice(0, 4).map((category) => {
                const itemCount = menu.items.filter((item) => item.categoryId === category.id).length;
                const coverage = menu.items.length ? Math.round((itemCount / menu.items.length) * 100) : 0;

                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate font-semibold text-neutral-700">{category.icon} {category.name}</span>
                      <span className="font-bold text-[#24312f]">{itemCount}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e9e4db]">
                      <div className="h-full rounded-full bg-[#285647]" style={{ width: `${coverage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Recent items */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-[#e1d7c8] bg-[#fffdf8] shadow-[0_12px_35px_rgb(75_53_35/0.06)]">
          <div className="flex items-center justify-between border-b border-[#eee6da] px-5 py-5 sm:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e4b85f]">Catalog snapshot</p>
              <h2 className="mt-1 font-black text-[#15382f]">Recently added items</h2>

              <p className="mt-1 text-xs text-neutral-500">
                Current restaurant menu
              </p>
            </div>

            <Link
              href="/admin/items"
              className="flex items-center gap-1 text-sm font-semibold text-neutral-700 hover:text-neutral-950"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="divide-y divide-[#eee9e1]">
            {menu.items.slice(0, 5).map((item, index) => {
              const category = menu.categories.find((entry) => entry.id === item.categoryId);

              return (
              <div
                key={item.id}
                className="flex flex-wrap items-center gap-3 px-5 py-4 transition hover:bg-white sm:gap-5 sm:px-7"
              >
                <span className="hidden w-5 text-xs font-bold text-[#b9b1a5] sm:block">0{index + 1}</span>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#e9e2d7] ring-1 ring-[#ded5c8]">
                    <MenuImage
                      src={getMenuImageUrl(item.image)}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-neutral-900">{item.name}</p>
                      {item.popular && <span className="hidden rounded-full bg-[#f7e8bd] px-2 py-0.5 text-[10px] font-bold text-[#8a632c] sm:inline">Popular</span>}
                    </div>
                    <p className="mt-1 truncate text-xs text-neutral-500">{category?.icon} {category?.name ?? "Uncategorized"}</p>
                  </div>
                </div>

                <div className="ml-auto shrink-0 text-right">
                  <p className="text-sm font-black text-[#15382f]">AED {item.price}</p>
                <StatusBadge available={item.available} />
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricItem({
  title,
  value,
  icon,
  detail,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  detail: string;
}) {
  return (
    <div className="group relative flex min-h-28 flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-[#d9dfe0] bg-[#fffdf8] p-4 shadow-[0_3px_12px_rgb(24_60_50/0.04)] transition hover:border-[#9fb9ad] hover:shadow-[0_8px_20px_rgb(24_60_50/0.08)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 pt-1 text-xs font-semibold tracking-wide text-neutral-500">{title}</p>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf3ef] text-[#285647]">
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        <p className="text-3xl font-bold leading-none text-[#15382f]">{value}</p>
        <span className="pb-0.5 text-right text-xs text-neutral-400">{detail}</span>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-[#e1d7c8] bg-[#fffdf8] p-3 transition hover:-translate-y-0.5 hover:border-[#d7a28e] hover:shadow-lg sm:p-4"
    >
      <div className="shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7efe9] text-[#285647]">
          {icon}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-neutral-900">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-neutral-500">{description}</p>
      </div>

      <ArrowRight
        size={18}
        className="shrink-0 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-neutral-900"
      />
    </Link>
  );
}

function StatusBadge({
  available,
}: {
  available: boolean;
}) {
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
        available
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

