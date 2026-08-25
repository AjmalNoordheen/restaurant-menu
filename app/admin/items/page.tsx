import Link from "next/link";
import {
  Utensils,
  Tags,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
} from "lucide-react";

import { categories, menuItems } from "@/data/menu";

export default function AdminDashboard() {
  const availableItems = menuItems.filter(
    (item) => item.available
  ).length;

  const unavailableItems = menuItems.filter(
    (item) => !item.available
  ).length;

  return (
    <div>
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white px-5 py-5 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-black text-neutral-900">
              Dashboard
            </h1>
          </div>

          <Link
            href="/admin/items"
            className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">
              Add Item
            </span>
          </Link>
        </div>
      </header>

      <div className="p-5 sm:p-8">
        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Items"
            value={menuItems.length}
            icon={<Utensils size={20} />}
          />

          <StatCard
            title="Categories"
            value={categories.length - 1}
            icon={<Tags size={20} />}
          />

          <StatCard
            title="Available"
            value={availableItems}
            icon={<CheckCircle2 size={20} />}
          />

          <StatCard
            title="Unavailable"
            value={unavailableItems}
            icon={<XCircle size={20} />}
          />
        </div>

        {/* Quick actions */}
        <div className="mt-8">
          <h2 className="text-lg font-black text-neutral-900">
            Quick Actions
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            <QuickAction
              title="Manage Games"
              description="Configure customer waiting games."
              href="/admin/games"
              icon={<Plus size={21} />}
            />
          </div>
        </div>

        {/* Recent items */}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <div>
              <h2 className="font-black text-neutral-900">
                Menu Items
              </h2>

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

          <div className="divide-y divide-neutral-100">
            {menuItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-neutral-900">
                      {item.name}
                    </p>

                    <p className="text-xs text-neutral-500">
                      AED {item.price}
                    </p>
                  </div>
                </div>

                <StatusBadge available={item.available} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-neutral-100 p-3">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm text-neutral-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-black text-neutral-900">
        {value}
      </p>
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
      className="group rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-neutral-100 p-3">
          {icon}
        </div>

        <ArrowRight
          size={18}
          className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-neutral-900"
        />
      </div>

      <h3 className="mt-5 font-bold text-neutral-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-neutral-500">
        {description}
      </p>
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